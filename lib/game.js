// Extendre de la classe EventEmitter
import EventEmitter from 'events';


class Game extends EventEmitter {
    constructor(data) {
        super();
        this.cards = this.createUniverseOfCards(data);
        this.players = [];
        this.status = 'not start';
        this.activePlayer = null;
        this.activeCard = null;
        this.bids = [];
        this.activeBidPlayer = null;
        this.ENDGAMECARDS = 10;
        this.debugLevel = 1;
    }

    createUniverseOfCards(data) {
        if (!data) {
            return [];
        } else {
            data.forEach(card => card.used = false);
            return data;
        }
    }

    listenToEvents() {
        this.on('get-card', () => {
            this.getCard();
        });
        this.on('select-cronology', () => {
            this.selectCronology();
        });
        this.on('next-player', () => {
            this.nextPlayer();
        });
        this.on('bids-players', () => {
            this.bidsOtherPlayers();
        });
        this.on('evaluate-round', () => {
            this.evaluateRound();
        });
        this.on('end-game', () => {
            this.endGame();
        });
    }

    serialize() {
        return JSON.stringify(this);
    }

    deserialize(data) {
        return JSON.parse(data);
    }

    addPlayer(player) {
        this.players.push(player);
        if (this.activePlayer === null) {
            this.activePlayer = 0;
        }
    }
    initPlayer(name) {
        return {
            name: name,
            cronology: [],
            comodins: 2
        }
    }

    startGame() {
        this.log('Game started');
        if (this.players.length === 0) {
            this.log('Add players to start the game.');
            return;
        }
        // Select active player
        this.activePlayer = 0;
        this.activeBidPlayer = 0;
        this.emit('get-card');
    }

    isTheEnd() {
        // If one player has in his cronology this.ENDGAMECARDS cards, the game is over
        let end = false;
        this.players.forEach(player => {
            if (player.cronology.length === this.ENDGAMECARDS) {
                end = true;
            }
        });
        return end;
    }

    getCard() {
        this.debug();
        // Estem al final de la partida?
        if (this.isTheEnd()) {
            this.emit('end-game');
            return;
        }
        this.status = 'get card'
        // Logic to get a card
        const player = this.players[this.activePlayer];
        const card = this.getRandomCard();
        this.log('Get card', card);

        if (player.cronology.length === 0) {
            // Add card to player
            card.uncovered = true;
            player.cronology.push(card);
            this.log('Player', player);
            this.nextPlayer();
        } else {
            // De moment no l'afegim a la cronologia
            // player.cronology.push(card);
            this.selectCronology();
        }
    }

    selectCronology() {
        this.debug();
        this.log('Select cronology');
        this.status = 'select-cronology'
        // Logic to select cronology

    }

    pushCardInPlayer(card, player) {
        card.uncovered = true;
        player.cronology.push(card);
        // Sort cronology by year
        player.cronology.sort((a, b) => a.year - b.year);
    }

    selectCardInBids() {
        if (this.bids.length === 0) {
            this.log('No bids');
            return false;
        }
        const positionBid = this.bids.filter(bid => bid.playerIndex === this.activePlayer);
        if (positionBid.length !== 1) {
            this.log('No bid for active player');
            return false;
        }
        const otherPlayers = this.bids.filter(bid => bid.playerIndex !== this.activePlayer);
        console.log(positionBid, otherPlayers);
        this.selectCardInPlayer(positionBid[0].position, otherPlayers);
        this.bids = [];
        return true;
    }

    checkCardInPositionOfCards(card, position, cardsCronology) {

        this.log(position);
        const playerCardsSortedByYear = cardsCronology.sort((a, b) => a.year - b.year);

        this.log(`actual: ${card.year} : ${position}`);
        if (position < playerCardsSortedByYear.length) {
            this.log(`${playerCardsSortedByYear[position].year}`);
        } else {
            this.log(`${playerCardsSortedByYear[position - 1].year}`);
        }
        return (((position == 0) && (card.year <= playerCardsSortedByYear[position].year))
            || ((position == playerCardsSortedByYear.length) && (card.year >= playerCardsSortedByYear[position - 1].year))
            || ((position > 0) && (position < playerCardsSortedByYear.length)
                && (card.year >= playerCardsSortedByYear[position - 1].year)
                && (card.year <= playerCardsSortedByYear[position].year)))
    }



