import styled, { css } from "styled-components";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import type { CSSProperties } from "react";
import { theme } from "../../styles";

interface IconProps extends Omit<FontAwesomeIconProps, "border"> {
  label?: string;
  margin?: CSSProperties["margin"];
  borderRadius?: CSSProperties["borderRadius"];
  border?: CSSProperties["border"];
  direction?: "column" | "row";
}

type StyledIconProps = {
  borderradiusicon?: CSSProperties["borderRadius"];
  bordericon?: CSSProperties["border"];
};

export const Icon = ({
  label,
  icon,
  onClick,
  color,
  fontSize,
  cursor = "pointer",
  margin,
  border,
  borderRadius,
  direction = "column",
}: IconProps) => {
  return (
    <Container margin={margin} direction={direction}>
      <StyledIcon
        color={color}
        onClick={onClick}
        icon={icon}
        fontSize={fontSize}
        cursor={cursor}
        bordericon={border}
        borderradiusicon={borderRadius}
      />
      {label && <Text>{label}</Text>}
    </Container>
  );
};

const Container = styled.div<Pick<IconProps, "margin" | "direction">>`
  margin: ${({ margin = "0 5px" }) => margin};
  ${({ direction }) =>
    direction === "column"
      ? css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `
      : css`
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        `}
`;

const StyledIcon = styled(FontAwesomeIcon)<StyledIconProps>`
  color: ${({ color }) => color || theme.colors.font2};
  font-size: ${({ fontSize = "1.5rem" }) => fontSize};
  cursor: ${({ cursor }) => cursor};
  border: ${({ bordericon = "none" }) => bordericon};
  border-radius: ${({ borderradiusicon = "none" }) => borderradiusicon};
  transition: color 0.2s ease;

  &:hover {
    color: ${() => theme.colors.primary};
  }
`;

const Text = styled.div`
  font-size: 12px;
  color: ${() => theme.colors.font2};
  line-height: 1;
  margin: 5px;
`;
