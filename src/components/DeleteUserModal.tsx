import React, { useState, useRef } from "react";
import styled from "styled-components";

import Card from "components/common/Card";
import TopHeader from "components/common/TopHeader";
import { SecondaryButton } from "components/common/Button";
import Modal from "components/common/Modal";
import { User } from "interfaces";
import { destroy } from "utils/request";
import { FadedRed } from "styles/color";

const DeleteUserForm = ({
  user,
  onSubmit,
  closeModal,
}: {
  user: User;
  onSubmit?: () => void;
  closeModal?: any;
}) => {
  const { id, first_name, last_name } = user;

  const submit = async () => {
    const response = await destroy(`/api/users/${id}`);
    if (response.ok) {
      if (onSubmit) {
        onSubmit();
      }
      if (closeModal.current) {
        closeModal.current();
      }
    }
  };

  return (
    <Card>
      <TopHeader backGroundColor={FadedRed}>Remove User</TopHeader>
      <Content>
        Are you sure you want to delete {first_name} {last_name}?
        <CButton onClick={submit}>Delete</CButton>
      </Content>
    </Card>
  );
};

const DeleteUserModal = ({
  children,
  triggerCss,
  onSubmit,
  user,
}: {
  children: React.ReactNode;
  triggerCss?: any;
  onSubmit?: () => void;
  user: User;
}) => {
  const closeRef = useRef(null);
  return (
    <Modal
      ref={closeRef}
      triggerCss={triggerCss}
      content={
        <DeleteUserForm user={user} closeModal={closeRef} onSubmit={onSubmit} />
      }
    >
      {children}
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
