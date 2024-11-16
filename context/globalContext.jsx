import React, { useState, useEffect } from 'react';
import playlist from '../data/playlist.json';

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


export const GlobalContext = React.createContext({
    universeCards: playlist,
    setUniverseCards: (value) => { },
    activeCard: null,
    setActiveCard: (value) => { },
    players: [],
    setPlayers: (value) => { },
    activePlayer: 0,
    setActivePlayer: (value) => { },
    getRandomCard: () => getRandomCard(playlist, (value) => { })
})

export const GlobalContextProvider = (props) => {
    const [universeCards, setUniverseCards] = useState(playlist);
    const [activeCard, setActiveCard] = useState(null);
    const [players, setPlayers] = useState([]);
    const [activePlayer, setActivePlayer] = useState(0);

    return (
        <GlobalContext.Provider
            value={{
                universeCards,
                setUniverseCards,
                activeCard,
                setActiveCard,
                players,
                setPlayers,
                activePlayer,
                setActivePlayer,
                getRandomCard,
            }}>
            {props.children}
        </GlobalContext.Provider>
    )
}
