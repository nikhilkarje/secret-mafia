import React from "react";
import styled, { css, keyframes } from "styled-components";

import { Next } from "components/common/icons";
import { Room } from "interfaces";
import {
  DarkRed,
  DarkSienna,
  Melon,
  PowderBlue,
  PrussianBlue,
  SteelBlue,
} from "styles/color";
import { CenteredContent } from "styles/common";

interface Props {
  game: Room;
  mode: "liberal" | "fascist";
}

const Board = ({ game, mode }: Props) => {
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

  return (
    <BoardContainer mode={mode}>
      <ThickBorder mode={mode}>
        <TeamTag mode={mode}>
          {mode === "liberal" ? "LIBERAL" : "FASCIST"}
        </TeamTag>
        <BoardWrapper mode={mode}>
          {Array(mode === "liberal" ? 4 : 5)
            .fill(0)
            .map((value, index) => (
              <>
                {game[mode === "liberal" ? "liberal_policy" : "facist_policy"] >
                index ? (
                  <PolicyTile mode={mode}>
                    <span>{mode === "liberal" ? "Liberal" : "Fascist"}</span>
                    <span>Article</span>
                  </PolicyTile>
                ) : mode === "liberal" ? (
                  <PolicyHolder mode={mode} />
                ) : (
                  <PolicyHolder powered={!!executivePower(index)} mode={mode}>
                    {!!executivePower(index) && (
                      <PowerTag>{executivePowerMessage(index)}</PowerTag>
                    )}
                    {index === 4 && (
                      <PowerTag> Veto Power is unlocked</PowerTag>
                    )}
                  </PolicyHolder>
                )}
                {index !== (mode === "liberal" ? 3 : 4) && (
                  <BorderLine mode={mode} />
                )}
              </>
            ))}
        </BoardWrapper>
        <WinTile mode={mode}>Victory</WinTile>
        {mode === "liberal" && (
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
        )}
      </ThickBorder>
      {mode === "liberal" && (
        <PileContainer>
          <PileCounter mode={mode}>
            <span>Draw Pile</span>
            <PileCount key={game.draw_pile}>{game.draw_pile}</PileCount>
          </PileCounter>
          <PileCounter mode={mode}>
            <span>Discard Pile</span>
            <PileCount key={game.discard_pile}>{game.discard_pile}</PileCount>
          </PileCounter>
        </PileContainer>
      )}
    </BoardContainer>
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

const ScaleFrame = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
`;

const OpacityFrame = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 100%;
  }
`;

const WidthFrame = (width: number) => keyframes`
  0% {
    width: 0;
  }
  100% {
    width: ${width}px;
  }
`;

const HeightFrame = (height: number, format: string = "px") => keyframes`
  0% {
    height: 0;
  }
  100% {
    height: ${height}${format};
  }
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

const BoardContainer = styled.div<{
  mode: ModeType;
}>`
  padding: ${PADDING_WIDTH}px;
  display: flex;
  overflow: hidden;
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

const PileCount = styled.span`
  animation: ${ScaleFrame} 1s;
`;

const PileCounter = styled.div<{
  mode: ModeType;
}>`
  width: 187px;
  height: 48%;
  ${CommonCardCss}
  animation: ${HeightFrame(48, "%")} 1s;
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
  animation: ${HeightFrame(HOLDER_HEIGHT)} 1s;

  ${({ mode }) => css`
    background-color: ${COLOR_HASH[mode][1]};
  `}
`;

const PowerTag = styled.span`
  margin-top: 5px;
  animation: ${OpacityFrame} 2s;
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
  animation: ${WidthFrame(HOLDER_WIDTH)} 1s;

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

export default Board;
