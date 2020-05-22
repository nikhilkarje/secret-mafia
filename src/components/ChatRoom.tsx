import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import styled, { css, keyframes } from "styled-components";

import Card from "components/common/Card";
import ChatBox from "components/ChatBox";
import GameRoom from "components/GameRoom";
import CableContext from "containers/CableContext";
import {
  LightGrey,
  Skobeloff,
  Charcoal,
  ChampagnePink,
  Seashell,
  DarkRed,
} from "styles/color";
import { get } from "utils/request";
import { Room, Message } from "interfaces";
import Footer from "components/layout/Footer";
import { DoubleArrow } from "components/common/icons";
import { HEADER_HEIGHT } from "constants/style";

export default function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [collapseChat, setCollapseChat] = useState(false);
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
            <IconWrapper collapseChat={collapseChat}>
              <DoubleArrow
                onClick={() => setCollapseChat(!collapseChat)}
                iconCss={ArrowCss}
              />
            </IconWrapper>
            <GameRoom room={room} />
            {/* <CFooter /> */}
          </GameContainer>
          <CCard collapseChat={collapseChat}>
            <Content ref={contentRef}>
              {messages.map((message) => (
                <ChatWrapper
                  isAdmin={message.user_id === (window as any).config.admin_id}
                  key={message.id}
                >
                  <NameSpan>{message.name}:</NameSpan>
                  <MessageSpan>{message.text}</MessageSpan>
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

const ArrowCss = css`
  color: ${Seashell};
`;

const IconWrapper = styled.div<{
  collapseChat: boolean;
}>`
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
  height: 58px;
  display: inline-flex;
  align-items: center;
  padding: 0 15px;
  background-color: ${Skobeloff};

  ${({ collapseChat }) =>
    collapseChat &&
    css`
      transform: rotate(180deg);
    `}
`;

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const GameContainer = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  width: calc(100% - 320px);
  position: relative;
`;

const CFooter = styled(Footer)`
  flex: 0 0 auto;
`;

const CCard = styled(Card)<{
  collapseChat: boolean;
}>`
  flex: 0 0 auto;
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${LightGrey};
  background-color: ${ChampagnePink};
  transition: all 0.5s;

  ${({ collapseChat }) =>
    collapseChat &&
    css`
      width: 0;
      min-width: 0;
    `}
`;

const Content = styled.div`
  flex: 1 0 auto;
  padding: 20px 20px;
  overflow: auto;
  height: calc(100% - 88px);
`;

const ChatWrapper = styled.div<{
  isAdmin?: boolean;
}>`
  padding: 10px 0;
  color: ${Charcoal};
  ${({ isAdmin }) =>
    isAdmin &&
    css`
      color: ${DarkRed};
    `}
`;

const NameSpan = styled.span`
  font-weight: 400;
`;

const MessageSpan = styled.span`
  padding-left: 10px;
  font-weight: 200;
`;
