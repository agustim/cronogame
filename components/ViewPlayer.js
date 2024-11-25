import { useGlobalContext } from "../hooks/useGlobalContext";
import React, { useState, useEffect } from "react";
import {
    Page,
    Navbar,
    Link as KonstaLink,
    Panel,
    List,
    ListItem,
    Button
} from "konsta/react";
import { ViewCard } from "./ViewCard";


export const ViewPlayer = ({ player, active, fnPosition }) => {


    const cardsPlayer = (player) => {

        const uncoveredCards = player.cronology.filter(card => card.uncovered);

        return (uncoveredCards.map((card, index) => (
            <>
                {(active) && (
                <List>
                    <Button onClick={()=>fnPosition(index)}>
                        {(index > 0) && uncoveredCards[index - 1].year} - {card.year}
                    </Button>
                </List>
                )}
                <List>
                    <ViewCard card={card} key={index} />
                </List>
                { ( (active)  && (index === uncoveredCards.length - 1)) && (
                    <List>
                        <Button onClick={()=>fnPosition(index+1)}>
                            {card.year} - 
                        </Button>
                    </List>
                )}
            </>
        )))
    }

    if (!player) return null;

    return (

        <div className={(active) ? "bg-green-100" : ""}>
            <List>
                {player.name}
            </List>

            {cardsPlayer(player)}

        </div >

    )
}