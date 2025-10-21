import styled from "styled-components";
import CheckboxAntd from "antd/lib/checkbox";
import { ComponentContainer } from "./component-container";

interface CheckboxGroup {
  required?: boolean;
  error?: boolean;
  label?: string;
  variant?: "outlined" | "filled";
}

export const CheckboxGroup = ({
  required,
  error,
  label,
  variant = "filled",
  ...props
}: CheckboxGroup) => {
  const Container = ComponentContainer[variant];

  return (
    <Container
      required={required}
      error={error}
      label={label}
      animation={false}
    >
      <CheckboxGroupStyled {...props} />
    </Container>
  );
};

const CheckboxGroupStyled = styled(CheckboxAntd.Group)`
  padding: 10px;
`;
