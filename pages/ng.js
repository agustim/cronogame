import React, { use, useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { Page, Button, Navbar, Block, ListInput, List, Tabbar, TabbarLink } from 'konsta/react';
import { useGlobalContext } from "../hooks/useGlobalContext";
import { ViewPlayer } from '../components/ViewPlayer';

export default function Home() {

    const { game } = useGlobalContext();
    const [players, setPlayers] = useState("[]");
    const [activeTab, setActiveTab] = useState();
    const [player, setPlayer] = useState();
    const [activePlayer, setActivePlayer] = useState(0);
    const [activeBidPlayerName, setActiveBidPlayerName] = useState("");

    const updateBidPlayer = () => {
        console.log("game.activeBidPlayer:", game.activeBidPlayer,game.players[game.activeBidPlayer].name)
        setActiveBidPlayerName(game.players[game.activeBidPlayer].name);
    }

    const updatePlayers = () => {
        setPlayers(JSON.stringify(game.players));
        console.log("Players: ", players, game.players);
        setActiveTab(game.players[game.activePlayer].name);
        //set player when name is activeTab
        setPlayer(game.players.find(player => player.name === game.players[game.activePlayer].name));
        setActivePlayer(game.activePlayer);
        updateBidPlayer()
    }


    const getCard = () => {
        game.getCard();
        updatePlayers();
    }

    const selectCard = () => {
        if (game.selectCardInBids()) {
        //game.selectCardInPlayer(position, []);
            updatePlayers();
        }
    }

    
    useEffect(() => {
        console.log("init game");
        console.log(game.players.length);
        game.addPlayer(game.initPlayer("Player 1"));
        game.addPlayer(game.initPlayer("Player 2"));
        game.addPlayer(game.initPlayer("Player 3"));
        setActiveTab(game.players[0].name);
        game.startGame();
       
    }, []);


    return (
        <Page>
            <Navbar title="Cronology" />
            <Block>
            </Block>
            <Block>
                <Button onClick={getCard} text="Get Card">Get Card</Button>
            </Block>
            <Block>
                <Button onClick={()=>{console.log(game.viewActiveCard())}}>Active Card</Button>
            </Block>
            <Block>
                <Button onClick={selectCard} text="Select Cronology">Cronolgoy</Button>
            </Block>
            <Block>
                {activePlayer} 
                {
                    (activeBidPlayerName != "") &&
                        <>
                        - {activeBidPlayerName}
                        </>
                }
            </Block>
            <Block>
                <Tabbar
                    labels
                    className="left-0 bottom-0 fixed">
                {
                    
                    JSON.parse(players).map((player, index) => (
                        <TabbarLink 
                            active={activeTab === player.name}
                            key={index}
                            onClick={() => setActiveTab(player.name)}
                            label={player.name}
                            />
                    ))
                }
                </Tabbar>
                { 
                    JSON.parse(players).map((player, index) => (
                        (player?.name == activeTab) && 
                            <ViewPlayer 
                                key={index} 
                                player={player} 
                                active={(game.activePlayer == index)} 
                                updateBidPlayer={updateBidPlayer}
                            />
                    ))
                }
            </Block>
        </Page>
    )
}
