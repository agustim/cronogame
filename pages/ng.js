import React, { use, useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { Page, Button, Navbar, Block } from 'konsta/react';
import { useGlobalContext } from "../hooks/useGlobalContext";
import { ViewPlayer } from '../components/ViewPlayer';
import Game from '../lib/game.js';

export default function Home() {

    const { game } = useGlobalContext();

    
    useEffect(() => {
        game.addPlayer(game.initPlayer("Player 1"));
        game.addPlayer(game.initPlayer("Player 2"));
        game.addPlayer(game.initPlayer("Player 3"));
        //game.initActivePlayer();
        game.startGame();
        console.log(game.serialize());
    }, []);

    return (
        <Page>
            <Navbar title="Cronology" />
            <Block>
            </Block>
            <Block>
                <Button onClick={() => game.getCard()} text="Get Card">Get Card</Button>
            </Block>
            <Block>
                <Button onClick={() => game.selectCronology()} text="Select Cronology">Cronolgoy</Button>
            </Block>
            <Block>
                <Button onClick={() => game.endGame()} text="End">End</Button>
            </Block>
        </Page>
    )
}
