import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import styled, { css } from 'styled-components';
import { capitalize, startCase } from 'lodash';
import { keyframes } from '../../../styles';
import Typography from 'antd/lib/typography';
import SpaceAntd from 'antd/lib/space';
import { lighten } from 'polished';
const { Text } = Typography;
export const Group = ({ label, required, error, helperText, children }) => (_jsxs(_Fragment, { children: [_jsxs(Container, { error: error, children: [_jsx(Legend, { required: required, error: error, children: label }), _jsx(SpaceStyled, { size: "middle", direction: "vertical", children: children })] }), helperText && _jsx(Error, { error: error, children: capitalize(startCase(helperText)) })] }));
const Container = styled.fieldset `
  border-radius: ${({ theme }) => theme.border_radius.x_small};
  border: solid 1px ${({ error, theme }) => (error ? theme.colors.error : theme.colors.light)};
  padding: 0.5em 1em;
  margin-top: -7px;
  background: ${({ theme }) => lighten(0.07, theme.colors.light)};
`;
const Legend = styled.legend `
  ${({ error, theme, required }) => css `
    background: ${theme.colors.light};
    color: ${error ? theme.colors.error : theme.colors.black};
    border-radius: ${theme.border_radius.x_small};
    font-size: 0.9em;
    font-weight: 600;
    padding: 0.1rem 0.5rem;
    width: auto;
    margin: 0.6em 0;

    ${required &&
    css `
      ::after {
        display: inline-block;
        margin-left: 0.2rem;
        color: ${error ? theme.colors.error : theme.colors.error};
        font-size: ${theme.font_sizes.small};
        line-height: 1;
        content: '*';
      }
    `}
  `}
`;
const SpaceStyled = styled(SpaceAntd) `
  width: 100%;
`;
const Error = styled(Text) `
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.font_sizes.x_small};
  ${({ error }) => error &&
    css `
      animation: ${keyframes.shake} 340ms;
    `};
`;
