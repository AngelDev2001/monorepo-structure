import type { FormHTMLAttributes, ReactNode } from "react";
import { Space } from "antd";

type FormProps = {
  children: ReactNode;
} & FormHTMLAttributes<HTMLFormElement>;

export const Form = ({ children, ...props }: FormProps) => (
  <form noValidate autoComplete="off" {...props}>
    <Space
      size="middle"
      direction="vertical"
      className="w-[100%] flex flex-col"
    >
      {children}
    </Space>
  </form>
);
