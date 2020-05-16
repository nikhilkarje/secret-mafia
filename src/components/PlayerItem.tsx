import React, { useContext } from "react";
import styled, { css } from "styled-components";

import BallotModal from "components/BallotModal";
import ChancellorConfirmModal from "components/ChancellorConfirmModal";
import ChancellorPolicyModal from "components/ChancellorPolicyModal";
import { MiniCard } from "components/common/Card";
import ConfirmVetoModal from "components/ConfirmVetoModal";
import EndGameModal from "components/EndGameModal";
import ExamineDeckModal from "components/ExamineDeckModal";
import ExecutePlayerModal from "components/ExecutePlayerModal";
import PresidentialPolicyModal from "components/PresidentialPolicyModal";
import RoleConfirmModal from "components/RoleConfirmModal";
import ConfigContext from "containers/ConfigContext";
import { Player } from "interfaces";
import {
  Charcoal,
  Crayola,
  DarkSeaGreen,
  FadedRed,
  Seashell,
} from "styles/color";
import { CenteredContent, OverlayCss } from "styles/common";

const PlayerItem = ({
  player,
  canVeto,
}: {
  player: Player;
  canVeto: boolean;
}) => {
  const { config } = useContext(ConfigContext);
  const isCurrentPlayer = player.user_id === config.user_id;

  return (
    <>
      <CardWrapper>
        <PlayerCard isDisabled={player.status === "dead"}>
          {player.pending_action !== "none" && (
            <SpinnerWrapper>
              <Spinner>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </Spinner>
            </SpinnerWrapper>
          )}
          {player.name}
        </PlayerCard>
        {player.president_id && <PMiniCard>President</PMiniCard>}
        {player.chancellor_id && <PMiniCard>Chancellor</PMiniCard>}
      </CardWrapper>
      {isCurrentPlayer && player.pending_action === "confirm_role" && (
        <RoleConfirmModal player={player} />
      )}
      {isCurrentPlayer && player.pending_action === "choose_chancellor" && (
        <ChancellorConfirmModal player={player} />
      )}
      {isCurrentPlayer && player.pending_action === "vote" && (
        <BallotModal player={player} />
      )}
      {isCurrentPlayer && player.pending_action === "policy_draw_president" && (
        <PresidentialPolicyModal player={player} />
      )}
      {isCurrentPlayer &&
        ["policy_draw_chancellor", "policy_draw_chancellor_forced"].indexOf(
          player.pending_action
        ) > -1 && (
          <ChancellorPolicyModal
            isForced={player.pending_action === "policy_draw_chancellor_forced"}
            canVeto={canVeto}
            player={player}
          />
        )}
      {isCurrentPlayer && player.pending_action === "examine_deck" && (
        <ExamineDeckModal player={player} />
      )}
      {isCurrentPlayer && player.pending_action === "kill" && (
        <ExecutePlayerModal player={player} />
      )}
      {isCurrentPlayer && player.pending_action === "confirm_veto" && (
        <ConfirmVetoModal player={player} />
      )}
      {isCurrentPlayer && player.pending_action === "end_game" && (
        <EndGameModal player={player} />
      )}
    </>
  );
};

const CardWrapper = styled.div`
  flex: 0 0 auto;
  margin-top: 20px;
`;

const PlayerCard = styled(MiniCard)<{
  isDisabled: boolean;
}>`
  background-color: ${Crayola};
  color: ${Charcoal};
  ${({ isDisabled }) =>
    isDisabled &&
    css`
      background-color: ${FadedRed};
    `}
`;

const PMiniCard = styled(MiniCard)`
  padding: 10px;
  font-size: 18px;
  margin-top: 5px;
  background-color: ${DarkSeaGreen};
  color: ${Seashell};
`;

const Spinner = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  & div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: ${Seashell};
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  & div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  & div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  & div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  & div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
`;

const SpinnerWrapper = styled.div`
  ${OverlayCss}
  ${CenteredContent}
`;

export default PlayerItem;
