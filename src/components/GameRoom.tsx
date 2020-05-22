import React, { useContext, useState, useEffect, useRef } from "react";
import styled, { css, keyframes } from "styled-components";
import {
  Seashell,
  PrussianBlue,
  PowderBlue,
  SteelBlue,
  DarkSienna,
  DarkRed,
  Melon,
} from "styles/color";

import TopHeader from "components/common/TopHeader";
import { Room } from "interfaces";
import CableContext from "containers/CableContext";
import Players from "components/Players";
import { CenteredContent } from "styles/common";
import { Next } from "components/common/icons";

const GameRoom = ({ room }: { room: Room }) => {
  const { cable } = useContext(CableContext);
  const [game, setGame] = useState<Room>(room);

  const executivePower = (index: number) => {
    return (window as any).config.facist_power_hash[game.total_players][
      index + 1
    ];
  };

  const executivePowerMessage = (index: number) => {
    const config = (window as any).config;
    const power = config.facist_power_hash[game.total_players][index + 1];
    return config.facist_power_message_hash[power];
  };

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
    setTimeout(() => {
      setGame({ ...game, election_tracker: 2 });
    }, 5000);
  }, []);

  return (
    <>
      <Container>
        <TopHeader>{room.title}</TopHeader>
        <Players room={room} />
        {game && (
          <ContentContainer>
            <BoardContainer mode="liberal">
              <ThickBorder mode="liberal">
                <TeamTag mode="liberal">LIBERAL</TeamTag>
                <BoardWrapper mode="liberal">
                  {Array(4)
                    .fill(0)
                    .map((value, index) => (
                      <>
                        {game.liberal_policy > index ? (
                          <PolicyTile mode="liberal">
                            <span>Liberal</span>
                            <span>Article</span>
                          </PolicyTile>
                        ) : (
                          <PolicyHolder mode="liberal" />
                        )}
                        {index !== 3 && <BorderLine mode="liberal" />}
                      </>
                    ))}
                </BoardWrapper>
                <WinTile mode="liberal">Victory</WinTile>
                <ElectionTracker>
                  <TrackerItem>Election Tracker</TrackerItem>
                  <Tracker active={true} />
                  {Array(3)
                    .fill(0)
                    .map((value, index) => (
                      <TrackerItem>
                        Fail
                        <Next iconCss={NextIconCss} />
                        <Tracker active={game.election_tracker > index} />
                      </TrackerItem>
                    ))}
                  <TrackerItem>Reveal and Pass Top Policy</TrackerItem>
                </ElectionTracker>
              </ThickBorder>
              <PileContainer>
                <PileCounter mode="liberal">
                  <span>Draw Pile</span>
                  <span>{game.draw_pile}</span>
                </PileCounter>
                <PileCounter mode="liberal">
                  <span>Discard Pile</span>
                  <span>{game.discard_pile}</span>
                </PileCounter>
              </PileContainer>
            </BoardContainer>
            <BoardContainer mode="fascist">
              <ThickBorder mode="fascist">
                <TeamTag mode="fascist">FASCIST</TeamTag>
                <BoardWrapper mode="fascist">
                  {Array(5)
                    .fill(0)
                    .map((value, index) => (
                      <>
                        {game.facist_policy > index ? (
                          <PolicyTile mode="fascist">
                            <span>Fascist</span>
                            <span>Article</span>
                          </PolicyTile>
                        ) : (
                          <PolicyHolder
                            powered={!!executivePower(index)}
                            mode="fascist"
                          >
                            {!!executivePower(index) &&
                              executivePowerMessage(index)}
                            {index === 4 && (
                              <PowerTag> Veto Power is unlocked</PowerTag>
                            )}
                          </PolicyHolder>
                        )}
                        {index !== 4 && <BorderLine mode="fascist" />}
                      </>
                    ))}
                </BoardWrapper>
                <WinTile mode="fascist">Victory</WinTile>
              </ThickBorder>
            </BoardContainer>
            {/* <PolicyPileContainer>
              <LPile>
                <div>Liberal Policy Enacted</div>
                <div>{game.liberal_policy}</div>
              </LPile>
              <FPile>
                <div>Fascist Policy Enacted</div>
                <div>{game.facist_policy}</div>
              </FPile>
            </PolicyPileContainer>
            <PileContainer>
              <DrawPile>
                <div>Policy Draw Pile</div>
                <div>{game.draw_pile}</div>
              </DrawPile>
              <DiscardPile>
                <div>Discarded Policy Pile</div>
                <div>{game.discard_pile}</div>
              </DiscardPile>
            </PileContainer> */}
          </ContentContainer>
        )}
      </Container>
    </>
  );
};

const HOLDER_WIDTH = 175;
const HOLDER_HEIGHT = 200;
const BORDER_WIDTH = 2;
const THICK_BORDER_WIDTH = 40;
const PADDING_WIDTH = 5;
const BOARD_PADDING_WIDTH = 15;
const HOLDER_WIDTH_SANS_PADDING = HOLDER_WIDTH + BOARD_PADDING_WIDTH * 2;
const HOLDER_HEIGHT_SANS_PADDING =
  HOLDER_HEIGHT + BOARD_PADDING_WIDTH * 2 + BORDER_WIDTH * 2;
const CONTAINER_HEIGHT =
  HOLDER_HEIGHT_SANS_PADDING + PADDING_WIDTH * 2 + THICK_BORDER_WIDTH * 2;

const COLOR_HASH = {
  liberal: [PowderBlue, SteelBlue, PrussianBlue],
  fascist: [Melon, DarkRed, DarkSienna],
};

