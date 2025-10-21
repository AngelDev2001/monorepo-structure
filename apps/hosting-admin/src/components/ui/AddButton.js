import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import { Icon } from './Icon';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from './index';
export const AddButton = ({ title, margin, onClick }) => {
    return (_jsx(Container, { type: "primary", margin: margin, onClick: onClick, children: _jsxs("div", { className: "content-btn-add", children: [_jsx(Icon, { icon: faPlus, fontSize: "1.5rem", margin: "0 .8rem 0 0" }), _jsx("span", { className: "item-text", children: _jsxs("div", { children: ["Agregar ", title] }) })] }) }));
};
const Container = styled(Button) `
  min-width: 120px;
  width: auto;
  height: auto;
  margin: ${({ margin = '0 0 1.5rem 0' }) => margin};
  padding: 0.5rem 1rem;
  text-transform: uppercase;

  .content-btn-add {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    text-align: center;
    .icon-item {
      margin-right: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        margin: 0;
      }
    }
    .item-text {
      white-space: normal;
      font-size: 16px;
      font-weight: 400;
      text-transform: uppercase;
      text-shadow: none;
    }
  }
`;
