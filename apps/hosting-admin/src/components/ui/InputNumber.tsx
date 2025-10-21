import { InputNumber as InputNumberAntd, type InputNumberProps } from "antd";
import { ComponentContainer } from "./component-container";
import { toNumber } from "lodash";

interface Props extends InputNumberProps {
  value?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  variant?: "filled" | "outlined";
  helperText?: string;
  animation?: boolean;
}

export const InputNumber = ({
  value,
  required,
  disabled,
  error,
  label,
  variant = "filled",
  helperText,
  animation,
  onChange,
  ...props
}: Props) => {
  const Container = ComponentContainer[variant];

  const onInputChange = (value) => onChange(value ? toNumber(value) : null);

  return (
    <Container
      value={value}
      required={required}
      error={error}
      label={label}
      helperText={helperText}
      animation={animation}
    >
      <InputNumberAntd
        type="number"
        variant="borderless"
        placeholder=""
        size="large"
        value={value}
        defaultValue={value}
        disabled={disabled}
        onChange={(value) => onInputChange(value)}
        {...props}
      />
    </Container>
  );
};
