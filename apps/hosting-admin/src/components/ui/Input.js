import { jsx as _jsx } from "react/jsx-runtime";
import InputAntd from 'antd/lib/input';
import { ComponentContainer } from './component-container';
export const Input = ({ type = 'text', value, required = false, hidden = false, error, label, variant = 'filled', disabled, animation, helperText, onChange, name, ...props }) => {
    const Container = ComponentContainer[variant];
    return (_jsx(Container, { value: value, required: required, hidden: hidden, error: error, label: label, disabled: disabled, helperText: helperText, animation: animation, children: _jsx(InputAntd, { variant: "borderless", size: "large", placeholder: "", value: value, disabled: disabled, allowClear: !disabled, style: { width: '100%' }, ...props }) }));
};
