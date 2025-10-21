import { jsx as _jsx } from "react/jsx-runtime";
import InputAntd from 'antd/lib/input';
import { ComponentContainer } from './component-container';
export const TextArea = ({ value, required, disabled, error, label, placeholder, variant = 'filled', helperText, ...props }) => {
    const Container = ComponentContainer[variant];
    return (_jsx(Container, { value: value, required: required, disabled: disabled, error: error, label: label, animation: false, helperText: helperText, children: _jsx(InputAntd.TextArea, { bordered: false, value: value, disabled: disabled, placeholder: placeholder, ...props }) }));
};
