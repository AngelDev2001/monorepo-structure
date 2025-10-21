import { Layout } from "../ui";
import styled from "styled-components";
import { Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { mediaQuery, theme } from "../../styles";

const { Header } = Layout;

type HeaderLayoutProps = {
  isVisibleDrawer: boolean;
  onSetIsVisibleDrawer: (isVisibleDrawer: boolean) => void;
};

export const HeaderLayout = ({
  isVisibleDrawer,
  onSetIsVisibleDrawer,
}: HeaderLayoutProps) => {
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
    </HeaderContainer>
  );
};

const HeaderContainer = styled(Header)`
  background: ${theme.colors.secondary} !important;
  position: sticky;
  top: 1px;
  z-index: 1000;
  display: grid;
  grid-template-columns: auto 1fr;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  padding: 0 16px;

  .left-item {
    display: flex;
    align-items: center;

    .items-wrapper {
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
    justify-content: end;
    gap: 0.8em;

    p,
    h4 {
      margin: 0;
      font-size: 0.8em;
      color: ${theme.colors.font1};

      ${mediaQuery.minTablet} {
        font-size: 1em;
      }
    }

    img {
      width: 2em;
      height: 2em;
      border-radius: 50%;
      margin: auto;
      object-fit: cover;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.2s ease;

      &:hover {
        border-color: ${theme.colors.primary};
      }

      ${mediaQuery.minTablet} {
        width: 2.5em;
        height: 2.5em;
      }
    }
  }
`;
