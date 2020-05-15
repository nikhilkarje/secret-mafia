import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";

import Container from "components/layout/Container";
import LoginCard from "components/login/LoginCard";
import CreateCard from "components/login/CreateCard";
import { CenteredContent } from "styles/common";

export default function LoginApp() {
  return (
    <Container isLogin={true}>
      <LoginWrapper>
        <Router>
          <Switch>
            <Route path="/login">
              <LoginCard />
            </Route>
            <Route path="/create">
              <CreateCard />
            </Route>
          </Switch>
        </Router>
      </LoginWrapper>
    </Container>
  );
}

const LoginWrapper = styled.div`
  height: 100%;
  ${CenteredContent}
`;
