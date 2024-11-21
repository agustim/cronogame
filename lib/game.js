// Extendre de la classe EventEmitter
import EventEmitter from 'events';


class Game extends EventEmitter {
    constructor(data) {
        super();
        this.cards = this.createUniverseOfCards(data);
        this.players = [];
        this.status = 'not start';
        this.activePlayer = null;
    }

    createUniverseOfCards(data) {
        if (!data) {
            return [];
        } else {
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
            comodins: 0
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
        // If one player has in his cronology 10 cards, the game is over
        let end = false;
        this.players.forEach(player => {
            if (player.cronology.length === 10) {
                end = true;
            }
        });
        return end;
    }

    getCard() {
        // Estem al final de la partida?
        if (this.isTheEnd()) {
            this.emit('end-game');
            return;
        }
        this.status = 'get card'
        // Logic to get a card
        const player = this.players[this.activePlayer];
        const card = this.getRandomCard();
        if (player.cronology.length === 0) {
            // Add card to player
            card.uncovered = true;
            player.cronology.push(card);
            this.emit('next-player');
        } else {
            player.cronology.push(card);
            this.emit('select-cronology');
        }
    }

    selectCronology() {
        console.log('Select cronology');
        this.status = 'select-cronology'
        // Logic to select cronology

        //this.emit('bids-players');

    }

    bidsOtherPlayers() {
        console.log('Bids other players');
        // Logic to bid other players
        this.select = 'bids players';
        this.emit('evaluate-round');

    }

    evaluateRound() {
        console.log('Evaluate round');
        // Logic to evaluate round
        this.select = 'evaluate round';
        this.emit('next-player');
    }

    nextPlayer() {
        this.status = 'next player'
        // Logic to select next player
        this.activePlayer++;
        if (this.activePlayer >= this.players.length) {
            this.activePlayer = 0;
        }
        this.on('get-card');
    }

    getRandomCard() {

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
        this.cards[index].used = true;
        return card;

    }

    endGame() {
        console.log('Game ended');
        this.status = 'ended';
    }
}

export default Game;

