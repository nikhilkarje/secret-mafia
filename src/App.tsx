import ChatRoom from "components/ChatRoom";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import styled from "styled-components";

import Container from "components/layout/Container";
import RoomList from "components/RoomList";
import { CenteredContent } from "styles/common";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/room/:roomId">
          <Container isInRoom>
            <ToastProvider autoDismiss={true} autoDismissTimeout={10000}>
              <ChatRoom />
            </ToastProvider>
          </Container>
        </Route>
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
