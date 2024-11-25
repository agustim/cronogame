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


export const ViewCard = ({ card }) => {

    // If card.uncovered exists and is true, show name, year and artist
    // else show only "Covered" with border and onclick set card.uncovered to true 
    // classname border

    const uncoverCard = () => {
        setUncovered(true);
    }


    return (
        <ListItem>
                <div className={"border"} onClick={uncoverCard}>
                    {card.uncovered ? (
                        <>
                            <h1>{card.title}</h1>
                            <h2>{card.artist}</h2>
                            <h3>{card.year}</h3>
                        </>
                    ) : (
                        <h1>Covered</h1>
                    )}
                </div>
        </ListItem>
    )

}