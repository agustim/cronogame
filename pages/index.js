import React,{ useState } from 'react';
import { useRouter } from 'next/router'
import { Page, Button, List, Block, ListInput, Link } from 'konsta/react';
import { useGlobalContext } from "../hooks/useGlobalContext";
//import { Link } from 'next/link';
import { ViewPlayer } from '../components/ViewPlayer';

export default function Home() {

  const route =  useRouter();
  const { game } = useGlobalContext();
  const [players, setPlayers] = useState("[]");
  const [nameAddPlayer, setNameAddPlayer] = useState("");


  const onClickAddPlayer = () => {
    game.addPlayer(game.initPlayer(nameAddPlayer));
    console.log("game.players", game.players, JSON.stringify(game.players));
    setPlayers(JSON.stringify(game.players));
    setNameAddPlayer("");
  }

  const updatePlayerName = (e) => {
    setNameAddPlayer(e.target.value)
  }

  const onClickStartGame = () => {
    if (game.players.length < 2) {
      alert("Please add at least 2 players");
      return
    }
    route.push('/ng');
  }

  return (
    <Page id="homePage">
      {/* list players */}
      <Block>
        <h1>Players List</h1>
      </Block>
      <Block>
        {
        JSON.parse(players).map((player, index) => {
          return <ViewPlayer key={index} player={player} />
        }
        )}
      </Block>

      <Block>
        <h1>Add Player</h1>
      </Block>
      <Block>
        {/* Add user, listinput to define name  */}
        <List>
          <ListInput label="Name" type="text" placeholder="Your name" value={nameAddPlayer} onChange={updatePlayerName} />
          <Button onClick={onClickAddPlayer}>Add Player</Button>
          {/* go to /ng pages */}
        </List>
      </Block>
      <Block>
          <Button onClick={onClickStartGame}>Start Game</Button>
      </Block>
    </Page>
  );
}
