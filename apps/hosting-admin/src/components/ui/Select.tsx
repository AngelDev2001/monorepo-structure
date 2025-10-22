import AntSelect from "antd/lib/select";
import { ComponentContainer } from "./component-container";
import { lighten } from "polished";
import styled, { css } from "styled-components";
import { theme } from "../../styles";

type Option = { code?: string; label?: string; value?: string };

interface SelectProps {
  value?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  animation?: boolean;
  isMobile?: boolean;
  label?: string;
  variant?: "outlined" | "filled";
  allowClear?: boolean;
  filterOption?: (inputValue: string, optionLabel: string) => boolean;
  options?: Option[] | undefined;
  placeholder?: string;
  helperText?: string;
  onChange?: (value?: string) => void;
}

const defaultFilterOption = (inputValue: string, optionLabel: string) => {
  const labelParts = optionLabel.toLowerCase().split(" - ");
  return labelParts.some((part) => part.includes(inputValue.toLowerCase()));
};

export const Select = ({
  value = undefined,
  required = false,
  error = false,
  disabled = false,
  animation = true,
  isMobile = false,
  label,
  variant = "filled",
  allowClear,
  filterOption = (inputValue, optionLabel) =>
    defaultFilterOption(inputValue, optionLabel),
  options = [],
  placeholder = "",
  helperText,
  onChange = (value) => value,
  ...props
}: SelectProps) => {
  const Container = ComponentContainer[variant];

  return (
    <Container
      required={required}
      value={value}
      error={error}
      helperText={helperText}
      disabled={disabled}
      label={label}
      animation={animation}
    >
      {isMobile ? (
        <StyledSelectMobile
          key={value}
          disabled={disabled}
          error={error}
          onChange={(event) => onChange && onChange(event.target.value)}
          value={value}
          defaultValue={value}
          placeholder={placeholder}
        >
          {placeholder && <option hidden>{placeholder}</option>}
          {!value && <option hidden />}
          {options.map((option) => (
            <option key={option.code} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelectMobile>
      ) : (
        <AntSelect
          allowClear={disabled ? false : allowClear}
          variant="borderless"
          disabled={disabled}
          value={value}
          defaultValue={value}
          onChange={onChange}
          filterOption={(inputValue, option) =>
            filterOption(inputValue, option?.label ?? "")
          }
          showSearch
          size="large"
          placeholder=""
          options={options}
          {...props}
        />
      )}
    </Container>
  );
};

const StyledSelectMobile = styled.select<
  Pick<SelectProps, "error" | "placeholder" | "value">
>`
  ${({ error, value, placeholder }) => css`
    width: 100%;
    height: 32px;
    border: none;
    margin: 0 11px 4px 11px;
    font-size: 1rem;
    background-color: ${error
      ? lighten(0.4, theme.colors.error)
      : theme.colors.secondary};
    cursor: pointer;
    border-radius: ${theme.border_radius.xx_small};
    color: ${placeholder
      ? !value
        ? theme.colors.font2
        : theme.colors.font1
      : theme.colors.font1};
    font-weight: ${theme.font_weight.medium};

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23FFC107'><polygon points='0,0 100,0 50,50'/></svg>");
    background-repeat: no-repeat;
    background-size: 10px;
    background-position: right center;

    option {
      background: ${theme.colors.secondary};
      color: ${theme.colors.font1};
    }

    &:focus-within {
      background: ${lighten(0.05, theme.colors.secondary)};
      outline: none;
      border: 1px solid ${theme.colors.primary};
    }
  `}
`;
