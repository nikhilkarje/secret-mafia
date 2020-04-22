import React, { useState, useRef } from "react";
import styled from "styled-components";

import Card from "components/common/Card";
import TopHeader from "components/common/TopHeader";
import Button from "components/common/Button";
import WideInput from "components/common/WideInput";
import Modal from "components/common/Modal";
import { post } from "utils/request";

const NewRoomForm = ({
  onSubmit,
  closeModal,
}: {
  onSubmit?: () => void;
  closeModal?: any;
}) => {
  const [title, setTitle] = useState<string>("");
  const [errorField, setErrorField] = useState<string>("");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorField) {
      setErrorField("");
    }
    setTitle(e.target.value);
  };

  const validate = () => {
    let isError = false;
    if (!title) {
      isError = true;
      setErrorField("Please enter room title");
    }
    return isError;
  };

  const submit = async () => {
    if (validate()) {
      return;
    }
    const response = await post("/channel/conversations", { title });
    if (closeModal.current) {
      closeModal.current();
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
          onChange={handleFormChange}
        />
        <CButton onClick={submit}>Submit</CButton>
      </Content>
    </Card>
  );
};

const NewRoomModal = ({
  children,
  triggerCss,
  onSubmit,
}: {
  children: React.ReactNode;
  triggerCss?: any;
  onSubmit?: () => void;
}) => {
  const closeRef = useRef(null);
  return (
    <Modal
      ref={closeRef}
      triggerCss={triggerCss}
      content={<NewRoomForm closeModal={closeRef} onSubmit={onSubmit} />}
    >
      {children}
    </Modal>
  );
};

const Content = styled.div`
  padding: 50px;
`;

const CButton = styled(Button)`
  margin-top: 20px;
`;

export default NewRoomModal;
