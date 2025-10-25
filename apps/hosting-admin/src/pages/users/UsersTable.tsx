import React from "react";
import { IconAction, Space, Table, Tag } from "../../components";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { capitalize, orderBy } from "lodash";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
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

interface UsersTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onRemoveUser: (user: User) => void;
}

interface TableUser extends User {
  key: string;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEditUser,
  onRemoveUser,
}) => {
  const columns: ColumnsType<TableUser> = [
    {
      title: "Fecha de Creación",
      dataIndex: "createAt",
      key: "createAt",
      width: 180,
      align: "center",
      render: (_, user) =>
        user.createAt
          ? dayjs(user.createAt.toDate()).format("DD/MM/YYYY HH:mm")
          : "-",
    },
    {
      title: "Nombres",
      dataIndex: "firstName",
      key: "firstName",
      width: 200,
      render: (_, user) => (
        <UserName>{capitalize(user.firstName || "")}</UserName>
      ),
    },
    {
      title: "Apellido Paterno",
      dataIndex: "paternalSurname",
      key: "paternalSurname",
      width: 180,
      render: (_, user) => capitalize(user.paternalSurname || ""),
    },
    {
      title: "Apellido Materno",
      dataIndex: "maternalSurname",
      key: "maternalSurname",
      width: 180,
      render: (_, user) => capitalize(user.maternalSurname || ""),
    },
    {
      title: "DNI",
      dataIndex: "dni",
      key: "dni",
      width: 120,
      align: "center",
      render: (_, user) => <DNITag>{user.document.number || "-"}</DNITag>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (_, user) => <EmailText>{user.email || "-"}</EmailText>,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: () => (
        <Tag color="green" style={{ margin: 0 }}>
          Activo
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 120,
      align: "center",
      fixed: "right",
      render: (_, user) => (
        <Space size="small">
          <IconAction
            tooltipTitle="Editar usuario"
            icon={faEdit}
            variant="primary"
            onClick={() => onEditUser(user)}
          />
          <IconAction
            tooltipTitle="Eliminar usuario"
            icon={faTrash}
            variant="error"
            onClick={() => onRemoveUser(user)}
          />
        </Space>
      ),
    },
  ];

  const dataSource: TableUser[] = orderBy(users, ["createAt"], ["desc"]).map(
    (user) => ({
      ...user,
      key: user.id,
    })
  );

  return (
    <TableContainer>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} usuarios`,
        }}
        scroll={{ x: 1200 }}
      />
    </TableContainer>
  );
};

const TableContainer = styled.div`
  ${() => css`
    .ant-table {
      background: ${theme.colors.secondary};
      border-radius: ${theme.border_radius.medium};

      .ant-table-thead > tr > th {
        background: ${theme.colors.dark};
        color: ${theme.colors.font1};
        font-weight: ${theme.font_weight.bold};
        border-bottom: 2px solid ${theme.colors.primary};

        &:hover {
          background: ${theme.colors.dark}dd;
        }
      }

      .ant-table-tbody > tr {
        &:hover > td {
          background: ${theme.colors.dark}40 !important;
        }

        > td {
          background: ${theme.colors.secondary};
          color: ${theme.colors.font1};
          border-bottom: 1px solid ${theme.colors.font2}20;
        }
      }

      .ant-table-cell {
        padding: ${theme.paddings.medium} ${theme.paddings.small};
      }
    }

    .ant-pagination {
      .ant-pagination-item {
        background: ${theme.colors.secondary};
        border-color: ${theme.colors.font2}40;

        a {
          color: ${theme.colors.font1};
        }

        &:hover {
          border-color: ${theme.colors.primary};

          a {
            color: ${theme.colors.primary};
          }
        }

        &.ant-pagination-item-active {
          background: ${theme.colors.primary};
          border-color: ${theme.colors.primary};

          a {
            color: ${theme.colors.dark};
          }
        }
      }

      .ant-pagination-prev,
      .ant-pagination-next {
        .ant-pagination-item-link {
          background: ${theme.colors.secondary};
          border-color: ${theme.colors.font2}40;
          color: ${theme.colors.font1};

          &:hover {
            border-color: ${theme.colors.primary};
            color: ${theme.colors.primary};
          }
        }
      }

      .ant-pagination-options {
        .ant-select-selector {
          background: ${theme.colors.secondary};
          border-color: ${theme.colors.font2}40;
          color: ${theme.colors.font1};
        }
      }

      .ant-pagination-total-text {
        color: ${theme.colors.font1};
      }
    }
  `}
`;

const UserName = styled.span`
  ${() => css`
    font-weight: ${theme.font_weight.medium};
    color: ${theme.colors.font1};
  `}
`;

const DNITag = styled.span`
  ${() => css`
    background: ${theme.colors.primary}20;
    color: ${theme.colors.primary};
    padding: ${theme.paddings.xx_small} ${theme.paddings.small};
    border-radius: ${theme.border_radius.small};
    font-family: monospace;
    font-weight: ${theme.font_weight.medium};
  `}
`;

const EmailText = styled.span`
  ${() => css`
    color: ${theme.colors.font2};
    font-size: ${theme.font_sizes.x_small};
  `}
`;
