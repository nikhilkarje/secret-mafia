import React from "react";
import styled from "styled-components";

import { FOOTER_HEIGHT } from "constants/style";
import { CenteredContent } from "styles/common";
import { Melon, Charcoal, Seashell } from "styles/color";

export default function Footer() {
  return <CFooter>Copyright © SystemDruid {new Date().getFullYear()}.</CFooter>;
}

const CFooter = styled.div`
  color: ${Seashell};
  font-size: 14px;
  height: ${FOOTER_HEIGHT}px;
  border-top: 1px solid rgb(158, 158, 158);
  background-color: ${Melon};
  ${CenteredContent}
`;
