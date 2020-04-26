import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { Room, Player } from "interfaces";
import CableContext from "containers/CableContext";
import { get } from "utils/request";
import PlayerItem from "components/PlayerItem";

interface DataType {
  type: string;
  data: Player;
}

const Players = ({ room }: { room: Room }) => {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const playersRef = useRef<Player[]>(players);
  const { cable } = useContext(CableContext);

  const fetchPlayers = () => {
    get(`/api/conversations/${room.id}/players`)
      .then((response) => response.json())
      .then((data) => setPlayers(data));
  };

  const handleReceivedConversation = (data: DataType) => {
    const { type } = data;
    const player = data.data;
    if (playersRef.current) {
      let playerIndex;
      for (let index = 0; index < playersRef.current.length; index++) {
        const item = playersRef.current[index];
        if (item.id === player.id) {
          playerIndex = index;
        }
      }
      if (type === "new") {
        if (typeof playerIndex === "undefined") {
          setPlayers([...playersRef.current, player]);
        }
      } else if (type === "update") {
        const playersClone = [...playersRef.current];
        playersClone[playerIndex] = player;
        setPlayers(playersClone);
      }
    }
  };

  useEffect(() => {
    cable.subscriptions.create(
      { channel: "PlayersChannel", conversation: room.id },
      {
        received: (response) => {
          handleReceivedConversation(response as DataType);
        },
        connected: () => fetchPlayers(),
        disconnected: () => {},
      }
    );
  }, []);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  return (
    <Container>
      {players && players.map((player) => <PlayerItem player={player} />)}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 20px 0;
`;

export default Players;
