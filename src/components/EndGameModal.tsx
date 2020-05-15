import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

import Card from "components/common/Card";
import Button from "components/common/Button";
import Modal from "components/common/Modal";
import { get, post } from "utils/request";
import { Player } from "interfaces";
import { LightGrey, BrightRed, Blue } from "styles/color";
import { CenteredContent } from "styles/common";

interface ControlData {
  loaded: boolean;
  message?: string;
  players?: Player[];
}

interface DataType {
  type: string;
  data: Player[];
  message: string;
}

const EndGameModal = ({ player }: { player: Player }) => {
  const modalTriggerRef = useRef(null);
  const [controlData, setControlData] = useState<ControlData>({
    loaded: false,
  });

  const submit = async () => {
    setControlData({ loaded: false });
    window.location.href = "/leave_game";
  };

  const handleActionData = (data: DataType) => {
    let message = data.message;
    setControlData({ loaded: true, message, players: data.data });
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
                        {player.secret_team_role === "liberal" && (
                          <BlueSpan>(Liberal)</BlueSpan>
                        )}
                        {player.secret_team_role === "facist" && (
                          <RedSpan>(Fascist)</RedSpan>
                        )}
                        {player.secret_special_role === "hitler" && (
                          <RedSpan>(Secret Hitler)</RedSpan>
                        )}
                      </CCard>
                    ))}
                  </Content>
                )}
                <CButton onClick={submit}>Confirm</CButton>
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
  margin-top: 20px;
`;

const RedSpan = styled.div`
  color: ${BrightRed};
`;

const BlueSpan = styled.div`
  color: ${Blue};
`;

const Content = styled.div`
  padding: 20px 0 0;
  display: flex;
  max-width: 800px;
  ${CenteredContent}
  flex-wrap: wrap;
`;

const Container = styled.div`
  padding: 50px;
`;

const CButton = styled(Button)`
  margin-top: 20px;
`;

export default EndGameModal;
