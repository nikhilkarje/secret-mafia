import React from "react";
import styled from "styled-components";

import Container from "components/layout/Container";
import LoginCard from "components/login/LoginCard";
import { CenteredContent } from "styles/common";

export default function LoginApp() {
  return (
    <Container isLogin={true}>
      <LoginWrapper>
        <LoginCard />
      </LoginWrapper>
    </Container>
  );
}

const LoginWrapper = styled.div`
  height: 100%;
  ${CenteredContent}
`;
