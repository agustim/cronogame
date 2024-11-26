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


export const ViewPlayer = ({ player, active }) => {

    const activeColor = "bg-green-500";
    const inactiveColor = "bg-gray-300";

    const { game } = useGlobalContext();
    const numberPositions = player.cronology.filter(card => card.uncovered).length;
    const [bids, setBids] = useState("[]");
    const initialPositionsColors = Array.from({ length: numberPositions + 1 }, () => activeColor)
    const [positionsColors, setPositionsColors] = useState(JSON.stringify(initialPositionsColors));

    const updateBid = (position) => {
        game.bidActivePlayer(position);
        setBids(JSON.stringify(game.bids));
        console.log("ViewPlayer: bids", game.bids, bids);
    }

    const generatePositionsColors = () => {
        const localBids = JSON.parse(bids);
        // in localBids, existe player and postion, convert all positions to gray
        let localPositionsColors = JSON.parse(positionsColors);
        localBids.forEach(bid => {
            localPositionsColors[bid.position] = inactiveColor;
        })
        setPositionsColors(JSON.stringify(localPositionsColors));
    }

    const bgColor = (position) => {
        const localPositionsColors = JSON.parse(positionsColors);
        return localPositionsColors[position];
    }

    useEffect(() => {
        generatePositionsColors();
        console.log("bids", game.bids, positionsColors);
    }, [bids]);


    const BidButton = ({firstYear, lastYear, position}) => {

        return (
            <List>
                <Button onClick={() => updateBid(position)} className={bgColor(position)}>
                    {firstYear} - {lastYear}
                </Button>
            </List>
        )
    }

    const cardsPlayer = (player) => {

        const uncoveredCards = player.cronology.filter(card => card.uncovered);

        return (uncoveredCards.map((card, index) => (
            <div key={index}>
                {(active) && (
                    <BidButton
                        firstYear={(index > 0) && uncoveredCards[index - 1].year}
                        lastYear={card.year}
                        position={index} />
                )}
                <List>
                    <ViewCard card={card} key={index} />
                </List>
                {((active) && (index === uncoveredCards.length - 1)) && (
                    <BidButton
                        firstYear={card.year}
                        lastYear=""
                        position={index + 1} />
                )}
            </div>
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