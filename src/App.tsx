import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";

import Container from "components/layout/Container";
import RoomList from "components/RoomList";
import ChatRoom from "components/ChatRoom";
import { CenteredContent } from "styles/common";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route
          path="/room/:roomId"
          render={(props) => (
            <Container roomId={props.match.params.roomId}>
              <ChatRoom />
            </Container>
          )}
        />
        <Route path="/">
          <Container>
            <Wrapper>
              <Content>
                <RoomList />
              </Content>
            </Wrapper>
          </Container>
        </Route>
      </Switch>
    </Router>
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
