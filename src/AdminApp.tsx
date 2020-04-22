import React from "react";
import styled from "styled-components";

import Container from "components/layout/Container";
import UserList from "components/UserList";
import { CenteredContent } from "styles/common";

export default function AdminApp() {
  return (
    <Container>
      <Wrapper>
        <UserList />
      </Wrapper>
    </Container>
  );
}

const Wrapper = styled.div`
  height: 100%;
  ${CenteredContent}
`;
