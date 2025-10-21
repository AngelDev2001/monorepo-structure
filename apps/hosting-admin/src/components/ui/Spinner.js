import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
export const Spinner = ({ height, fullscreen = true, size = '6x', message = null, }) => (_jsx(Container, { fullscreen: fullscreen, height: height, children: _jsxs("div", { className: "item", children: [_jsx("div", { children: _jsx(IconStyled, { spin: true, icon: faCircleNotch, size: size }) }), message && (_jsx("div", { className: "message-item", children: _jsx("h3", { children: message }) }))] }) }));
const Container = styled.section `
  ${({ fullscreen, height }) => css `
    width: 100%;
    height: ${height || (fullscreen ? '100%' : ' calc(100% - 90px)')};
    opacity: 90%;
    display: grid;
    place-items: center;
    .item {
      width: auto;
      height: auto;
      padding: 1em;
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1em;
    }
  `}
`;
const IconStyled = styled(FontAwesomeIcon) `
  ${({ theme }) => css `
    color: ${theme.colors.primary};
  `}
`;
