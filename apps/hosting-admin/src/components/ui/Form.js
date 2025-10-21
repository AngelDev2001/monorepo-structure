import { jsx as _jsx } from "react/jsx-runtime";
import { Space } from 'antd';
export const Form = ({ children, ...props }) => (_jsx("form", { noValidate: true, autoComplete: "off", ...props, children: _jsx(Space, { size: "middle", direction: "vertical", className: "w-[100%] flex flex-col", children: children }) }));
