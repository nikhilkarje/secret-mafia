import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import styled, { css } from "styled-components";

import Card from "components/common/Card";
import ChatBox from "components/ChatBox";
import GameRoom from "components/GameRoom";
import CableContext from "containers/CableContext";
import {
  BrightRed,
  Green,
  LightGrey,
  Skobeloff,
  Charcoal,
  ChampagnePink,
} from "styles/color";
import { get } from "utils/request";
import { Room, Message } from "interfaces";
import Footer from "components/layout/Footer";

export default function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const contentRef = useRef(null);
  const messagesRef = useRef<Message[]>(messages);
  const { cable } = useContext(CableContext);
  const { addToast } = useToasts();

  const scrollBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  };

  const fetchMessages = () => {
    get(`/api/conversations/${roomId}`)
      .then((response) => response.json())
      .then((data) => {
        const { messages, ...room } = data;
        setRoom(room);
        setMessages(messages);
      });
  };

  const handleReceivedConversation = (data: Message) => {
    if (data.type !== "default") {
      addToast(data.text, { appearance: data.type });
    }
    if (messagesRef.current) {
      setMessages([...messagesRef.current, data]);
    }
  };

  useEffect(() => {
    fetchMessages();
    cable.subscriptions.create(
      { channel: "MessagesChannel", conversation: +roomId },
      {
        received: (response) => {
          handleReceivedConversation(response as Message);
        },
        connected: () => {},
        disconnected: () => {},
      }
    );
  }, []);

  useEffect(() => {
    scrollBottom();
    messagesRef.current = messages;
  }, [messages]);

  return (
    <Container>
      {room && messages && (
        <>
          <GameContainer>
            <GameRoom room={room} />
            {/* <CFooter /> */}
          </GameContainer>
          <CCard>
            <Content ref={contentRef}>
              {messages.map((message) => (
                <ChatWrapper key={message.id}>
                  <NameSpan>{message.name}:</NameSpan>
                  <MessageSpan
                    isAdmin={
                      message.user_id === (window as any).config.admin_id
                    }
                  >
                    {message.text}
                  </MessageSpan>
                </ChatWrapper>
              ))}
            </Content>
            <ChatBox id={room.id} />
          </CCard>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const GameContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  width: calc(100% - 320px);
`;

const CFooter = styled(Footer)`
  flex: 0 0 auto;
`;

const CCard = styled(Card)`
  flex: 0 0 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${LightGrey};
  background-color: ${ChampagnePink};
`;

const Content = styled.div`
  flex: 1 0 auto;
  padding: 20px 20px;
  overflow: auto;
  height: calc(100% - 88px);
`;

const ChatWrapper = styled.div`
  padding: 10px 0;
  color: ${Charcoal};
`;

const NameSpan = styled.span`
  font-weight: 400;
`;

const MessageSpan = styled.span<{
  isAdmin?: boolean;
}>`
  padding-left: 10px;
  font-weight: 200;
  ${({ isAdmin }) =>
    isAdmin &&
    css`
      color: ${Skobeloff};
    `}
`;
