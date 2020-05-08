import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

import Card from "components/common/Card";
import Button from "components/common/Button";
import Modal from "components/common/Modal";
import { get, post } from "utils/request";
import { Player } from "interfaces";
import { LightGrey, BrightRed } from "styles/color";
import { CenteredContent } from "styles/common";

interface ControlData {
  loaded: boolean;
  message?: string;
  players?: Player[];
}

interface DataType {
  type: string;
  data?: Player[];
}

const RoleConfirmModal = ({ player }: { player: Player }) => {
  const modalTriggerRef = useRef(null);
  const [controlData, setControlData] = useState<ControlData>({
    loaded: false,
  });

  const submit = async () => {
    const response = await post(
      `/api/conversations/${player.conversation_id}/players/${player.id}/confirm_role`,
      {}
    );
    setControlData({ loaded: false });
  };

  const handleFacistConference = (data: DataType) => {
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
    setControlData({ loaded: true, message, players });
  };

  const handleActionData = (data: DataType) => {
    if (data.type === "facist_conferrence") {
      handleFacistConference(data);
    } else if (data.type === "liberal_conferrence") {
      setControlData({
        loaded: true,
        message: "You are a member of the liberal party.",
      });
    }
  };

  const fetchActionData = () => {
    get(
      `/api/conversations/${player.conversation_id}/players/${player.id}/pending_action`
    )
      .then((response) => response.json())
      .then(handleActionData);
  };

  useEffect(() => {
    fetchActionData();
  }, []);

  return (
    controlData.loaded && (
      <Modal hideClose>
        {({ addModal }) => {
          addModal();
          return (
            <Card>
              <Container>
                <div>{controlData.message}</div>
                {controlData.players && (
                  <Content>
                    {controlData.players.map((player) => (
                      <CCard key={player.id}>
                        <div>{player.name}</div>
                        {player.secret_special_role === "hitler" && (
                          <RedSpan>(Secret Hitler)</RedSpan>
                        )}
                      </CCard>
                    ))}
                  </Content>
                )}
                <CButton onClick={() => submit()}>Confirm</CButton>
              </Container>
            </Card>
          );
        }}
      </Modal>
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

const Container = styled.div`
  padding: 50px;
`;

const CButton = styled(Button)`
  margin-top: 20px;
`;

export default RoleConfirmModal;
