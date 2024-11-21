import React, { useState, useEffect } from 'react';
import playlist from '../data/playlist.small.json';
import Game from '../lib/game.js';

// export interface Card {
//     id: string;
//     title: string;
//     artist: string;
//     year: number;
//     url: string;
//     type: string;
//     source: string;
// }

// export interface Player {
//     name: string;
//     cronologi: Card[];
//     comodins: number;
// }


export const GlobalContext = React.createContext({
    game: null,
    setGame: (value) => { },
    universeCards: playlist,
    setUniverseCards: (value) => { },
    activeCard: null,
    setActiveCard: (value) => { },
    players: [],
    setPlayers: (value) => { },
    activePlayer: null,
    setActivePlayer: (value) => { },
    getRandomCard: () => { },
    addPlayer: (player) => { },
    initActivePlayer: () => { },
    initPlayer: (name) => { },
    nextActivePlayer: () => { },
    addCardToPlayer: (player, card) => { }
})

export const GlobalContextProvider = (props) => {
    const [universeCards, setUniverseCards] = useState(playlist);
    const [activeCard, setActiveCard] = useState(null);
    const [players, setPlayers] = useState([]);
    const [activePlayer, setActivePlayer] = useState(null);

    const [game, setGame] = useState(new Game(playlist));

    const addPlayer = (player) => {
        console.log("addPlayer");
        players.push(player);
    }

    const initActivePlayer = () => {
        console.log(typeof setActivePlayer);
        console.log(setActivePlayer);
        console.log(players);
        setActivePlayer({ player: players[0], idx: 0 });
    }

    const initPlayer = (name) => {
        return { name, cronology: [], comodins: 2 }
    }
    
    const nextActivePlayer = () => {
        let idx = activePlayer.idx + 1;
        if (idx >= players.length) {
            idx = 0;
        }
        setActivePlayer({ player: players[idx], idx });
    }

    const getRandomCard = () => {

        console.log(universeCards);
        // Get universeCards from context
    
        console.log("getRandomCard");
        // filtrar universeCards para que solo sean las que no han sido usadas
        let universeUnusedCards = universeCards.filter(card => !card.used);
        if (universeUnusedCards.length === 0) {
            // Reset all cards
            console.log("Reset all cards");
            universeCards.forEach(card => card.used = false);
            setUniverseCards([...universeCards]);
            universeUnusedCards = universeCards.filter(card => !card.used);
        }
        let randomIndex = Math.floor(Math.random() * universeUnusedCards.length);
        // find first card that is not used
        let card = universeUnusedCards[randomIndex];
        // Search the card in the original list
        let index = universeCards.findIndex(c => c.id === card.id);
        universeCards[index].used = true;
        setUniverseCards([...universeCards]);
        setActiveCard(card);
        return card;
    }

    const addCardToPlayer = (player, card) => {
        player.cronology.push(card);
    }


    return (
        <GlobalContext.Provider
            value={{
                game,
                setGame,
                universeCards,
                setUniverseCards,
                activeCard,
                setActiveCard,
                players,
                setPlayers,
                activePlayer,
                setActivePlayer,
                getRandomCard,
                addPlayer,
                initActivePlayer,
                initPlayer,
                nextActivePlayer,
                addCardToPlayer
            }}>
            {props.children}
        </GlobalContext.Provider>
    )
}
