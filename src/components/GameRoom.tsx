import React, { useContext, useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { White, Blue, DarkGrey, FadedRed } from "styles/color";

import TopHeader from "components/common/TopHeader";
import Card from "components/common/Card";
import { Room } from "interfaces";
import CableContext from "containers/CableContext";
import Players from "components/Players";
import { CenteredContent } from "styles/common";
import { get } from "utils/request";

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
            <LPile>
              <div>Liberal Policy Enacted</div>
              <div>{game.liberal_policy}</div>
            </LPile>
            <FPile>
              <div>Facist Policy Enacted</div>
              <div>{game.facist_policy}</div>
            </FPile>
            <PileContainer>
              <DrawPile>
                <div>Policy Draw Pile</div>
                <div>{game.draw_pile}</div>
              </DrawPile>
              <DiscardPile>
                <div>Discarded Policy Pile</div>
                <div>{game.discard_pile}</div>
              </DiscardPile>
            </PileContainer>
          </ContentContainer>
        )}
      </Container>
    </>
  );
};

const CardCommonCss = css`
  height: 400px;
  font-size: 24px;
  padding: 20px;
  position: relative;
  ${CenteredContent}
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  color: ${White};

  & div:not(:first-child) {
    margin-top: 30px;
  }
`;

const LPile = styled(Card)`
  ${CardCommonCss}
  background-color: ${Blue};
`;

const FPile = styled(Card)`
  ${CardCommonCss}
  margin-left: 30px;
  background-color: ${FadedRed};
`;

const PileContainer = styled.div`
  height: 400px;
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const DrawPile = styled(Card)`
  ${CardCommonCss}
  height: 190px;
  background-color: ${DarkGrey};
`;

const DiscardPile = styled(Card)`
  ${CardCommonCss}
  height: 190px;
  background-color: ${DarkGrey};
`;

const ContentContainer = styled.div`
  flex: 1 0 auto;
  padding: 20px 50px;
  ${CenteredContent}
`;

const Container = styled.div`
  height: 100%;
  background-color: ${White};
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export default GameRoom;
