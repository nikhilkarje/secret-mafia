import styled, { css } from "styled-components";

import { CenteredContent, BoxShadow } from "styles/common";
import { Charcoal, LightGrey, Green, Seashell, BrightRed } from "styles/color";

const Default = css`
  padding: 10px 25px;
  font-weight: 600;
  font-size: 14px;
  border-radius: 5px;
  margin: auto;
  cursor: pointer;
  outline: none;
  ${BoxShadow}

  &:active {
    box-shadow: none;
  }
`;

const Button = styled.button`
  ${CenteredContent}
  ${Default}
  background: ${Green};
  color: ${Seashell};

  &:active {
    border: 1px solid ${Green};
    color: ${Green};
    background: ${Seashell};
  }
`;

export const SecondaryButton = styled.button`
  ${CenteredContent}
  ${Default}
  background: ${LightGrey};
  color: ${Charcoal};
`;

export const PrimaryButton = styled.button`
  ${CenteredContent}
  ${Default}
  background: ${BrightRed};
  color: ${Seashell};

  &:active {
    border: 1px solid ${BrightRed};
    color: ${BrightRed};
    background: ${Seashell};
  }
`;

export default Button;
