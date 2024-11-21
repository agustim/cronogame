import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { Page, Button, Navbar, Block } from 'konsta/react';
import { useGlobalContext } from "../hooks/useGlobalContext";
import { ViewPlayer } from '../components/ViewPlayer';

export default function Home() {
  // Define playing state
  const { universeCards, getRandomCard, activeCard, players, setPlayers, activePlayer, setActivePlayer, addPlayer
    , initActivePlayer, initPlayer, nextActivePlayer, addCardToPlayer } = useGlobalContext();
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState(null);
  const [widthPlayer, setWidthPlayer] = useState(300);
  const [heightPlayer, setHeightPlayer] = useState(200);
  const [status, setStatus] = useState("init");
  const [activePlayerReload, setActivePlayerReload] = useState(null);

  useEffect(() => {
    // Define example players when player have name, array of cards, and comodins.    
    addPlayer(initPlayer("Player 1")); 
    addPlayer(initPlayer("Player 2"));
    addPlayer(initPlayer("Player 3"));
    initActivePlayer();
    setStatus("select-players");
  }, []);

  useEffect(() => {
    if (status === "select-players") {
      console.log("Players: ", players);
      console.log("Active Player: ", activePlayer);
      setStatus("get-card");
    }
    console.log("Status: ", status);
    if (status === "select-cronology") {
      if (activePlayer && activePlayer.player.cronology.length == 0) {
        console.log("Add card to player");
        activeCard.uncovered = true;
        addCardToPlayer(activePlayer.player, activeCard);
        setActivePlayerReload(true);
        nextActivePlayer();
        setStatus("get-card");
      } else if (activePlayer && activePlayer.player.cronology.length > 0) {
        console.log("View player");
        addCardToPlayer(activePlayer.player, activeCard);
        setActivePlayerReload(true);
      }
    }
  }, [status]);

  useEffect(() => {
    if (activePlayerReload) {
      setActivePlayerReload(false);
    }
  }, [activePlayerReload]);

  const playOrStop = () => {
    setPlaying(!playing);
  }

  const determinePlayerSize = (type) => {
    if (type === "music") {
      setWidthPlayer(0);
      setHeightPlayer(0);

    } else if (type === "video") {
      let width = window.innerWidth;
      let height = window.innerHeight;
      setWidthPlayer(width);
      setHeightPlayer(height);
    }
  }

  const readCard = () => {
    let card = getRandomCard();
    console.log(card);
    determinePlayerSize(card.type);
    setUrl(card.url);
    setStatus("card");
  }


  return (
    <Page id="homePage">

    { (status === "init") && <Block>Initializing...</Block> }
    { (status === "select-players") && <Block>Select numbers of players</Block> }
    { (status === "error") && <Block>Error</Block> }
    { (status === "get-card") && 
      <Block>
        <Button className="my-2" onClick={readCard}>Get Card</Button>
      </Block>
    }
    { (status === "card") &&
      <Block>
        <Button className="my-2" onClick={playOrStop}>{(playing) ? "Stop" : "Play"}</Button>
        <Button className="my-2" onClick={()=> { setStatus("select-cronology")}}>Cronology card</Button>
        <ReactPlayer url={url}
          width={widthPlayer}
          height={heightPlayer}
          playing={playing} />
      </Block>  
    }
    { (status === "select-cronology") &&
      <Block>
        <ViewPlayer player={activePlayer.player} />
      </Block>
    } 
    </Page>
  );
}
