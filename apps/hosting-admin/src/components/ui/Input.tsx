import InputAntd from "antd/lib/input";
import type { InputProps as AntInputProps } from "antd";
import { ComponentContainer } from "./component-container";

interface InputtProps extends Omit<AntInputProps, "variant"> {
  required?: boolean;
  hidden?: boolean;
  error?: boolean;
  label?: string;
  variant?: "outlined" | "filled";
  disabled?: boolean;
  animation?: boolean;
  helperText?: string;
}

export const Input = ({
  value,
  required = false,
  hidden = false,
  error,
  label,
  variant = "filled",
  disabled,
  animation,
  helperText,
  ...props
}: InputtProps) => {
  const Container = ComponentContainer[variant];

  return (
    <Container
      value={Boolean(value)}
      required={required}
      hidden={hidden}
      error={error}
      label={label}
      disabled={disabled}
      helperText={helperText}
      animation={animation}
    >
      <InputAntd
        variant="borderless"
        size="large"
        placeholder=""
        value={value}
        disabled={disabled}
        allowClear={!disabled}
        style={{ width: "100%" }}
        {...props}
      />
    </Container>
  );
};
