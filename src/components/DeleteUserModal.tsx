import React, { useState, useRef } from "react";
import styled from "styled-components";

import Card from "components/common/Card";
import TopHeader from "components/common/TopHeader";
import { SecondaryButton } from "components/common/Button";
import Modal from "components/common/Modal";
import { UserListItem } from "interfaces";
import { destroy } from "utils/request";
import { FadedRed } from "styles/color";

const DeleteUserModal = ({
  modalControlRef,
  onSubmit,
  user,
}: {
  modalControlRef: any;
  onSubmit?: () => void;
  user: UserListItem;
}) => {
  const { id, first_name, last_name } = user;

  const submit = async () => {
    const response = await destroy(`/api/users/${id}`);
    if (response.ok) {
      if (onSubmit) {
        onSubmit();
      }
      if (modalControlRef.current) {
        modalControlRef.current.removeModal();
      }
    }
  };

  return (
    <Modal ref={modalControlRef}>
      <Card>
        <TopHeader backGroundColor={FadedRed}>Remove User</TopHeader>
        <Content>
          Are you sure you want to delete {first_name} {last_name}?
          <CButton onClick={submit}>Delete</CButton>
        </Content>
      </Card>
    </Modal>
  );
};

const Content = styled.div`
  padding: 50px;
`;

const CButton = styled(SecondaryButton)`
  margin-top: 20px;
`;

export default DeleteUserModal;
