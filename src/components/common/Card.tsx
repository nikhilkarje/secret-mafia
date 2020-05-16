import styled, { css } from "styled-components";

import { BoxShadow, CenteredContent } from "styles/common";
import { Seashell, LightGrey, Blue, FadedRed } from "styles/color";

const Card = styled.div`
  min-width: 320px;
  border-radius: 3px;
  background-color: ${Seashell};
  ${BoxShadow}
`;

export const MiniCard = styled(Card)<{
  isActive?: boolean;
  isSelectable?: boolean;
  isDisabled?: boolean;
}>`
  min-width: 175px;
  font-size: 24px;
  padding: 20px;
  position: relative;
  margin: 1px;
  border: 1px solid ${LightGrey};
  ${CenteredContent}
  flex-direction: column;

  ${({ isSelectable }) =>
    isSelectable &&
    css`
      cursor: pointer;
    `}

  ${({ isActive }) =>
    isActive &&
    css`
      margin: 0 1px;
      border: 2px solid ${Blue};
    `}
`;

export default Card;
