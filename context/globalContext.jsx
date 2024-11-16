import React, { useState, useEffect } from 'react';
import playlist from '../data/playlist.small.json';

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


const getRandomCard = (universeCards, setUniverseCards) => {

    console.log(universeCards);
    // Get universeCards from context
    //const { universeCards, setUniverseCards, setActiveCard } = useContext(GlobalContext);

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
    return card;
}

const initActivePlayer = (players, setActivePlayer) => {
    setActivePlayer({ player: players[0], idx: 0 });
}

const addPlayer = (players, setPlayers, player) => {
    console.log("addPlayer");
    console.log(player);
    console.log([...players, player]);
    setPlayers([...players, player]);
}


export const GlobalContext = React.createContext({
    universeCards: playlist,
    setUniverseCards: (value) => { },
    activeCard: null,
    setActiveCard: (value) => { },
    players: [],
    setPlayers: (value) => { },
    addPlayer: (players, value) => addPlayer(players, (value) => {}, value),
    activePlayer: null,
    setActivePlayer: (value) => { },
    initActivePlayer: (players) => initActivePlayer(players, (value) => { }),
    nextActivePlayer: () => { if (activePlayer.idx < players.length - 1) { setActivePlayer({player: players[activePlayer.idx + 1], idx: activePlayer.idx + 1}) } else { setActivePlayer({player: players[0], idx: 0}) } },
    getRandomCard: () => getRandomCard(playlist, (value) => { }),
    initPlayer: (name) => { return { name, cronology: [], comodins: 2 } }
})

export const GlobalContextProvider = (props) => {
    const [universeCards, setUniverseCards] = useState(playlist);
    const [activeCard, setActiveCard] = useState(null);
    const [players, setPlayers] = useState([]);
    const [activePlayer, setActivePlayer] = useState({});

    return (
        <GlobalContext.Provider
            value={{
                universeCards,
                setUniverseCards,
                activeCard,
                setActiveCard,
                players,
                setPlayers,
                addPlayer,
                activePlayer,
                setActivePlayer,
                initActivePlayer,
                nextActivePlayer,
                getRandomCard,
                initPlayer
            }}>
            {props.children}
        </GlobalContext.Provider>
    )
}
