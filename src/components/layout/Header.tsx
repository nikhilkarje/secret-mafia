import React from "react";
import styled, { css } from "styled-components";

import { HEADER_HEIGHT } from "constants/style";
import { BoxShadowBottom } from "styles/common";
import { LightGrey, Chestnut, Seashell } from "styles/color";

export default function Header({
  isLogin,
  isInRoom,
}: {
  isLogin?: boolean;
  isInRoom?: boolean;
}) {
  return (
    <CHeader isLogin={isLogin}>
      <Logo>SECRET HITLER</Logo>
      {isInRoom ? (
        <Link href="/leave_game">Leave Game</Link>
      ) : !isLogin ? (
        <Link href="/logout">Log out</Link>
      ) : null}
    </CHeader>
  );
}

const Logo = styled.span`
  font-family: "Piedra", cursive;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 3px;
`;

const Link = styled.a`
  color: ${Seashell};
`;

const CHeader = styled.div<{
  isLogin: boolean;
}>`
  height: ${HEADER_HEIGHT}px;
  ${BoxShadowBottom}
  padding: 0 50px;
  border-bottom: 1px solid ${LightGrey};
  display: flex;
  align-items: center;
  background-color: ${Chestnut};
  color: ${Seashell};

  ${({ isLogin }) =>
    isLogin
      ? css`
          justify-content: center;
        `
      : css`
          justify-content: space-between;
        `}
`;
