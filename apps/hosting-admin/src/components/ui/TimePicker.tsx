import TimePickerAntd from "antd/lib/time-picker";
import { ComponentContainer } from "./component-container";
import type { Dayjs } from "dayjs";

interface TimePickerProps {
  value?: Dayjs | undefined;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  label?: string;
  variant?: "outlined" | "filled";
  helperText?: string;
  animation?: boolean;
}

export const TimePicker = ({
  value,
  disabled,
  required,
  error,
  label,
  variant = "filled",
  helperText,
  animation,
  ...props
}: TimePickerProps) => {
  const Container = ComponentContainer[variant];

  return (
    <Container
      value={value}
      required={required}
      disabled={disabled}
      error={error}
      label={label}
      animation={animation}
      helperText={helperText}
    >
      <TimePickerAntd
        disabled={disabled}
        bordered={false}
        size="large"
        placeholder=""
        value={value}
        {...props}
      />
    </Container>
  );
};
