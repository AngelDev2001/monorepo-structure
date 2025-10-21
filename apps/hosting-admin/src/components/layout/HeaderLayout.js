import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout } from '../ui';
import styled from 'styled-components';
import { Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { mediaQuery } from '../../styles';
const { Header } = Layout;
export const HeaderLayout = ({ isVisibleDrawer, onSetIsVisibleDrawer }) => {
    return (_jsxs(HeaderContainer, { children: [_jsx("div", { className: "right-item", children: _jsx(Space, { align: "center", className: "items-wrapper", children: _jsx("div", { style: { fontSize: '1.7em', display: 'flex', alignItems: 'center' }, onClick: () => onSetIsVisibleDrawer(!isVisibleDrawer), children: _jsx(FontAwesomeIcon, { icon: faBars, className: "icon-item" }) }) }) }), _jsx("div", { children: _jsx("p", { children: "Pepito" }) })] }));
};
const HeaderContainer = styled(Header) `
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
