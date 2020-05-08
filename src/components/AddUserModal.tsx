import React, { useState, ReactNode } from "react";
import styled from "styled-components";

import Card from "components/common/Card";
import TopHeader from "components/common/TopHeader";
import Button from "components/common/Button";
import WideInput from "components/common/WideInput";
import Modal, { ModalChildProps } from "components/common/Modal";
import { UserForm, UserFormIndex } from "interfaces";
import { post } from "utils/request";

const AddUserForm = ({
  onSubmit,
  removeModal,
}: {
  onSubmit?: () => void;
  removeModal: () => void;
}) => {
  const defaultValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };
  const [field, setField] = useState<UserForm>(defaultValues);
  const [errorField, setErrorField] = useState<UserForm>(defaultValues);

  const handleFormChange = (
    fieldKey: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let envelope = { ...field, [fieldKey]: e.target.value };
    if (errorField[fieldKey as UserFormIndex]) {
      setErrorField({ ...errorField, [fieldKey]: "" });
    }
    setField(envelope);
  };

  const validate = () => {
    const envelope = { ...field };
    let isError = false;
    let errorEnvelope = { ...errorField };
    for (const fieldKey in envelope) {
      const key = fieldKey as UserFormIndex;
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
    const response = await post("/api/users", { api_user: envelope });
    if (response.ok) {
      if (onSubmit) {
        onSubmit();
      }
      removeModal();
    }
  };

  return (
    <Card>
      <TopHeader>Add User</TopHeader>
      <Content>
        <WideInput
          key="first_name"
          type="text"
          placeholder="First Name"
          error={errorField.first_name}
          onChange={handleFormChange.bind(null, "first_name")}
        />
        <WideInput
          key="last_name"
          type="text"
          placeholder="Last Name"
          error={errorField.last_name}
          onChange={handleFormChange.bind(null, "last_name")}
        />
        <WideInput
          key="email"
          type="text"
          placeholder="Email"
          error={errorField.email}
          onChange={handleFormChange.bind(null, "email")}
        />
        <WideInput
          key="password"
          type="password"
          placeholder="Password"
          error={errorField.password}
          onChange={handleFormChange.bind(null, "password")}
        />
        <CButton onClick={submit}>Submit</CButton>
      </Content>
    </Card>
  );
};

const AddUserModal = ({
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
            <AddUserForm removeModal={props.removeModal} onSubmit={onSubmit} />
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

export default AddUserModal;
