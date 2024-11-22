import React, { use, useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { Page, Button, Navbar, Block, ListInput } from 'konsta/react';
import { useGlobalContext } from "../hooks/useGlobalContext";
import { ViewPlayer } from '../components/ViewPlayer';
import Game from '../lib/game.js';

export default function Home() {

    const { game } = useGlobalContext();
    const [refresh, setRefresh] = useState(false);
    const [position, setPosition] = useState(0);
    const onChangePosition = (e) => {
        setPosition(e.target.value);
    }

    
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
                <ListInput onChange={onChangePosition} label="position" type="text" placeholder="Position" />
                <Button onClick={() => game.selectCardInPlayer(position,[])} text="Select Cronology">Cronolgoy</Button>
            </Block>
            <Block>
                <Button onClick={() => game.endGame()} text="End">End</Button>
            </Block>

            <Block>
                {
                    (refresh) && (  
                        game.players.map((player, index) => {
                            return <ViewPlayer key={index} player={player} />
                        })
                    )
                }
            </Block>
        </Page>
    )
}
