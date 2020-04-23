import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { White } from "styles/color";

import PlayerControl from "components/PlayerControl";
import TopHeader from "components/common/TopHeader";
import { Room, Player } from "interfaces";
import CableContext from "containers/CableContext";
import Players from "components/Players";

const GameRoom = ({ room }: { room: Room }) => {
  const { cable } = useContext(CableContext);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  return (
    <>
      <Container>
        <TopHeader>{room.title}</TopHeader>
        <Players setCurrentPlayer={setCurrentPlayer} roomId={room.id} />
      </Container>
      {currentPlayer && <PlayerControl player={currentPlayer} />}
    </>
  );
};

const Container = styled.div`
  height: 100%;
  background-color: ${White};
  display: flex;
  flex-direction: column;
`;

export default GameRoom;
