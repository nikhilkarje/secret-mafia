import React from "react";
import styled from "styled-components";

import Header from "components/layout/Header";
import Footer from "components/layout/Footer";
import { HEADER_HEIGHT } from "constants/style";
import { Seashell } from "styles/color";

export default function Container({
  isLogin,
  isInRoom,
  children,
}: {
  isInRoom?: boolean;
  isLogin?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <CContainer>
        <Header isInRoom={isInRoom} isLogin={isLogin} />
        <Content>{children}</Content>
      </CContainer>
      <Footer />
    </>
  );
}

const CContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 1080px;
`;

const Content = styled.div`
  height: 1px;
  min-height: calc(100vh - ${HEADER_HEIGHT}px);
  flex: 1 0 auto;
  background-color: ${Seashell};
`;
