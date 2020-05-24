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
      .then((data) => {
        playersRef.current = JSON.parse(JSON.stringify(data));
        setPlayers(data);
      });
  };

  const handleReceivedConversation = (data: DataType) => {
    const { type } = data;
    const player = data.data;
    const playersClone = JSON.parse(JSON.stringify(playersRef.current));
    if (playersClone) {
      let playerIndex;
      for (let index = 0; index < playersClone.length; index++) {
        const item = playersClone[index];
        if (item.id === player.id) {
          playerIndex = index;
          break;
        }
      }
      if (type === "new") {
        if (typeof playerIndex === "undefined") {
          playersRef.current = JSON.parse(JSON.stringify(playersClone));
          setPlayers([...playersClone, player]);
        }
      } else if (type === "update") {
        playersClone[playerIndex] = player;
        playersRef.current = JSON.parse(JSON.stringify(playersClone));
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

  return (
    <Container>
      {players &&
        players.map((player) => (
          <PlayerItem
            key={player.id}
            canVeto={room.facist_policy === 5}
            player={player}
          />
        ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 0 0 20px;
  flex-wrap: wrap;
`;

export default Players;
