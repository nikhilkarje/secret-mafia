import React, { useState, ReactNode } from "react";
import styled from "styled-components";

import Card from "components/common/Card";
import TopHeader from "components/common/TopHeader";
import Button from "components/common/Button";
import WideInput from "components/common/WideInput";
import Modal, { ModalChildProps } from "components/common/Modal";
import { post } from "utils/request";

const NewRoomForm = ({
  removeModal,
  onSubmit,
}: {
  removeModal: () => void;
  onSubmit?: () => void;
}) => {
  const [title, setTitle] = useState<string>("");
  const [totalPlayers, setTotalPlayers] = useState<number>(5);
  const [errorField, setErrorField] = useState<string>("");
  const [totalErrorField, setTotalErrorField] = useState<string>("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorField) {
      setErrorField("");
    }
    setTitle(e.target.value);
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (totalErrorField) {
      setTotalErrorField("");
    }
    setTotalPlayers(+e.target.value);
  };

  const validate = () => {
    let isError = false;
    if (!title) {
      isError = true;
      setErrorField("Please enter room title");
    }
    if (!totalPlayers || totalPlayers < 5 || totalPlayers > 10) {
      isError = true;
      setTotalErrorField("Please enter total players within 5 to 10");
    }
    return isError;
  };

  const submit = async () => {
    if (validate()) {
      return;
    }
    const response = await post("/api/conversations", {
      title,
      total_players: totalPlayers,
    });
    removeModal();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Card>
      <TopHeader>New Room</TopHeader>
      <Content>
        <WideInput
          key="title"
          type="text"
          placeholder="Room Title"
          defaultValue={title}
          error={errorField}
          onChange={handleTitleChange}
        />
        <WideInput
          key="title"
          type="number"
          placeholder="Total Players"
          defaultValue={totalPlayers}
          error={totalErrorField}
          onChange={handleTotalChange}
        />
        <CButton onClick={submit}>Submit</CButton>
      </Content>
    </Card>
  );
};

const NewRoomModal = ({
  children,
  onSubmit,
}: {
  children: (props: ModalChildProps) => ReactNode;
  onSubmit?: () => void;
}) => {
  const [modalProps, setModalProps] = useState<ModalChildProps | null>(null);
  return (
    <>
      {modalProps && children(modalProps)}
      <Modal>
        {(props) => {
          if (!modalProps) setModalProps(props);
          return (
            <NewRoomForm onSubmit={onSubmit} removeModal={props.removeModal} />
          );
        }}
      </Modal>
    </>
  );
};

const Content = styled.div`
  padding: 50px;
`;

const CButton = styled(Button)`
  margin-top: 20px;
`;

export default NewRoomModal;
