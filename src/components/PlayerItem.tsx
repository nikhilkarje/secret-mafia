import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { CenteredContent, OverlayCss } from "styles/common";

import Card from "components/common/Card";
import { Player } from "interfaces";
import CableContext from "containers/CableContext";
import { Blue, LightGrey } from "styles/color";
import ConfigContext from "containers/ConfigContext";
import RoleConfirmModal from "components/RoleConfirmModal";
import ChancellorConfirmModal from "components/ChancellorConfirmModal";

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
      <CCard>
        {(playerItem.status === "logged_out" ||
          playerItem.pending_action !== "none") && <Spinner />}
        {playerItem.user.first_name} {playerItem.user.last_name}
      </CCard>
      {isCurrentPlayer && playerItem.pending_action === "confirm_role" && (
        <RoleConfirmModal player={player} />
      )}
      {isCurrentPlayer && playerItem.pending_action === "choose_chancellor" && (
        <ChancellorConfirmModal player={player} />
      )}
    </>
  );
};

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

export default PlayerItem;
