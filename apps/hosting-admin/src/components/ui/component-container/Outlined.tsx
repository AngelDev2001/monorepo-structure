import styled, { css } from "styled-components";
import { capitalize, isEmpty, startCase, toString } from "lodash";
import { classNames, keyframes, theme } from "../../../styles";
import Typography from "antd/lib/typography";
import { lighten } from "polished";
import type { ReactNode } from "react";

const { Text } = Typography;

export interface BaseContainerProps {
  value?: boolean;
  required?: boolean;
  error?: boolean;
  hidden?: boolean;
  label?: string;
  disabled?: boolean;
  componentId?: string;
  children?: ReactNode;
  animation?: boolean;
  helperText?: string;
}

interface OutlinedProps extends BaseContainerProps {}

export const Outlined = ({
  value,
  required,
  error,
  hidden = false,
  label,
  children,
  componentId,
  helperText,
  disabled = false,
}: OutlinedProps) => (
  <Container
    error={error}
    required={required}
    disabled={disabled}
    hidden={hidden}
  >
    <label htmlFor={componentId} className="item-label">
      {label}
    </label>
    <Wrapper
      value={typeof value === "object" ? !isEmpty(value) : !!toString(value)}
      error={error}
      className={classNames({ "scroll-error-anchor": error })}
      disabled={disabled}
    >
      <div className="item-wrapper">{children}</div>
    </Wrapper>
    {helperText && (
      <Error error={error}>{capitalize(startCase(helperText))}</Error>
    )}
  </Container>
);

const Container = styled.div<
  Pick<OutlinedProps, "error" | "required" | "disabled" | "hidden">
>`
  ${({ error, required, disabled, hidden }) => css`
    width: 100%;

    .item-label,
    .item-label:after {
      color: ${error
        ? theme.colors.error
        : disabled
          ? theme.colors.gray
          : theme.colors.font1};
    }

    .item-label {
      margin-bottom: 0.5em;
      z-index: 100;
      pointer-events: none;
      display: flex;
      align-items: center;
      background-color: transparent;
      color: ${error ? theme.colors.error : theme.colors.font1};
      font-size: ${theme.font_sizes.small};
      font-weight: ${theme.font_weight.medium};
      transition:
        all ease-in-out 150ms,
        opacity 150ms;

      ${hidden &&
      css`
        display: none;
      `};

      ${required &&
      css`
        &:after {
          display: inline-block;
          margin-left: 0.2rem;
          color: ${error ? theme.colors.error : theme.colors.primary};
          font-size: ${theme.font_sizes.small};
          line-height: 1;
          content: "*";
        }
      `};
    }
  `};
`;

const Wrapper = styled.div<Pick<OutlinedProps, "error" | "disabled" | "value">>`
  ${({ error, disabled, value }) => css`
    position: relative;
    width: inherit;
    border-radius: ${theme.border_radius.xx_small};
    background: ${disabled
      ? lighten(0.02, theme.colors.secondary)
      : theme.colors.secondary};
    border: 1px solid
      ${error ? theme.colors.error : lighten(0.1, theme.colors.secondary)};
    animation: ${error && keyframes.shake} 340ms
      cubic-bezier(0.36, 0.07, 0.19, 0.97) both;

    &:hover,
    &:focus-within {
      border-color: ${error
        ? theme.colors.error
        : disabled
          ? lighten(0.1, theme.colors.secondary)
          : theme.colors.primary};
    }

    .item-wrapper {
      input:-webkit-autofill {
        -webkit-text-fill-color: ${value
          ? theme.colors.font1
          : theme.colors.font1};
        -webkit-box-shadow: 0 0 0 1000px ${theme.colors.secondary} inset;

        &:focus {
          -webkit-text-fill-color: ${theme.colors.font1};
        }
      }

      //Styles default
      .ant-input-number,
      .ant-picker,
      .ant-select {
        width: 100%;
        box-shadow: none;
        outline: none;
      }

      .ant-input-affix-wrapper,
      .ant-input {
        box-shadow: none;
      }

      .ant-input-group-addon {
        border: 0 solid ${lighten(0.1, theme.colors.secondary)};
        border-left: 1px solid ${lighten(0.1, theme.colors.secondary)};
        background: ${lighten(0.05, theme.colors.secondary)};
        color: ${theme.colors.font2};
      }
    }
  `}
`;

const Error = styled(Text)<Pick<OutlinedProps, "error">>`
  color: ${() => theme.colors.error};
  font-size: ${() => theme.font_sizes.x_small};
  ${({ error }) =>
    error &&
    css`
      animation: ${keyframes.shake} 340ms;
    `};
`;
