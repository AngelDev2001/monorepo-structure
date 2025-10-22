import styled, { css } from "styled-components";
import { capitalize, startCase } from "lodash";
import { keyframes, theme } from "../../../styles";
import Typography from "antd/lib/typography";
import SpaceAntd from "antd/lib/space";
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

interface GroupProps extends BaseContainerProps {}

export const Group = ({
  label,
  required,
  error,
  helperText,
  children,
}: GroupProps) => (
  <>
    <Container error={error}>
      <Legend required={required} error={error}>
        {label}
      </Legend>
      <SpaceStyled size="middle" direction="vertical">
        {children}
      </SpaceStyled>
    </Container>
    {helperText && (
      <Error error={error}>{capitalize(startCase(helperText))}</Error>
    )}
  </>
);

const Container = styled.fieldset<Pick<GroupProps, "error">>`
  border-radius: ${() => theme.border_radius.x_small};
  border: solid 1px
    ${({ error }) =>
      error ? theme.colors.error : lighten(0.1, theme.colors.secondary)};
  padding: 0.5em 1em;
  margin-top: -7px;
  background: ${() => lighten(0.02, theme.colors.secondary)};
`;

const Legend = styled.legend<Pick<GroupProps, "required" | "error">>`
  ${({ error, required }) => css`
    background: ${theme.colors.secondary};
    color: ${error ? theme.colors.error : theme.colors.font1};
    border-radius: ${theme.border_radius.x_small};
    font-size: 0.9em;
    font-weight: 600;
    padding: 0.1rem 0.5rem;
    width: auto;
    margin: 0.6em 0;

    ${required &&
    css`
      ::after {
        display: inline-block;
        margin-left: 0.2rem;
        color: ${error ? theme.colors.error : theme.colors.primary};
        font-size: ${theme.font_sizes.small};
        line-height: 1;
        content: "*";
      }
    `}
  `}
`;

const SpaceStyled = styled(SpaceAntd)`
  width: 100%;
`;

const Error = styled(Text)<Pick<GroupProps, "error">>`
  color: ${() => theme.colors.error};
  font-size: ${() => theme.font_sizes.x_small};
  ${({ error }) =>
    error &&
    css`
      animation: ${keyframes.shake} 340ms;
    `};
`;
