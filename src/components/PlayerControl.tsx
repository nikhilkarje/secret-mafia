import React, { useContext, useState, useEffect, useRef } from "react";

import RoleConfirmModal from "components/common/RoleConfirmModal";
import { Player } from "interfaces";
import CableContext from "containers/CableContext";
import { get } from "utils/request";
import styled from "styled-components";
import Card from "./common/Card";
import { LightGrey, BrightRed } from "styles/color";
import { CenteredContent } from "styles/common";

interface ControlData {
  type: string;
  message?: string;
  players?: Player[];
}

const PlayerControl = ({ player }: { player: Player }) => {
  const { cable } = useContext(CableContext);
  const modalTriggerRef = useRef(null);
  const [controlData, setControlData] = useState<ControlData>({ type: "" });

  const fetchActionData = () => {
    get(
      `/channel/conversations/${player.conversation_id}/players/${player.id}/pending_action`
    )
      .then((response) => response.json())
      .then(handleActionData);
  };

  const handleFacistConference = (data: any) => {
    const players = [];
    let message = "";
    for (let index = 0; index < data.data.length; index++) {
      const facist = data.data[index];
      if (player.id !== facist.id) {
        players.push(facist);
      } else if (facist.secret_special_role === "hitler") {
        message = "You are the Secret Hitler of the facist party.";
      }
    }
    if (!message) {
      message =
        "You are a member of the facist party. Make note of the Secret Hitler.";
    }
    message += " These are your teammates.";
    setControlData({ type: "conferrence", message, players });
  };

  const handleActionData = (data: any) => {
    if (data.type === "facist_conferrence") {
      handleFacistConference(data);
    } else if (data.type === "liberal_conferrence") {
      setControlData({
        type: "conferrence",
        message: "You are a member of the liberal party.",
      });
    }
  };

  const handleReceivedConversation = (data: any) => {
    handleActionData(data);
  };

  const createSubscription = () => {
    cable.subscriptions.create(
      { channel: "PlayerPrivateChannel", player: player.id },
      {
        received: (response) => {
          handleReceivedConversation(response as Player);
        },
        connected: () => fetchActionData(),
        disconnected: () => {},
      }
    );
  };

  const onSubmit = () => {
    setControlData({ type: "" });
  };

  useEffect(() => {
    createSubscription();
  }, []);

  useEffect(() => {
    if (controlData.type) {
      modalTriggerRef.current.addModal();
    }
  }, [controlData]);

  return (
    controlData.type === "conferrence" && (
      <RoleConfirmModal
        player={player}
        onSubmit={onSubmit}
        modalControlRef={modalTriggerRef}
        content={
          <>
            <div>{controlData.message}</div>
            {controlData.players && (
              <Content>
                {controlData.players.map((player) => (
                  <CCard key={player.id}>
                    <div>
                      {player.user.first_name} {player.user.last_name}
                    </div>
                    {player.secret_special_role === "hitler" && (
                      <RedSpan>(Secret Hitler)</RedSpan>
                    )}
                  </CCard>
                ))}
              </Content>
            )}
          </>
        }
      />
    )
  );
};

const CCard = styled(Card)`
  min-width: 175px;
  font-size: 24px;
  padding: 20px;
  position: relative;
  border: 1px solid ${LightGrey};
  ${CenteredContent}
  display: inline-flex;
  flex-direction: column;
`;

const RedSpan = styled.div`
  color: ${BrightRed};
`;

const Content = styled.div`
  padding: 20px 0 0;
  display: flex;
  ${CenteredContent}
`;

export default PlayerControl;
