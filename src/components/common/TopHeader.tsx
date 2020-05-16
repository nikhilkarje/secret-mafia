import styled, { css } from "styled-components";

import { CenteredContent } from "styles/common";
import { Chestnut, Seashell, Skobeloff } from "styles/color";

const TopHeader = styled.div<{
  backGroundColor?: any;
}>`
  ${CenteredContent}
  padding: 20px 25px;
  background-color: ${Skobeloff};
  color: ${Seashell};
  font-weight: 600;
  font-size: 18px;
  border-radius: 3px 3px 0 0;
  ${({ backGroundColor }) =>
    !!backGroundColor &&
    css`
      background-color: ${backGroundColor};
    `}
`;

export default TopHeader;
