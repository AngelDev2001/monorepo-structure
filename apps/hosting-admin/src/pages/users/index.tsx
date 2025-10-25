import React, { useEffect, useState } from "react";
import {
  AddButton,
  Col,
  Divider,
  Input,
  modalConfirm,
  notification,
  Row,
  Title,
} from "../../components";
import { useAuthentication, useGlobalData } from "../../providers";
import { useNavigate } from "react-router-dom";
import { UsersTable } from "./UsersTable";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiUserPatch,
} from "../../api";
import { assign, isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styled, { css } from "styled-components";
import { theme } from "../../styles";

import { Timestamp } from "firebase/firestore";

export interface Phone {
  prefix: string;
  number: string;
}

export interface ProfilePhoto {
  uid: string;
  name: string;
  url: string;
  thumbUrl?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  dni: string;
  cip?: string;
  phone?: Phone;
  profilePhoto?: ProfilePhoto | null;
  secondaryEmail?: string;
  bloodGroup?: string;
  workPlace?: string;
  cgi?: boolean;
  roleCode?: string;
  searchData?: string[];
  createAt: Timestamp;
  updateAt?: Timestamp;
  isDeleted: boolean;
  updateBy?: string;
}

export const Users: React.FC = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthentication();
  const { users } = useGlobalData();
  const { patchUser, patchUserResponse } = useApiUserPatch();

  const [userSearch, setUserSearch] = useState<string>("");
  const [usersView, setUsersView] = useState<User[]>([]);

  const navigateTo = (userId: string): void => navigate(userId);

  const onAddUser = (): void => navigateTo("new");

  const onEditUser = (user: User): void => navigateTo(user.id);

  const removeUser = async (user: User): Promise<void> => {
    const response = await patchUser(user);

    if (!patchUserResponse.ok) {
      throw new Error(response);
    }

    notification({
      type: "success",
      title: "¡Usuario eliminado exitosamente!",
    });
  };

  const onDeleteUser = async (user: User): Promise<void> => {
    try {
      const userToDelete = assign({}, user, {
        updateBy: authUser?.email,
        isDeleted: true,
      });

      await removeUser(userToDelete);
    } catch (e) {
      const errorResponse = await getApiErrorResponse(e);
      apiErrorNotification(errorResponse);
    }
  };

  const onConfirmRemoveUser = (user: User): void => {
    modalConfirm({
      content: "El usuario se eliminará",
      onOk: async () => {
        await onDeleteUser(user);
      },
    });
  };

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setUserSearch(value);
  };

  useEffect(() => {
    const usersMatch = users.filter((user) => {
      const searchText =
        `${user.firstName} ${user.paternalSurname} ${user.maternalSurname} ${user.dni}`.toLowerCase();
      return searchText.includes(userSearch.toLowerCase());
    });

    setUsersView(isEmpty(userSearch) ? users : usersMatch);
  }, [userSearch, users]);

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <AddButton onClick={onAddUser} title="Usuario" margin="0" />
        </Col>
        <Divider />
        <Col span={24}>
          <PageHeader>
            <Title level={2}>Usuarios ({usersView.length})</Title>
          </PageHeader>
        </Col>
        <Col span={24} md={12} lg={8}>
          <SearchContainer>
            <Input
              label="Búsqueda de usuarios"
              placeholder="Nombres, apellidos o DNI"
              value={userSearch}
              onChange={handleUserSearch}
              name="userSearch"
              suffix={<FontAwesomeIcon icon={faSearch} />}
            />
          </SearchContainer>
        </Col>
        <Col span={24}>
          <UsersTable
            users={usersView}
            onEditUser={onEditUser}
            onRemoveUser={onConfirmRemoveUser}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  ${() => css`
    padding: ${theme.paddings.large};
    min-height: 100vh;
  `}
`;

const PageHeader = styled.div`
  ${() => css`
    margin-bottom: ${theme.paddings.medium};

    h2 {
      color: ${theme.colors.font1};
      margin: 0;
    }
  `}
`;

const SearchContainer = styled.div`
  ${() => css`
    input {
      height: 2.5rem;
    }

    .ant-input-affix-wrapper {
      background: ${theme.colors.secondary};
      border-color: ${theme.colors.font2}40;

      &:hover,
      &:focus,
      &:focus-within {
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 2px ${theme.colors.primary}20;
      }

      .ant-input {
        background: transparent;
        color: ${theme.colors.font1};
      }

      .ant-input-suffix {
        color: ${theme.colors.font2};
      }
    }
  `}
`;
