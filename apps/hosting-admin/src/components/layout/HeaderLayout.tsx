import { Layout } from "../ui";
import styled from "styled-components";
import { Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { mediaQuery } from "../../styles";

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
      <div className="right-item">
        <Space align="center" className="items-wrapper">
          <div
            style={{ fontSize: "1.7em", display: "flex", alignItems: "center" }}
            onClick={() => onSetIsVisibleDrawer(!isVisibleDrawer)}
          >
            <FontAwesomeIcon icon={faBars} className="icon-item" />
          </div>
        </Space>
      </div>
      <div>
        <p>Pepito</p>
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled(Header)`
  background: #fff !important;
  position: sticky;
  top: 1px;
  z-index: 1000;
  display: grid;
  grid-template-columns: auto 1fr;
  box-shadow: 0 1px 4px rgba(105, 105, 105, 0.24);
  overflow: hidden;
  padding: 0 16px;

  .right-item {
    display: flex;
    align-items: center;

    .items-wrapper {
      .logo-img,
      .icon-item {
        cursor: pointer;
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

    h4 {
      margin: 0;
      font-size: 0.8em;

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

      ${mediaQuery.minTablet} {
        width: 2.5em;
        height: 2.5em;
      }
    }
  }
`;
