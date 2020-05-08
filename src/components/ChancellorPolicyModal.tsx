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

const ChancellorPolicyModal = ({
  player,
  canVeto,
  isForced,
}: {
  player: Player;
  canVeto: boolean;
  isForced: boolean;
}) => {
  const modalTriggerRef = useRef(null);
  const [controlData, setControlData] = useState<ControlData>({
    loaded: false,
  });
  const [selected, setSelected] = useState<number>(0);

  const submit = async () => {
    if (!selected) {
      return;
    }
    const policy = controlData.policies[selected - 1];
    const response = await post(
      `/api/conversations/${player.conversation_id}/players/${player.id}/chancellor_policy`,
      { policy }
    );
    setControlData({ loaded: false });
  };

  const veto = async () => {
    const policy = controlData.policies[selected - 1];
    const response = await post(
      `/api/conversations/${player.conversation_id}/players/${player.id}/veto`,
      {}
    );
    setControlData({ loaded: false });
  };

  const handleActionData = (data: DataType) => {
    const policies = data.data.split("");
    setControlData({
      loaded: true,
      policies,
      message: "Choose one policy to implement",
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
                        <MiniCard
                          isSelectable={true}
                          isActive={selected === index + 1}
                          onClick={() => setSelected(index + 1)}
                        >
                          {policy === "0" ? "Liberal" : "Fascist"}
                        </MiniCard>
                      </CardWrapper>
                    ))}
                  </Content>
                )}
                <CtaWrapper>
                  <CButton onClick={() => submit()}>Confirm</CButton>
                  {canVeto && !isForced && (
                    <RButton onClick={() => veto()}>Veto</RButton>
                  )}
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

export default ChancellorPolicyModal;
