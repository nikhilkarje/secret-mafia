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
}

const ChancellorConfirmModal = ({ player }: { player: Player }) => {
  const modalTriggerRef = useRef(null);
  const [controlData, setControlData] = useState<ControlData>({
    loaded: false,
  });

  const submit = async () => {
    const response = await post(
      `/api/conversations/${player.conversation_id}/players/${player.id}/confirm_role`,
      {}
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
      <Modal
        ref={modalTriggerRef}
        hideClose
        content={
          <Card>
            <Container>
              <div>{controlData.message}</div>
              {controlData.players && (
                <Content>
                  {controlData.players.map((player) => (
                    <CardWrapper>
                      <InputRadio
                        type="radio"
                        name="chancellor_c"
                        id={`chancellor_c_${player.id}`}
                      />
                      <CardLabel htmlFor={`chancellor_c_${player.id}`}>
                        <CCard key={player.id}>
                          {player.user.first_name} {player.user.last_name}
                        </CCard>
                      </CardLabel>
                    </CardWrapper>
                  ))}
                </Content>
              )}
              <CButton onClick={submit}>Confirm</CButton>
            </Container>
          </Card>
        }
      />
    )
  );
};

const CardWrapper = styled.div`
  display: inline-block;
`;

const CardLabel = styled.label`
  cursor: pointer;
  display: inline-block;
  border-radius: 5px;
`;

const CCard = styled(Card)`
  min-width: 175px;
  font-size: 24px;
  padding: 20px;
  position: relative;
  border: 1px solid ${LightGrey};
  ${CenteredContent}
  flex-direction: column;
`;

const InputRadio = styled.input`
  display: none;
  &:checked + label {
    border: 2px solid ${Blue};
  }
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

export default ChancellorConfirmModal;
