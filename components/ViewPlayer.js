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

    useEffect(() => {
        console.log("ViewPlayer: ", player);
    }, []);

    return (

        <>
            <h1>{player.name}</h1>
            <List>
                {player.cronology.map((card) => {
                    return (
                        <ViewCard card={card} />
                    );
                })}
            </List>
        </>

    )
}