type ModeType = "liberal" | "fascist";

const BoardContainer = styled.div<{
  mode: ModeType;
}>`
  padding: ${PADDING_WIDTH}px;
  display: flex;
  ${({ mode }) => css`
    border: ${BORDER_WIDTH}px dashed ${COLOR_HASH[mode][2]};
    background-color: ${COLOR_HASH[mode][0]};
  `}

  &:not(:first-child) {
    margin-top: 20px;
  }
`;

const PileContainer = styled.div`
  height: ${CONTAINER_HEIGHT}px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CommonCardCss = css<{
  mode: ModeType;
}>`
  border-radius: 10px;
  font-family: "Permanent Marker", cursive;
  font-size: 18px;
  line-height: 25px;
  letter-spacing: 5px;
  ${CenteredContent}
  flex-direction: column;
  ${({ mode }) => css`
    background-color: ${COLOR_HASH[mode][1]};
    color: ${COLOR_HASH[mode][0]};
  `}
`;

const PileCounter = styled.div<{
  mode: ModeType;
}>`
  width: 187px;
  height: 48%;
  ${CommonCardCss}
`;

const TeamTag = styled.div<{
  mode: ModeType;
}>`
  width: 300px;
  height: ${THICK_BORDER_WIDTH}px;
  position: absolute;
  left: calc(50% - 150px);
  top: -${THICK_BORDER_WIDTH}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Piedra", cursive;
  font-size: 35px;
  letter-spacing: 5px;
  ${({ mode }) => css`
    background-color: ${COLOR_HASH[mode][0]};
    color: ${COLOR_HASH[mode][2]};
  `}
`;

const TrackerItem = styled.div`
  ${CenteredContent}
  &:first-child {
    padding-right: 10px;
    border-right: 1px dashed ${COLOR_HASH["liberal"][2]};
  }
`;

const NextIconCss = css`
  margin-left: 5px;
  color: ${COLOR_HASH["liberal"][2]};
`;

const ElectionTracker = styled.div`
  width: 750px;
  height: ${THICK_BORDER_WIDTH}px;
  position: absolute;
  left: calc(50% - 375px);
  bottom: -${THICK_BORDER_WIDTH}px;
  background-color: ${COLOR_HASH["liberal"][0]};
  color: ${COLOR_HASH["liberal"][2]};
  display: flex;
  justify-content: space-evenly;
`;

const Tracker = styled.span<{
  active: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px dotted ${COLOR_HASH["liberal"][2]};
  margin-left: 5px;
  ${CenteredContent}
  &:before {
    content: "";
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid ${COLOR_HASH["liberal"][2]};
  }
  ${({ active }) =>
    active &&
    css`
      &:before {
        background-color: ${COLOR_HASH["liberal"][2]};
        animation: ${PumpFrame} 1s;
      }
    `}
`;

const PumpFrame = keyframes`
  0% {
    width: 0;
    height: 0;
  }
  50% {
    width: 40px;
    height: 40px;
  }
  100% {
    width: 30px;
    height: 30px;
  }
`;

const ThickBorder = styled.div<{
  mode: ModeType;
}>`
  padding: ${PADDING_WIDTH}px;
  display: flex;
  position: relative;
  ${({ mode }) => css`
    border: ${THICK_BORDER_WIDTH}px solid ${COLOR_HASH[mode][2]};
  `}
`;

const BoardWrapper = styled.div<{
  mode: ModeType;
}>`
  padding: ${BOARD_PADDING_WIDTH}px;
  display: flex;
  ${({ mode }) => css`
    border: ${BORDER_WIDTH}px dashed ${COLOR_HASH[mode][2]};
  `}
`;

const BorderLine = styled.div<{
  mode: ModeType;
}>`
  height: ${HOLDER_HEIGHT}px;
  margin: 0 10px;
  ${({ mode }) => css`
    border: ${BORDER_WIDTH / 2}px dashed ${COLOR_HASH[mode][2]};
  `}
`;

const PolicyTile = styled.div<{
  mode: ModeType;
}>`
  width: ${HOLDER_WIDTH}px;
  height: ${HOLDER_HEIGHT}px;
  ${CommonCardCss}

  ${({ mode }) => css`
    background-color: ${COLOR_HASH[mode][1]};
  `}
`;

const PowerTag = styled.span`
  margin-top: 5px;
`;

const PolicyHolder = styled.div<{
  mode: ModeType;
  powered?: boolean;
}>`
  width: ${HOLDER_WIDTH}px;
  height: ${HOLDER_HEIGHT}px;
  text-align: center;
  ${CenteredContent}
  flex-direction: column;
  color: ${COLOR_HASH["fascist"][2]};

  ${({ mode, powered }) =>
    !powered &&
    css`
      background: linear-gradient(
            90deg,
            ${COLOR_HASH[mode][0]} 10px,
            transparent 1%
          )
          center,
        linear-gradient(${COLOR_HASH[mode][0]} 10px, transparent 1%) center,
        ${COLOR_HASH[mode][2]};
      background-size: 11px 11px;
    `}
`;

const WinTile = styled.div<{
  mode: ModeType;
}>`
  width: ${HOLDER_WIDTH_SANS_PADDING}px;
  height: ${HOLDER_HEIGHT_SANS_PADDING}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Piedra", cursive;
  font-size: 24px;
  letter-spacing: 3px;
  ${({ mode }) => css`
    background-color: ${COLOR_HASH[mode][2]};
    color: ${COLOR_HASH[mode][0]};
  `}
`;

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
