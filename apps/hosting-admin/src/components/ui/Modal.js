import { jsx as _jsx } from "react/jsx-runtime";
import { Modal as AntdModal } from '../ui';
export const Modal = ({ closable = false, onCancel, centered = true, footer = null, children, ...props }) => (_jsx(AntdModal, { closable: closable, onCancel: onCancel, centered: centered, footer: footer, ...props, children: children }));
