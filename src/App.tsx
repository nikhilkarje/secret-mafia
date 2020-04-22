import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";

import Container from "components/layout/Container";
import RoomList from "components/RoomList";
import ChatRoom from "components/ChatRoom";
import { CenteredContent } from "styles/common";

export default function App() {
  return (
    <Container>
      <Router>
        <Switch>
          <Route path="/room/:roomId">
            <ChatRoom />
          </Route>
          <Route path="/">
            <Wrapper>
              <Content>
                <RoomList />
              </Content>
            </Wrapper>
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}

const Wrapper = styled.div`
  padding: 50px;
  height: 100%;
  ${CenteredContent}
`;

const Content = styled.div`
  max-height: 100%;
  overflow: auto;
`;
