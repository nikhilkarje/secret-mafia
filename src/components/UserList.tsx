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

export default function UserList() {
  const modalControlRef = useRef(null);
  const modalCollectionRef = useRef<any>({});
  const [users, setUsers] = useState<UserListItem[] | null>(null);

  const fetchUsers = () => {
    get("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data.users));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users) {
      users.map((user) => {
        modalCollectionRef.current[`editModalRef${user.id}`] = createRef();
        modalCollectionRef.current[`deleteModalRef${user.id}`] = createRef();
      });
    }
  }, [users]);

  return (
    <CCard>
      <CTopHeader>
        Users List
        <AddUserModal modalControlRef={modalControlRef} onSubmit={fetchUsers} />
        <Add
          onClick={modalControlRef.current.addModal()}
          iconCss={AddIconCss}
        />
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
                <Edit
                  onClick={() =>
                    modalCollectionRef.current[
                      `editModalRef${user.id}`
                    ].current.addModal()
                  }
                  iconCss={EditIconCss}
                />
                <EditUserModal
                  modalControlRef={
                    modalCollectionRef.current[`editModalRef${user.id}`]
                  }
                  user={user}
                  onSubmit={fetchUsers}
                />
                <Delete
                  onClick={() =>
                    modalCollectionRef.current[
                      `deleteModalRef${user.id}`
                    ].current.addModal()
                  }
                  iconCss={EditIconCss}
                />
                <DeleteUserModal
                  modalControlRef={
                    modalCollectionRef.current[`deleteModalRef${user.id}`]
                  }
                  user={user}
                  onSubmit={fetchUsers}
                ></DeleteUserModal>
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
