import { Modal as AntdModal } from "../ui";
import type { ReactNode } from "react";

interface ModalProps {
  closable: boolean;
  onCancel?: () => void;
  centered: boolean;
  footer: null;
  children: ReactNode;
}

export const Modal = ({
  closable = false,
  onCancel,
  centered = true,
  footer = null,
  children,
  ...props
}: ModalProps) => (
  <AntdModal
    closable={closable}
    onCancel={onCancel}
    centered={centered}
    footer={footer}
    {...props}
  >
    {children}
  </AntdModal>
);
