import { jsx as _jsx } from "react/jsx-runtime";
import { DatePicker as AntdDatePicker } from 'antd';
import { ComponentContainer } from './component-container';
export const DatePicker = ({ value = undefined, name, required = false, disabled = false, hidden = false, error = false, helperText = '', label, variant = 'filled', allowClear = true, onChange, prefix = null, disabledDate = (current) => false, format = 'DD/MM/YYYY HH:mm', }) => {
    const Container = ComponentContainer[variant];
    return (_jsx(Container, { value: value, required: required, disabled: disabled, hidden: hidden, error: error, label: label, helperText: helperText, children: _jsx(AntdDatePicker, { size: "large", format: format, value: value, disabled: disabled, name: name, placeholder: "", onChange: onChange, allowClear: allowClear, variant: "borderless", prefix: prefix, disabledDate: disabledDate }) }));
};
