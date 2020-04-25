import React, { useState, useRef } from "react";
import styled from "styled-components";

import Card from "components/common/Card";
import TopHeader from "components/common/TopHeader";
import Button from "components/common/Button";
import WideInput from "components/common/WideInput";
import Modal from "components/common/Modal";
import { UserListItem, EditUserForm, EditUserFormIndex } from "interfaces";
import { put } from "utils/request";

const EditUserForm = ({
  user,
  onSubmit,
  modalControlRef,
}: {
  user: UserListItem;
  onSubmit?: () => void;
  modalControlRef: any;
}) => {
  const defaultValues = {
    first_name: "",
    last_name: "",
    email: "",
  };
  const [field, setField] = useState<EditUserForm>(user);
  const [errorField, setErrorField] = useState<EditUserForm>(defaultValues);

  const handleFormChange = (
    fieldKey: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let envelope = { ...field, [fieldKey]: e.target.value };
    if (errorField[fieldKey as EditUserFormIndex]) {
      setErrorField({ ...errorField, [fieldKey]: "" });
    }
    setField(envelope);
  };

  const validate = () => {
    const envelope = { ...field };
    let isError = false;
    let errorEnvelope = { ...errorField };
    for (const fieldKey in envelope) {
      const key = fieldKey as EditUserFormIndex;
      if (!envelope[key]) {
        isError = true;
        errorEnvelope = { ...errorEnvelope, [key]: "Required field" };
      }
    }
    setErrorField(errorEnvelope);
    return isError;
  };

  const submit = async () => {
    if (validate()) {
      return;
    }
    const envelope = { ...field };
    const response = await put(`/api/users/${user.id}`, {
      api_user: envelope,
    });
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
    <Card>
      <TopHeader>Edit User</TopHeader>
      <Content>
        <WideInput
          key="first_name"
          type="text"
          placeholder="First Name"
          defaultValue={field.first_name}
          error={errorField.first_name}
          onChange={handleFormChange.bind(null, "first_name")}
        />
        <WideInput
          key="last_name"
          type="text"
          placeholder="Last Name"
          defaultValue={field.last_name}
          error={errorField.last_name}
          onChange={handleFormChange.bind(null, "last_name")}
        />
        <WideInput
          key="email"
          type="text"
          placeholder="Email"
          defaultValue={field.email}
          error={errorField.email}
          onChange={handleFormChange.bind(null, "email")}
        />
        <CButton onClick={submit}>Submit</CButton>
      </Content>
    </Card>
  );
};

const EditUserModal = ({
  onSubmit,
  user,
  modalControlRef,
}: {
  onSubmit?: () => void;
  user: UserListItem;
  modalControlRef: any;
}) => {
  return (
    <Modal ref={modalControlRef}>
      <EditUserForm
        user={user}
        modalControlRef={modalControlRef}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};

const Content = styled.div`
  padding: 50px;
`;

const CButton = styled(Button)`
  margin-top: 20px;
`;

export default EditUserModal;
