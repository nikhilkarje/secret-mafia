import React, { useRef } from "react";
import styled from "styled-components";

import Card from "components/common/Card";
import Button from "components/common/Button";
import Modal from "components/common/Modal";
import { post } from "utils/request";
import { Player } from "interfaces";

const RoleConfirmModal = ({
  modalControlRef,
  content,
  player,
  onSubmit,
}: {
  modalControlRef: any;
  content: React.ReactNode;
  player: Player;
  onSubmit?: () => void;
}) => {
  const submit = async () => {
    const response = await post(
      `/channel/conversations/${player.conversation_id}/players/${player.id}/confirm_role`,
      {}
    );
    if (modalControlRef.current) {
      modalControlRef.current.removeModal();
    }
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Modal
      ref={modalControlRef}
      hideClose
      content={
        <Card>
          <Content>
            {content}
            <CButton onClick={submit}>Confirm</CButton>
          </Content>
        </Card>
      }
    />
  );
};

const Content = styled.div`
  padding: 50px;
`;

const CButton = styled(Button)`
  margin-top: 20px;
`;

export default RoleConfirmModal;
