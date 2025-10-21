import { DatePicker as AntdDatePicker } from "antd";
import { ComponentContainer } from "./component-container";
import { type Dayjs } from "dayjs";

interface DatePickerProps {
  value?: Dayjs | string | undefined;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  error?: boolean;
  helperText?: string;
  // dataTestId?: string;
  label?: string;
  variant?: "outlined" | "filled";
  allowClear?: boolean;
  onChange?: (value?: Dayjs | string) => void;
  prefix?: string | null;
  disabledDate?: (current: Dayjs) => boolean;
  format?: "DD/MM/YYYY HH:mm";
}

export const DatePicker = ({
  value = undefined,
  name,
  required = false,
  disabled = false,
  hidden = false,
  error = false,
  helperText = "",
  label,
  variant = "filled",
  allowClear = true,
  onChange,
  prefix = null,
  disabledDate = (current: Dayjs) => false,
  format = "DD/MM/YYYY HH:mm",
}: DatePickerProps) => {
  const Container = ComponentContainer[variant];

  return (
    <Container
      value={value}
      required={required}
      disabled={disabled}
      hidden={hidden}
      error={error}
      label={label}
      helperText={helperText}
    >
      <AntdDatePicker
        size="large"
        format={format}
        value={value}
        disabled={disabled}
        name={name}
        placeholder=""
        onChange={onChange}
        allowClear={allowClear}
        variant="borderless"
        prefix={prefix}
        disabledDate={disabledDate}
      />
    </Container>
  );
};
