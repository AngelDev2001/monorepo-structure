import React from "react";
import styled, { css } from "styled-components";
import RadioAntd from "antd/lib/radio";
import type { RadioGroupProps as AntdRadioGroupProps } from "antd";
import { ComponentContainer } from "./component-container";
import { theme } from "../../styles";

export interface RadioOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<AntdRadioGroupProps, "options" | "onChange"> {
  name?: string;
  value?: any;
  required?: boolean;
  error?: boolean;
  label?: string;
  helperText?: string;
  options: RadioOption[];
  variant?: "outlined" | "filled";
  disabled?: boolean;
  animation?: boolean;
  onChange?: (value: any) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  required = false,
  error = false,
  label,
  helperText,
  options = [],
  onChange,
  animation = false,
  variant = "filled",
  disabled = false,
  ...props
}) => {
  const Container = ComponentContainer[variant];

  return (
    <Container
      required={required}
      error={error}
      label={label}
      animation={animation}
      helperText={helperText}
    >
      <RadioGroupStyled
        onChange={(e) => onChange?.(e.target.value)}
        options={options}
        disabled={disabled}
        {...props}
      />
    </Container>
  );
};

const RadioGroupStyled = styled(RadioAntd.Group)`
  ${() => css`
    padding: ${theme.paddings.medium};

    .ant-radio-wrapper {
      color: ${theme.colors.font1};
      font-size: ${theme.font_sizes.small};
      margin-right: ${theme.paddings.large};
      transition: all 0.2s ease;

      &:hover {
        .ant-radio-inner {
          border-color: ${theme.colors.primary};
        }
      }

      .ant-radio {
        .ant-radio-inner {
          background-color: ${theme.colors.secondary};
          border-color: ${theme.colors.font2};
          transition: all 0.2s ease;

          &:after {
            background-color: ${theme.colors.primary};
          }
        }

        &.ant-radio-checked {
          .ant-radio-inner {
            background-color: ${theme.colors.primary};
            border-color: ${theme.colors.primary};

            &:after {
              background-color: ${theme.colors.dark};
            }
          }

          &:after {
            border-color: ${theme.colors.primary};
          }
        }

        &:hover .ant-radio-inner {
          border-color: ${theme.colors.primary};
        }
      }

      &.ant-radio-wrapper-disabled {
        opacity: 0.5;
        cursor: not-allowed;

        .ant-radio-inner {
          background-color: ${theme.colors.dark}40;
        }
      }

      span:not(.ant-radio) {
        padding-left: ${theme.paddings.x_small};
      }
    }

    .ant-radio-button-wrapper {
      background-color: ${theme.colors.secondary};
      border-color: ${theme.colors.font2}40;
      color: ${theme.colors.font1};
      transition: all 0.2s ease;

      &:hover {
        color: ${theme.colors.primary};
        border-color: ${theme.colors.primary};
      }

      &.ant-radio-button-wrapper-checked {
        background-color: ${theme.colors.primary};
        border-color: ${theme.colors.primary};
        color: ${theme.colors.dark};

        &:hover {
          background-color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          color: ${theme.colors.dark};
        }

        &:before {
          background-color: ${theme.colors.primary};
        }
      }

      &.ant-radio-button-wrapper-disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: ${theme.colors.dark}40;
      }
    }
  `}
`;
