import React, { useEffect, useState, useRef, createRef } from "react";
import styled, { css } from "styled-components";

import { UserListItem } from "interfaces";
import AddUserModal from "components/AddUserModal";
import EditUserModal from "components/EditUserModal";
import DeleteUserModal from "components/DeleteUserModal";
import Card from "components/common/Card";
import { Add, Delete, Edit } from "components/common/icons";
import TopHeader from "components/common/TopHeader";
import Table, {
  TableHeader,
  TableRow,
  TableData,
} from "components/common/Table";
import { DarkGrey } from "styles/color";
import { get } from "utils/request";
import { HEADER_HEIGHT, FOOTER_HEIGHT } from "constants/style";

export default function UserList() {
  const [users, setUsers] = useState<UserListItem[] | null>(null);

  const fetchUsers = () => {
    get("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data.users));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <CCard>
      <CTopHeader>
        Users List
        <AddUserModal onSubmit={fetchUsers}>
          {(modalProps) => (
            <Add onClick={() => modalProps.addModal()} iconCss={AddIconCss} />
          )}
        </AddUserModal>
      </CTopHeader>
      <Table>
        <TableRow>
          <TableHeader>Id</TableHeader>
          <TableHeader>Name</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader>Action</TableHeader>
        </TableRow>
        {users &&
          users.map((user: UserListItem) => (
            <TableRow key={user.id}>
              <TableData>{user.id}</TableData>
              <TableData>{`${user.first_name} ${user.last_name}`}</TableData>
              <TableData>{user.email}</TableData>
              <TableData>
                <EditUserModal user={user} onSubmit={fetchUsers}>
                  {(modalProps) => (
                    <Edit
                      onClick={() => modalProps.addModal()}
                      iconCss={EditIconCss}
                    />
                  )}
                </EditUserModal>

                <DeleteUserModal user={user} onSubmit={fetchUsers}>
                  {(modalProps) => (
                    <Delete
                      onClick={() => modalProps.addModal()}
                      iconCss={EditIconCss}
                    />
                  )}
                </DeleteUserModal>
              </TableData>
            </TableRow>
          ))}
      </Table>
    </CCard>
  );
}

const CTopHeader = styled(TopHeader)`
  position: relative;
`;

const CCard = styled(Card)`
  min-width: 960px;
  max-height: calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT + 100});
  overflow: scroll;
`;

const AddIconCss = css`
  font-size: 30px;
  position: absolute;
  right: 40px;
`;

const EditIconCss = css`
  font-size: 20px;
  color: ${DarkGrey};
`;
