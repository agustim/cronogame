import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { Page, Button, Navbar, Block } from 'konsta/react';
import { useGlobalContext } from "../hooks/useGlobalContext";

export default function Home() {

  // Define playing state
  const { universeCards, getRandomCard, activeCard, setActiveCard, setUniverseCards } = useGlobalContext();
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState(null);
  const [widthPlayer, setWidthPlayer] = useState(0);
  const [heightPlayer, setHeightPlayer] = useState(0);

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
    </Page>
  );
}
