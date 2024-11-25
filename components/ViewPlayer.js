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


    const cardsPlayer = (player) => {
        return (player.cronology.filter(card => card.uncovered).map((card, index) => (

            <div key={index}>
                <ViewCard card={card} />
            </div>
        )))
    }

    if (!player) return null;

    return (

        <>
            <h1>{player.name}</h1>
            <List>
                { cardsPlayer(player) }
            </List>
        </>

    )
}