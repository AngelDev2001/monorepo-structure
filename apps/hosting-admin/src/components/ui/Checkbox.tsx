import CheckboxAntd from "antd/lib/checkbox";
import styled, { css } from "styled-components";
import { classNames, keyframes, theme } from "../../styles";
import type { ReactNode } from "react";

interface CheckboxProps {
  name?: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  error?: boolean;
  required?: boolean;
  hidden?: boolean;
  children?: ReactNode;
  dataTestId?: string;
}

export const Checkbox = ({
  name,
  checked,
  onChange,
  error = false,
  required = false,
  hidden = false,
  children,
  dataTestId,
}: CheckboxProps) => (
  <CheckBoxAntdStyled
    name={name}
    className={classNames({ "scroll-error-anchor": error })}
    checked={checked}
    onChange={(e) => onChange && onChange(e.target.checked)}
    error={error}
    hidden={hidden}
    required={required}
    data-testid={dataTestId}
  >
    {children && <span className="checkbox-content">{children}</span>}
  </CheckBoxAntdStyled>
);

const CheckBoxAntdStyled = styled(CheckboxAntd)<
  Pick<CheckboxProps, "error" | "hidden">
>`
  ${({ error, hidden, required }) => css`
    font-size: ${theme.font_sizes.small};
    display: ${hidden && "none"};
    color: ${error ? theme.colors.error : theme.colors.font2};
    animation: ${error && keyframes.shake} 340ms
      cubic-bezier(0.36, 0.07, 0.19, 0.97) both;

    .ant-checkbox {
      .ant-checkbox-inner {
        background: ${theme.colors.secondary};
        border-color: ${theme.colors.gray};
      }
    }

    .ant-checkbox-checked {
      .ant-checkbox-inner {
        background-color: ${theme.colors.primary};
        border-color: ${theme.colors.primary};

        &::after {
          border-color: ${theme.colors.black};
        }
      }

      &::after {
        border-color: ${theme.colors.primary};
      }
    }

    .ant-checkbox:hover .ant-checkbox-inner {
      border-color: ${theme.colors.primary};
    }

    ${error &&
    css`
      color: ${theme.colors.error};

      .ant-checkbox {
        .ant-checkbox-inner {
          border-color: ${theme.colors.error};
        }
      }

      .ant-checkbox-checked {
        .ant-checkbox-inner {
          border-color: ${theme.colors.error};
          background-color: ${theme.colors.error};
        }

        ::after {
          border-color: ${theme.colors.error};
        }
      }
    `}

    ${required &&
    css`
      .checkbox-content {
        ::before {
          display: inline-block;
          margin-right: 0.2rem;
          color: ${error ? theme.colors.error : theme.colors.primary};
          font-size: ${theme.font_sizes.small};
          line-height: 1;
          content: "*";
        }
      }
    `}
  `}
`;
