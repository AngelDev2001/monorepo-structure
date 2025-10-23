import OTPInput from "react-otp-input";
import styled, { css } from "styled-components";
import { keyframes, mediaQuery, theme } from "../../styles";
import { lighten } from "polished";

interface InputCodeProps {
  value: string;
  required?: boolean;
  hidden?: boolean;
  error?: boolean;
  label?: string;
  type?: "number" | "text" | "password" | "tel";
  numInputs?: number;
  disabled?: boolean;
  animation?: boolean;
  helperText?: string;
  onChange: (value: string) => void;
}

export const InputCode = ({
  value,
  required = false,
  hidden = false,
  error,
  label,
  type = "number",
  numInputs = 6,
  disabled,
  animation,
  helperText,
  onChange,
  ...props
}: InputCodeProps) => {
  return (
    <Container error={error}>
      {label && (
        <div className="label">
          <label>{label}</label>
        </div>
      )}
      <OTPInput
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
        inputStyle="input-style"
        inputType={type}
        disabled={disabled}
        {...props}
      />
      {error && helperText && (
        <div className="warning-message">{helperText}</div>
      )}
    </Container>
  );
};

const Container = styled.div<Pick<InputCodeProps, "error">>`
  ${({ error }) => css`
    .label {
      margin-bottom: 1rem;
      color: ${theme.colors.font1};
      font-weight: ${theme.font_weight.medium};
      font-size: ${theme.font_sizes.small};
    }

    div {
      justify-content: center;
      ${error &&
      css`
        animation: ${keyframes.shake} 340ms;
      `};
    }

    .input-style {
      width: 2.7rem !important;
      height: 2.7rem;
      margin: 0 0.3rem;
      font-size: 1.5rem;
      border-radius: 4px;
      background: ${theme.colors.secondary};
      color: ${theme.colors.font1};
      border: 1px solid
        ${error ? theme.colors.error : lighten(0.1, theme.colors.secondary)};
      text-align: center;
      font-weight: ${theme.font_weight.large};
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: ${error ? theme.colors.error : theme.colors.primary};
        box-shadow: 0 0 0 2px
          ${error ? theme.colors.error : theme.colors.primary}20;
      }

      &[type="number"]::-webkit-inner-spin-button,
      &[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      ${mediaQuery.minMobile} {
        width: 3rem !important;
        height: 3rem;
        margin: 0 1rem;
        font-size: 2rem;
      }
    }

    .warning-message {
      text-align: center;
      font-size: 0.85em;
      margin-top: 1em;
      color: ${theme.colors.error};
    }
  `}
`;
