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

    const activePosition = true;
    const inactivePosition = false;

    const { game } = useGlobalContext();
    const numberPositions = player.cronology.filter(card => card.uncovered).length;
    const [bids, setBids] = useState("[]");
    const initialPositionsActives = Array.from({ length: numberPositions + 1 }, () => activePosition)
    const [positionsActives, setPositionsActives] = useState(JSON.stringify(initialPositionsActives));
    const [activeBidPlayer, setActiveBidPlayer] = useState("");

    const updateBid = (position) => {
        game.bidActivePlayer(position);
        setBids(JSON.stringify(game.bids));
        console.log("ViewPlayer: bids:", game.bids, bids);
        console.log("ActiveBidPlayer:", game.activeBidPlayer);
        if (game.activeBidPlayer !== null) {
            setActiveBidPlayer(game.players[game.activeBidPlayer].name);
        } else {
            setActiveBidPlayer("");
        }
        console.log("ViewPlayer: bids", game.bids, bids);
    }

    const updateNoBid = () => {
        game.nextBidPlayer();
        setBids(JSON.stringify(game.bids));
        if (game.activeBidPlayer !== null) {
            setActiveBidPlayer(game.players[game.activeBidPlayer].name);
        } else {
            setActiveBidPlayer("");
        }
        console.log("ViewPlayer: bids", game.bids, bids);
    }

    const isBidOtherPlayer = () => {
        const localBids = JSON.parse(bids);
        return (localBids.length >= 1 && activeBidPlayer !== "");
    }

    const generatePositionsActives = () => {
        const localBids = JSON.parse(bids);
        // in localBids, existe player and postion, convert all positions to gray
        let localPositionsActives = JSON.parse(positionsActives);
        localBids.forEach(bid => {
            localPositionsActives[bid.position] = inactivePosition;
        })
        setPositionsActives(JSON.stringify(localPositionsActives));
    }

    const isActive = (position) => {
        const localPositionsActives = JSON.parse(positionsActives);
        return localPositionsActives[position];
    }

    const playerBirInPosition = (position) => {
        const plyIndex = game.bids.filter(bid => bid.position === position)[0].playerIndex;
        const player = game.players[plyIndex];
        console.log("playerBirInPosition", player, plyIndex);
        return player.name;
    }

    useEffect(() => {
        generatePositionsActives();
        console.log("bids", game.bids, positionsActives);
    }, [bids]);


    const BidButton = ({firstYear, lastYear, position}) => {

        return (
            <>
                { (isActive(position)) && ( 
                <Button onClick={() => updateBid(position)} className="k-color-button-green">
                    {firstYear} - {lastYear}
                </Button>
                ) || (
                    <Button className="k-color-button-gray">
                        {firstYear} - {lastYear} {playerBirInPosition(position)}
                    </Button>
                )}
            </>
        )
    }

    const cardsPlayer = (player) => {

        const uncoveredCards = player.cronology.filter(card => card.uncovered);

        return (uncoveredCards.map((card, index) => (
            <div key={index} id={"index_" + index}>
                {(active) && (
                    <BidButton
                        firstYear={(index > 0) && uncoveredCards[index - 1].year}
                        lastYear={card.year}
                        position={index} />
                )}
                <ViewCard card={card} key={index} />
                {((active) && (index === uncoveredCards.length - 1)) && (
                    <BidButton
                        firstYear={card.year}
                        lastYear=""
                        position={index + 1} />
                )}
                { /* Poder no apostar */
                    (isBidOtherPlayer() && (index === uncoveredCards.length - 1)) && (
                            <Button onClick={updateNoBid} className="k-color-button-red">
                                No apostar - {activeBidPlayer}
                            </Button>
                    )
                }
            </div>
        )))
    }

    if (!player) return null;

    return (

        <div className={(active) ? "bg-green-100" : ""}>
            <List>
                {player.name} ({player.comodins} comodins)
            </List>

            {cardsPlayer(player)}

        </div >

    )
}