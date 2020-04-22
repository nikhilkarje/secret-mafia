import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { White } from "styles/color";

import TopHeader from "components/common/TopHeader";
import { Room, Player } from "interfaces";
import CableContext from "containers/CableContext";
import { get } from "utils/request";
import Players from "components/Players";

const GameRoom = ({ room }: { room: Room }) => {
  return (
    <Container>
      <TopHeader>{room.title}</TopHeader>
      <Players roomId={room.id} />
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  background-color: ${White};
  display: flex;
  flex-direction: column;
`;

export default GameRoom;