    selectCardInPlayer(position, otherPlayers) {

        let cardAssigned = false;

        this.log('Select card in player');
        // Determine if card year is greater than the previous or equal card and less or equal than the next card

        const card = this.cards[this.activeCard];
        if (this.checkCardInPositionOfCards(card, position, this.players[this.activePlayer].cronology)) {
            // Correcte per tant posem la carta.
            this.pushCardInPlayer(card, this.players[this.activePlayer]);
            cardAssigned = true;
            this.log('Correcte');
        }
        // Validar els altres jugadors
        // El format de ohterPlayers és un { bird : playerIndex, position: position }
        this.log('Validar, o treure els comodins els altres jugadors');
        otherPlayers.forEach(bid => {
            const player = this.players[bid.playerIndex];
            if (this.checkCardInPositionOfCards(card, bid.position, player.cronology) && (!cardAssigned)) {
                this.pushCardInPlayer(card, player);
                cardAssigned = true;
                this.log(`Correcte - Player ${player.name}`);
            } else {
                player.comodins--;
                this.log(`Incorrecte - Player ${player.name}`);
            }
        });
        if (!cardAssigned) {
            this.log('Card unassigned');
        }
        this.nextPlayer();
        this.debug()
    }

    isBidPositionUsed(position) {
        return this.bids.find(bid => bid.position === position);
    }

    bidPlayer(playerIndex, position) {
        this.debug();
        this.log('Bids player');
        // Validate position is not used
        if (this.isBidPositionUsed(position)) {
            this.log('Position already used');
            return;
        }
        // Logic to bid player
        this.bids.push({ playerIndex, position });
        this.log(this.bids);
    }

    bidActivePlayer(position) {
        if (this.activeBidPlayer === null) {
            this.log('No active bid player');
            return;
        }
        const player = this.players[this.activeBidPlayer];
        if (player.comodins <= 0) {
            this.log('No comodins');
            return;
        }
        this.bidPlayer(this.activeBidPlayer, position);
        this.nextBidPlayer();
    }

    nextBidPlayer() {
        this.activeBidPlayer++;
        if (this.activeBidPlayer >= this.players.length) {
            this.activeBidPlayer = 0;
        }
        if (this.activeBidPlayer === this.activePlayer) {
            // No hi ha més bidsPlayers, tots han apostat.
            this.activeBidPlayer = null;
        }
    }

    bidsOtherPlayers() {
        this.debug();
        this.log('Bids other players');
        // Logic to bid other players
        this.select = 'bids players';
        this.evaluateRound();

    }

    evaluateRound() {
        this.debug();
        this.log('Evaluate round');
        // Logic to evaluate round
        this.select = 'evaluate round';
        this.nextPlayer();
    }

    nextPlayer() {
        this.debug();
        this.status = 'next player'
        // Logic to select next player
        this.activePlayer++;
        if (this.activePlayer >= this.players.length) {
            this.activePlayer = 0;
        }
        this.activeBidPlayer = this.activePlayer;
        this.log(`Next player player = ${this.players[this.activePlayer].name}`);
        this.getCard();
    }

    getRandomCard() {
        // Check cards are loaded
        if (this.cards.length === 0) {
            this.log('No cards loaded');
            return;
        }
        let universeUnusedCards = this.cards.filter(card => !card.used);
        if (universeUnusedCards.length === 0) {
            this.log("Reset all cards");
            this.cards.forEach(card => card.used = false);
            universeUnusedCards = this.cards.filter(card => !card.used);
        }
        let randomIndex = Math.floor(Math.random() * universeUnusedCards.length);
        // find first card that is not used
        let card = universeUnusedCards[randomIndex];
        // Search the card in the original list
        let index = this.cards.findIndex(c => c.id === card.id);
        this.activeCard = index;
        this.log(this.activeCard, this.cards[this.activeCard]);
        this.cards[this.activeCard].used = true;
        return card;

    }

    endGame() {
        this.log('Game ended');
        this.status = 'ended';
    }

    debug() {
        const gameView = { ...this }
        delete gameView.cards;
        this.log("Debug");
        this.log(gameView);
    }
    log(txt) {
        if (this.debugLevel > 0) {
            console.log(txt);
        }
    }
    viewActiveCard() {
        return this.cards[this.activeCard];
    }
}

export default Game;

