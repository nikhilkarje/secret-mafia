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
  players?: Player[];
}

interface DataType {
  type: string;
  data: Player[];
}

const ChancellorConfirmModal = ({ player }: { player: Player }) => {
  const modalTriggerRef = useRef(null);
  const [controlData, setControlData] = useState<ControlData>({
    loaded: false,
  });
  const [chancellorId, setChancellorId] = useState<number>(0);

  const submit = async () => {
    if (!chancellorId) {
      return;
    }
    const response = await post(
      `/api/conversations/${player.conversation_id}/players/${player.id}/confirm_chancellor`,
      { chancellor_id: chancellorId }
    );
    if (modalTriggerRef.current) {
      modalTriggerRef.current.removeModal();
    }
  };

  const handleActionData = (data: DataType) => {
    setControlData({
      loaded: true,
      message:
        "You must nominate a Chancellor for this election. You may discuss it over with the legislative assembly, before making this decision.",
      players: data.data,
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

  useEffect(() => {
    if (controlData.loaded) {
      modalTriggerRef.current.addModal();
    }
  }, [controlData]);

  return (
    controlData.loaded && (
      <Modal ref={modalTriggerRef} hideClose>
        <Card>
          <Container>
            <div>{controlData.message}</div>
            {controlData.players && (
              <Content>
                {controlData.players.map((player) => (
                  <CardWrapper key={player.id}>
                    <MiniCard
                      isSelectable={true}
                      isActive={chancellorId === player.id}
                      onClick={() => setChancellorId(player.id)}
                    >
                      {player.name}
                    </MiniCard>
                  </CardWrapper>
                ))}
              </Content>
            )}
            <CButton onClick={() => submit()}>Confirm</CButton>
          </Container>
        </Card>
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

export default ChancellorConfirmModal;
