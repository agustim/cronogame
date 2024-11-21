import { useGlobalContext } from "../hooks/useGlobalContext";
import React, { useState, useEffect } from "react";
import {
    Page,
    Navbar,
    Link as KonstaLink,
    Panel,
    List,
    ListItem,
} from "konsta/react";
import { ViewCard } from "./ViewCard";


export const ViewPlayer = ({ player }) => {

    const [uncoveredCards, setUncoveredCards] = useState([]);

    useEffect(() => {
        console.log("ViewPlayer: ", player);
        // Get all uncovered cards from player
        setUncoveredCards(player.cronology.filter(card => card.uncovered));
        const coveredCards = player.cronology.filter(card => !card.uncovered);
        console.log("Uncovered cards: ", uncoveredCards, " Covered cards: ", coveredCards);
    }, []);

    return (

        <>
            <h1>{player.name}</h1>
            <List>
                { uncoveredCards.map((card, index) => (
                    <React.Fragment key={index}>
                        <div>
                        {index > 0 && uncoveredCards[index-1]}
                        </div>
                        <ViewCard card={card} />
                    </React.Fragment>
                ))}
            </List>
        </>

    )
}