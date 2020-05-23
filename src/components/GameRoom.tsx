import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import Board from "components/Board";
import TopHeader from "components/common/TopHeader";
import Players from "components/Players";
import CableContext from "containers/CableContext";
import { Room } from "interfaces";
import { Seashell } from "styles/color";
import { CenteredContent } from "styles/common";

const GameRoom = ({ room }: { room: Room }) => {
  const { cable } = useContext(CableContext);
  const [game, setGame] = useState<Room>(room);

  useEffect(() => {
    cable.subscriptions.create(
      { channel: "GameChannel", conversation: room.id },
      {
        received: (response) => {
          setGame(response as Room);
        },
        connected: () => {},
        disconnected: () => {},
      }
    );
  }, []);

  return (
    <>
      <Container>
        <TopHeader>{room.title}</TopHeader>
        <Players room={room} />
        {game && (
          <ContentContainer>
            <Board game={game} mode="liberal" />
            <Board game={game} mode="fascist" />
          </ContentContainer>
        )}
      </Container>
    </>
  );
};

const ContentContainer = styled.div`
  flex: 1 0 auto;
  padding: 20px 50px;
  ${CenteredContent}
  flex-direction: column;
`;

const Container = styled.div`
  height: 100%;
  background-color: ${Seashell};
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export default GameRoom;
