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
        this.ENDGAMECARDS = 10;
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
        console.log('Game started');
        if (this.players.length === 0) {
            console.log('Add players to start the game.');
            return;
        }
        // Select active player
        this.activePlayer = 0;
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
        console.log('Get card', card);

        if (player.cronology.length === 0) {
            // Add card to player
            card.uncovered = true;
            player.cronology.push(card);
            console.log('Player', player);
            this.nextPlayer();
        } else {
            // De moment no l'afegim a la cronologia
            // player.cronology.push(card);
            this.selectCronology();
        }
    }

    selectCronology() {
        this.debug();
        console.log('Select cronology');
        this.status = 'select-cronology'
        // Logic to select cronology

        //this.emit('bids-players');
    }

    checkCardInPositionOfCards(card, position, cardsCronology) {
        
        console.log(position);
        const playerCardsSortedByYear = cardsCronology.sort((a, b) => a.year - b.year);

        console.log(`actual: ${card.year} : ${position}`);
        if (position < playerCardsSortedByYear.length) {
            console.log(`${playerCardsSortedByYear[position].year}`);
        } else {
            console.log(`${playerCardsSortedByYear[position-1].year}`);
        }
        return (((position == 0) && (card.year <= playerCardsSortedByYear[position].year))
            || ((position == playerCardsSortedByYear.length) && (card.year >= playerCardsSortedByYear[position - 1].year))
            || ((position > 0) && (position < playerCardsSortedByYear.length)
                && (card.year >= playerCardsSortedByYear[position - 1].year)
                && (card.year <= playerCardsSortedByYear[position].year)))
    }
    pushCardInPlayer(card, player) {
        card.uncovered = true;
        player.cronology.push(card);
        // Sort cronology by year
        player.cronology.sort((a, b) => a.year - b.year);
    }

    selectCardInPlayer(position, otherPlayers) {

        let cardAssigned = false;

        console.log('Select card in player');
        // Determine if card year is greater than the previous or equal card and less or equal than the next card

        const card = this.cards[this.activeCard];
        if  (this.checkCardInPositionOfCards(card, position, this.players[this.activePlayer].cronology)) {
            // Correcte per tant posem la carta.
            this.pushCardInPlayer(card, this.players[this.activePlayer]);
            cardAssigned = true;
            console.log('Correcte');
            // Treiem totes les apostes de la resta de jugadors
            otherPlayers.forEach(bid => {
                const player = this.players[bid.playerIndex];
                if (player.comodins <= 0) {
                    console.log('Something wrong');
                }
                player.comodins--;
            })
        } else {
            // Validar els altres jugadors
            // El format de ohterPlayers és un { bird : playerIndex, position: position }
            console.log('Validar els altres jugadors');
            otherPlayers.forEach(bid => {
                const player = this.players[bid.playerIndex];
                if (this.checkCardInPositionOfCards(card, bid.position, player.cronology)) {
                    this.pushCardInPlayer(card, player);
                    cardAssigned = true;
                    console.log(`Correcte - Player ${player.name}`);
                } else {
                    player.comodins--;
                    console.log(`Incorrecte - Player ${player.name}`);
                }
            });      
        }
        if (!cardAssigned) {
            console.log('Card unassigned');
        }
        this.nextPlayer();
        this.debug()
    }

    bidsOtherPlayers() {
        this.debug();
        console.log('Bids other players');
        // Logic to bid other players
        this.select = 'bids players';
        this.evaluateRound();

    }

    evaluateRound() {
        this.debug();
        console.log('Evaluate round');
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
        console.log(`Next player player = ${this.players[this.activePlayer].name}`);
        this.getCard();
    }

    getRandomCard() {
        // Check cards are loaded
        if (this.cards.length === 0) {
            console.log('No cards loaded');
            return;
        }
        let universeUnusedCards = this.cards.filter(card => !card.used);
        if (universeUnusedCards.length === 0) {
            console.log("Reset all cards");
            this.cards.forEach(card => card.used = false);
            universeUnusedCards = this.cards.filter(card => !card.used);
        }
        let randomIndex = Math.floor(Math.random() * universeUnusedCards.length);
        // find first card that is not used
        let card = universeUnusedCards[randomIndex];
        // Search the card in the original list
        let index = this.cards.findIndex(c => c.id === card.id);
        this.activeCard = index;
        console.log(this.activeCard, this.cards[this.activeCard]); 
        this.cards[this.activeCard].used = true;
        return card;

    }

    endGame() {
        console.log('Game ended');
        this.status = 'ended';
    }

    debug() {
        const gameView = {...this} 
        delete gameView.cards;
        console.log("Debug");
        console.log(gameView);
    }
}

export default Game;

