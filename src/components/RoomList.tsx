import React, { useContext, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { Room } from "interfaces";
import NewRoomModal from "components/NewRoomModal";
import Card from "components/common/Card";
import { Add } from "components/common/icons";
import TopHeader from "components/common/TopHeader";
import CableContext from "containers/CableContext";
import Table, {
  TableHeader,
  TableRow,
  TableData,
} from "components/common/Table";
import { DarkGrey, Purple } from "styles/color";
import { get, post } from "utils/request";

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const roomsRef = useRef(null);
  const modalControlRef = useRef(null);
  const { cable } = useContext(CableContext);

  const fetchRooms = () => {
    get("/api/conversations")
      .then((response) => response.json())
      .then((data) => setRooms(data));
  };

  const handleReceivedConversation = (data: Room) => {
    if (roomsRef.current) {
      setRooms([...roomsRef.current, data]);
    }
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
    cable.subscriptions.create(
      { channel: "ConversationsChannel" },
      {
        received: (response) => {
          console.log(response);
          handleReceivedConversation(response as Room);
        },
        connected: () => {},
        disconnected: () => {},
      }
    );
  }, []);

  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);

  return (
    <CCard>
      <CTopHeader>
        Chat Rooms
        <Add
          onClick={() => modalControlRef.current.addModal()}
          iconCss={AddIconCss}
        />
        <NewRoomModal modalControlRef={modalControlRef}></NewRoomModal>
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
                {/* <Link href={`/room/${room.id}`}> Join</Link> */}
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
  color: ${Purple};
`;

const CTopHeader = styled(TopHeader)`
  position: relative;
`;

const CCard = styled(Card)`
  min-width: 960px;
`;

const IconPosCss = css`
  position: absolute;
  right: 40px;
`;

const AddIconCss = css`
  font-size: 30px;
`;

const EditIconCss = css`
  font-size: 20px;
  color: ${DarkGrey};
`;
