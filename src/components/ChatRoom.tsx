import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";

import Card from "components/common/Card";
import TopHeader from "components/common/TopHeader";
import ChatBox from "components/ChatBox";
import CableContext from "containers/CableContext";
import { BrightRed, Green } from "styles/color";
import { get } from "utils/request";
import { Message } from "interfaces";

export default function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const contentRef = useRef(null);
  const messagesRef = useRef<Message[]>(messages);
  const { cable } = useContext(CableContext);

  const scrollBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  };

  const fetchMessages = () => {
    get(`/channel/conversations/${roomId}`)
      .then((response) => response.json())
      .then((data) => setMessages(data.messages));
  };

  const handleReceivedConversation = (data: any) => {
    console.log(data);
    if (messagesRef.current) {
      setMessages([...messagesRef.current, data["channel/message"]]);
    }
  };

  useEffect(() => {
    fetchMessages();
    cable.subscriptions.create(
      { channel: "MessagesChannel", conversation: +roomId },
      {
        received: (response) => {
          handleReceivedConversation(response);
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
    <CCard>
      <TopHeader>{name}</TopHeader>
      <Content ref={contentRef}>
        {messages.map((message) => (
          <ChatWrapper key={message.id}>
            <NameSpan>
              {message.user.first_name} {message.user.last_name}:
            </NameSpan>
            <MessageSpan>{message.text}</MessageSpan>
          </ChatWrapper>
        ))}
      </Content>
      <ChatBox id={+roomId} />
    </CCard>
  );
}

const CCard = styled(Card)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1 0 auto;
  padding: 20px 50px;
  overflow: auto;
`;

const ChatWrapper = styled.div`
  padding: 10px 0;
`;

const NameSpan = styled.span`
  font-weight: 400;
`;

const MessageSpan = styled.span<{
  colorCode?: string;
}>`
  padding-left: 10px;
  font-weight: 200;
  ${({ colorCode }) => {
    if (!colorCode) {
      return "";
    }
    if (colorCode === "1") {
      return css`
        color: ${Green};
      `;
    } else if (colorCode === "2") {
      return css`
        color: ${BrightRed};
      `;
    }
  }}
`;
