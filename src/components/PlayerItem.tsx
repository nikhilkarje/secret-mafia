import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { CenteredContent, OverlayCss } from "styles/common";

import { MiniCard } from "components/common/Card";
import { Player } from "interfaces";
import CableContext from "containers/CableContext";
import { Blue, LightGrey, Purple, White } from "styles/color";
import ConfigContext from "containers/ConfigContext";
import RoleConfirmModal from "components/RoleConfirmModal";
import ChancellorConfirmModal from "components/ChancellorConfirmModal";
import BallotModal from "components/BallotModal";
import PresidentialPolicyModal from "components/PresidentialPolicyModal";
import ChancellorPolicyModal from "components/ChancellorPolicyModal";

const PlayerItem = ({ player }: { player: Player }) => {
  const [playerItem, setPlayerItem] = useState<Player>(player);
  const { cable } = useContext(CableContext);
  const { config } = useContext(ConfigContext);
  const isCurrentPlayer = player.user.id === config.user_id;

  const handleReceivedConversation = (data: Player) => {
    setPlayerItem(data);
  };

  useEffect(() => {
    cable.subscriptions.create(
      { channel: "PlayerUpdateChannel", player: player.id },
      {
        received: (response) => {
          handleReceivedConversation(response as Player);
        },
        connected: () => {},
        disconnected: () => {},
      }
    );
  }, []);

  return (
    <>
      <CardWrapper>
        <MiniCard>
          {(playerItem.status === "logged_out" ||
            playerItem.pending_action !== "none") && <Spinner />}
          {playerItem.user.first_name} {playerItem.user.last_name}
        </MiniCard>
        {playerItem.public_role === "president" && (
          <PMiniCard>President</PMiniCard>
        )}
        {playerItem.public_role === "chancellor" && (
          <PMiniCard>Chancellor</PMiniCard>
        )}
      </CardWrapper>
      {isCurrentPlayer && playerItem.pending_action === "confirm_role" && (
        <RoleConfirmModal player={player} />
      )}
      {isCurrentPlayer && playerItem.pending_action === "choose_chancellor" && (
        <ChancellorConfirmModal player={player} />
      )}
      {isCurrentPlayer && playerItem.pending_action === "vote" && (
        <BallotModal player={player} />
      )}
      {isCurrentPlayer && playerItem.pending_action === "choose_2_policies" && (
        <PresidentialPolicyModal player={player} />
      )}
      {isCurrentPlayer && playerItem.pending_action === "choose_1_policy" && (
        <ChancellorPolicyModal player={player} />
      )}
    </>
  );
};

const CardWrapper = styled.div`
  flex: 0 0 auto;
`;

const PMiniCard = styled(MiniCard)`
  padding: 10px;
  font-size: 18px;
  margin-top: 5px;
  background-color: ${Purple};
  color: ${White};
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

export default PlayerItem;
