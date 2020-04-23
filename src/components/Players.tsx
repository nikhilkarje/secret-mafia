import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { Player } from "interfaces";
import CableContext from "containers/CableContext";
import ConfigContext from "containers/ConfigContext";
import { get } from "utils/request";
import PlayerItem from "components/PlayerItem";

const Players = ({
  roomId,
  setCurrentPlayer,
}: {
  roomId: number;
  setCurrentPlayer: (player: Player) => void;
}) => {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const playersRef = useRef<Player[]>(players);
  const { cable } = useContext(CableContext);
  const { config } = useContext(ConfigContext);

  const fetchPlayers = () => {
    get(`/channel/conversations/${roomId}/players`)
      .then((response) => response.json())
      .then((data) => {
        for (let index = 0; index < data.length; index++) {
          const player = data[index];
          if (player.user.id === config.user_id) {
            setCurrentPlayer(player);
            break;
          }
        }
        setPlayers(data);
      });
  };

  const handleReceivedConversation = (data: Player) => {
    if (playersRef.current) {
      for (let index = 0; index < playersRef.current.length; index++) {
        const player = playersRef.current[index];
        if (player.id === data.id) {
          return;
        }
      }
      setPlayers([...playersRef.current, data]);
    }
  };

  useEffect(() => {
    cable.subscriptions.create(
      { channel: "PlayersChannel", conversation: roomId },
      {
        received: (response) => {
          handleReceivedConversation(response as Player);
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