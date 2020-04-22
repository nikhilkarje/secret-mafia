import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import Card from "components/common/Card";
import TopHeader from "components/common/TopHeader";
import Button from "components/common/Button";
import WideInput from "components/common/WideInput";
import { post } from "utils/request";

export default function LoginCard() {
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  const login = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const response = await post("/login", {
      email,
      password,
    });
    if (response.ok) {
      window.location.href = "/";
    }
  };

  return (
    <Card>
      <TopHeader>Login</TopHeader>
      <Content>
        <WideInput
          key="email"
          forwardRef={emailRef}
          type="text"
          placeholder="Email or Username"
        />
        <WideInput
          key="password"
          forwardRef={passwordRef}
          type="password"
          placeholder="Password"
        />
        <CButton onClick={login}>Submit</CButton>
      </Content>
    </Card>
  );
}

const Content = styled.div`
  padding: 50px;
`;

const CButton = styled(Button)`
  margin-top: 20px;
`;
