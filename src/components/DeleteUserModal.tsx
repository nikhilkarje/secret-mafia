import React, { useState, useRef, ReactNode } from "react";
import styled from "styled-components";

import Card from "components/common/Card";
import TopHeader from "components/common/TopHeader";
import { SecondaryButton } from "components/common/Button";
import Modal, { ModalChildProps } from "components/common/Modal";
import { UserListItem } from "interfaces";
import { destroy } from "utils/request";
import { FadedRed } from "styles/color";

const DeleteUserModal = ({
  children,
  onSubmit,
  user,
}: {
  children: (props: ModalChildProps) => ReactNode;
  onSubmit?: () => void;
  user: UserListItem;
}) => {
  const { id, first_name, last_name } = user;
  const [modalProps, setModalProps] = useState<ModalChildProps | null>(null);

  const submit = async (removeModal: () => void) => {
    const response = await destroy(`/api/users/${id}`);
    if (response.ok) {
      if (onSubmit) {
        onSubmit();
      }
      removeModal();
    }
  };

  return (
    <>
      {modalProps && children(modalProps)}
      <Modal>
        {(props) => {
          if (!modalProps) setModalProps(props);
          return (
            <Card>
              <TopHeader backGroundColor={FadedRed}>Remove User</TopHeader>
              <Content>
                Are you sure you want to delete {first_name} {last_name}?
                <CButton onClick={() => submit(props.removeModal)}>
                  Delete
                </CButton>
              </Content>
            </Card>
          );
        }}
      </Modal>
    </>
  );
};

const Content = styled.div`
  padding: 50px;
`;

const CButton = styled(SecondaryButton)`
  margin-top: 20px;
`;

export default DeleteUserModal;
