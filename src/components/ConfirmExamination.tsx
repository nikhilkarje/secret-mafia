import React, { useRef, useState, useEffect } from "react";
import styled, { css } from "styled-components";

import Card, { MiniCard } from "components/common/Card";
import Button from "components/common/Button";
import Modal from "components/common/Modal";
import { get, post } from "utils/request";
import { Player } from "interfaces";
import { CenteredContent } from "styles/common";

interface ControlData {
  loaded: boolean;
  message?: string;
  player?: Player;
}

interface DataType {
  type: string;
  data: Player;
}

const ExecutePlayerModal = ({ player }: { player: Player }) => {
  const modalTriggerRef = useRef(null);
  const [controlData, setControlData] = useState<ControlData>({
    loaded: false,
  });

  const submit = async () => {
    const response = await post(
      `/api/conversations/${player.conversation_id}/players/${player.id}/confirm_investigation`,
      {}
    );
    setControlData({ loaded: false });
  };

  const handleActionData = (data: DataType) => {
    setControlData({
      loaded: true,
      message: "You must must investigate one Player.",
      player: data.data,
    });
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
                {controlData.player && (
                  <Content>
                    <CardWrapper key={controlData.player.id}>
                      <MiniCard>{controlData.player.name}</MiniCard>
                      <MiniCard>
                        {controlData.player.secret_team_role === "liberal"
                          ? "Liberal"
                          : "Fascist"}
                      </MiniCard>
                    </CardWrapper>
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

const CardWrapper = styled.div`
  display: inline-block;
  margin-left: 15px;
  margin-bottom: 15px;
`;

const Content = styled.div`
  padding: 20px 0 0;
  ${CenteredContent}
  flex-wrap: wrap;
`;

const Container = styled.div`
  padding: 50px;
  max-width: 700px;
`;

const CButton = styled(Button)`
  margin-top: 20px;
`;

export default ExecutePlayerModal;
