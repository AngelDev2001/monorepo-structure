import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export const Icon = ({ label, icon, onClick, color, fontSize, cursor = 'pointer', margin, border, borderRadius, direction = 'column', }) => {
    return (_jsxs(Container, { margin: margin, direction: direction, children: [_jsx(StyledIcon, { color: color, onClick: onClick, icon: icon, fontSize: fontSize, cursor: cursor, bordericon: border, borderradiusicon: borderRadius }), label && _jsx(Text, { children: label })] }));
};
const Container = styled.div `
  margin: ${({ margin = '0 5px' }) => margin};
  ${({ direction }) => direction === 'column'
    ? css `
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `
    : css `
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        `}
`;
const StyledIcon = styled(FontAwesomeIcon) `
  color: ${({ color }) => color};
  font-size: ${({ fontSize = '1.5rem' }) => fontSize};
  cursor: ${({ cursor }) => cursor};
  border: ${({ bordericon = 'none' }) => bordericon};
  border-radius: ${({ borderradiusicon = 'none' }) => borderradiusicon};
`;
const Text = styled.div `
  font-size: 12px;
  color: rgb(166, 168, 180);
  line-height: 1;
  margin: 5px;
`;
