import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { Page, Button, Navbar, Block } from 'konsta/react';
import { useGlobalContext } from "../hooks/useGlobalContext";

export default function Home() {
  // Define playing state
  const { universeCards, getRandomCard, activeCard, addPlayer, players, initPlayer, initActivePlayer, activePlayer } = useGlobalContext();
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState(null);
  const [widthPlayer, setWidthPlayer] = useState(0);
  const [heightPlayer, setHeightPlayer] = useState(0);
  const [status, setStatus] = useState("init");

  useEffect(() => {
    // Define example players when player have name, array of cards, and comodins.    
    addPlayer(players, initPlayer("Player 1")) 
    addPlayer(players, initPlayer("Player 2"));
    addPlayer(players, initPlayer("Player 3"));
    initActivePlayer(players);
    setStatus("ready");
  }, []);

  useEffect(() => {
    if (status === "ready") {
      console.log("Players: ", players);
      console.log("Active Player: ", activePlayer);
    }
  }, [status]);

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
    determinePlayerSize(card.type);
    setUrl(card.url);
  }


  return (
    <Page>
      <Block>
        <Button className="my-2" onClick={readCard}>Read Card</Button>
        <Button className="my-2" onClick={playOrStop}>{(playing) ? "Stop" : "Play"}</Button>
      </Block>
      <ReactPlayer url={url}
        width={widthPlayer}
        height={heightPlayer}
        playing={playing} />
        {activePlayer}
    </Page>
  );
}
