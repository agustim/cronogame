import { useGlobalContext } from "../hooks/useGlobalContext";
import React, { useState, useEffect } from "react";
import {
    Page,
    Navbar,
    Link as KonstaLink,
    Panel,
    Card,
    ListItem,
} from "konsta/react";


export const ViewCard = ({ card }) => {

    // If card.uncovered exists and is true, show name, year and artist
    // else show only "Covered" with border and onclick set card.uncovered to true 
    // classname border


    return (
            <div className={"border"}>
                {card.uncovered ? (

                    <Card outline header={card.title} footer={card.artist} className="">
                        {card.year}
                    </Card>
                ) : (
                    <h1>Covered</h1>
                )}
            </div>
    )

}