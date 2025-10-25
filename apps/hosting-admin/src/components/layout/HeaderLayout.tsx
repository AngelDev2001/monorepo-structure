import { Layout, Space } from "antd";
import styled, { css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBars,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { mediaQuery, theme } from "../../styles";
import { useAuthentication } from "../../providers";
import { Dropdown } from "../ui";
import { PhotoNoFound } from "../../images";
import { Link } from "react-router-dom";
import { useState } from "react";
import { capitalize } from "lodash";
import { userFullName } from "../../utils";

const { Header } = Layout;

type HeaderLayoutProps = {
  isVisibleDrawer: boolean;
  onSetIsVisibleDrawer: (isVisibleDrawer: boolean) => void;
};

export const HeaderLayout = ({
  isVisibleDrawer,
  onSetIsVisibleDrawer,
}: HeaderLayoutProps) => {
  const { authUser, logout } = useAuthentication();
  const [openDropdown, setOpenDropdown] = useState(false);

  const menuItems = [
    {
      label: (
        <Link to="/profile">
          <MenuItemContent>
            <FontAwesomeIcon icon={faUser} />
            <span>Perfil</span>
          </MenuItemContent>
        </Link>
      ),
      key: "profile",
    },
    {
      type: "divider" as const,
    },
    {
      label: (
        <MenuItemContent $danger onClick={() => logout()}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span>Cerrar sesión</span>
        </MenuItemContent>
      ),
      key: "logout",
    },
  ];

  return (
    <HeaderContainer>
      <div className="left-item">
        <Space align="center" className="items-wrapper">
          <div
            style={{ fontSize: "1.7em", display: "flex", alignItems: "center" }}
            onClick={() => onSetIsVisibleDrawer(!isVisibleDrawer)}
          >
            <FontAwesomeIcon icon={faBars} className="icon-item" />
          </div>
        </Space>
      </div>
      <div className="user-items">
        <Dropdown
          trigger={["click"]}
          menu={{ items: menuItems }}
          open={openDropdown}
          onOpenChange={setOpenDropdown}
          placement="bottomRight"
        >
          <UserProfile>
            <div className="user-info">
              <h4>{capitalize(userFullName(authUser) || "")}</h4>
            </div>
            {authUser && (
              <img
                src={authUser?.profilePhoto?.thumbUrl || PhotoNoFound}
                alt="user"
              />
            )}
          </UserProfile>
        </Dropdown>
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled(Header)`
  ${() => css`
    background: ${theme.colors.secondary} !important;
    position: sticky;
    top: 1px;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 2px 8px ${theme.colors.dark}80;
    border-bottom: 1px solid ${theme.colors.primary}20;
    overflow: hidden;
    padding: 0 ${theme.paddings.large};

    .left-item {
      display: flex;
      align-items: center;

      .items-wrapper {
        display: flex;
        justify-content: space-between;

        .icon-item {
          cursor: pointer;
          color: ${theme.colors.font1};
          transition: color 0.2s ease;

          &:hover {
            color: ${theme.colors.primary};
          }
        }
        .icon-item {
          margin-right: 1em;
        }
      }
    }

    .user-items {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: ${theme.paddings.small};
    }
  `}
`;

const UserProfile = styled.div`
  ${() => css`
    display: flex;
    align-items: center;
    gap: ${theme.paddings.medium};
    cursor: pointer;
    padding: ${theme.paddings.x_small} ${theme.paddings.small};
    border-radius: ${theme.border_radius.medium};
    transition: all 0.2s ease;

    &:hover {
      background: ${theme.colors.primary}20;
    }

    .user-info {
      display: none;
      text-align: right;

      ${mediaQuery.minTablet} {
        display: block;
      }

      h4 {
        margin: 0;
        font-size: ${theme.font_sizes.small};
        color: ${theme.colors.font1};
        font-weight: ${theme.font_weight.medium};
        line-height: 1.2;
      }

      p {
        margin: 0;
        font-size: ${theme.font_sizes.x_small};
        color: ${theme.colors.font2};
        line-height: 1.2;
      }
    }

    img {
      width: 2.5em;
      height: 2.5em;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid ${theme.colors.primary}40;
      transition: all 0.2s ease;

      &:hover {
        border-color: ${theme.colors.primary};
        transform: scale(1.05);
      }

      ${mediaQuery.minTablet} {
        width: 2.8em;
        height: 2.8em;
      }
    }
  `}
`;

const MenuItemContent = styled.div<{ $danger?: boolean }>`
  ${({ $danger }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.paddings.small};
    padding: ${theme.paddings.small} ${theme.paddings.medium};
    color: ${$danger ? theme.colors.error : theme.colors.font1};
    transition: all 0.2s ease;

    svg {
      font-size: ${theme.font_sizes.small};
      color: ${$danger ? theme.colors.error : theme.colors.primary};
    }

    span {
      font-size: ${theme.font_sizes.small};
      font-weight: ${theme.font_weight.medium};
    }

    &:hover {
      color: ${$danger ? theme.colors.error : theme.colors.primary};
      background: ${$danger ? theme.colors.error : theme.colors.primary}20;
    }
  `}
`;
