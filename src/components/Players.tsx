import React, { useContext, useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { CenteredContent, OverlayCss } from "styles/common";

import Card from "components/common/Card";
import { Player } from "interfaces";
import CableContext from "containers/CableContext";
import { get } from "utils/request";
import { Blue, LightGrey } from "styles/color";

const Players = ({ roomId }: { roomId: number }) => {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const playersRef = useRef<Player[]>(players);
  const { cable } = useContext(CableContext);

  const fetchPlayers = () => {
    get(`/channel/conversations/${roomId}/players`)
      .then((response) => response.json())
      .then((data) => setPlayers(data));
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
      {players &&
        players.map((player) => (
          <CCard>
            <Spinner />
            {player.user.first_name} {player.user.last_name}
          </CCard>
        ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 20px 0;
`;

const CCard = styled(Card)`
  min-width: 175px;
  font-size: 24px;
  padding: 20px;
  position: relative;
  flex: 0 0 auto;
  border: 1px solid ${LightGrey};
  ${CenteredContent}
`;

const Spinner = styled.div`
  ${OverlayCss}
  ${CenteredContent}

  &:before {
    content: "";
    border: 5px solid ${LightGrey};
    border-top: 5px solid ${Blue};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;

export default Players;
