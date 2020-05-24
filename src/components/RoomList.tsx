import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

import Card from "components/common/Card";
import { Add } from "components/common/icons";
import Table, {
  TableData,
  TableHeader,
  TableRow,
} from "components/common/Table";
import TopHeader from "components/common/TopHeader";
import NewRoomModal from "components/NewRoomModal";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "constants/style";
import { Room } from "interfaces";
import { Terracotta } from "styles/color";
import { get, post } from "utils/request";

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const roomsRef = useRef(null);

  const fetchRooms = () => {
    get("/api/conversations")
      .then((response) => response.json())
      .then((data) => setRooms(data));
  };

  const joinRoom = async (roomId: number) => {
    const response = await post(`/api/conversations/${roomId}/players`, {});
    if (response.ok) {
      const data = await response.json();
      window.location.href = `/room/${roomId}`;
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);

  return (
    <CCard>
      <CTopHeader>
        Chat Rooms
        <NewRoomModal onSubmit={fetchRooms}>
          {(modalProps) => (
            <Add iconCss={IconCss} onClick={() => modalProps.addModal()} />
          )}
        </NewRoomModal>
      </CTopHeader>
      <Table>
        <TableRow>
          <TableHeader>Id</TableHeader>
          <TableHeader>Title</TableHeader>
          <TableHeader>Players</TableHeader>
          <TableHeader>Action</TableHeader>
        </TableRow>
        {rooms &&
          rooms.map((room: Room) => (
            <TableRow key={room.id}>
              <TableData>{room.id}</TableData>
              <TableData>{room.title}</TableData>
              <TableData>
                {room.players_joined}/{room.total_players}
              </TableData>
              <TableData>
                <Link onClick={() => joinRoom(room.id)}> Join</Link>
              </TableData>
            </TableRow>
          ))}
      </Table>
    </CCard>
  );
}

const Link = styled.span`
  cursor: pointer;
  color: ${Terracotta};
`;

const CTopHeader = styled(TopHeader)`
  position: relative;
`;

const CCard = styled(Card)`
  min-width: 960px;
  max-height: calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT + 100});
  overflow: scroll;
`;

const IconCss = css`
  font-size: 30px;
  position: absolute;
  right: 40px;
`;
