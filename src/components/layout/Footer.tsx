import React from "react";
import styled from "styled-components";

import { FOOTER_HEIGHT } from "constants/style";
import { CenteredContent } from "styles/common";
import { Chestnut, Seashell, Melon, Charcoal } from "styles/color";

export default function Footer() {
  return (
    <CFooter>Copyright © Your Website {new Date().getFullYear()}.</CFooter>
  );
}

const CFooter = styled.div`
  color: ${Charcoal};
  font-size: 14px;
  height: ${FOOTER_HEIGHT}px;
  border-top: 1px solid rgb(158, 158, 158);
  background-color: ${Melon};
  ${CenteredContent}
`;
