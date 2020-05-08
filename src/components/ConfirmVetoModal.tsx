import React, { useRef, useState, useEffect } from "react";
import styled, { css } from "styled-components";

import Card, { MiniCard } from "components/common/Card";
import Button, { PrimaryButton } from "components/common/Button";
import Modal from "components/common/Modal";
import { get, post } from "utils/request";
import { Player } from "interfaces";
import { CenteredContent } from "styles/common";

interface ControlData {
  loaded: boolean;
  message?: string;
  policies?: string[];
}

interface DataType {
  type: string;
  data: string;
}

const ConfirmVetoModal = ({ player }: { player: Player }) => {
  const modalTriggerRef = useRef(null);
  const [controlData, setControlData] = useState<ControlData>({
    loaded: false,
  });

  const submit = async (confirm_veto: boolean) => {
    const response = await post(
      `/api/conversations/${player.conversation_id}/players/${player.id}/confirm_veto`,
      { confirm_veto }
    );
    setControlData({ loaded: false });
  };

  const handleActionData = (data: DataType) => {
    const policies = data.data.split("");
    setControlData({
      loaded: true,
      policies,
      message:
        "Chancellor has proposed to veto current session draw. Do you confirm?",
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
                {controlData.policies && (
                  <Content>
                    {controlData.policies.map((policy, index) => (
                      <CardWrapper key={index}>
                        <MiniCard>
                          {policy === "0" ? "Liberal" : "Fascist"}
                        </MiniCard>
                      </CardWrapper>
                    ))}
                  </Content>
                )}
                <CtaWrapper>
                  <CButton onClick={() => submit(true)}>Confirm</CButton>
                  <RButton onClick={() => submit(false)}>Deny</RButton>
                </CtaWrapper>
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
  margin: 20px 0 0;
`;

const RButton = styled(PrimaryButton)`
  margin: 20px 0 0 10px;
`;

const CtaWrapper = styled.div`
  ${CenteredContent}
`;

export default ConfirmVetoModal;
