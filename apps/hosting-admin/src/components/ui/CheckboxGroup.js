import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import CheckboxAntd from 'antd/lib/checkbox';
import { ComponentContainer } from './component-container';
export const CheckboxGroup = ({ required, error, label, variant = 'filled', ...props }) => {
    const Container = ComponentContainer[variant];
    return (_jsx(Container, { required: required, error: error, label: label, animation: false, children: _jsx(CheckboxGroupStyled, { ...props }) }));
};
const CheckboxGroupStyled = styled(CheckboxAntd.Group) `
  padding: 10px;
`;
