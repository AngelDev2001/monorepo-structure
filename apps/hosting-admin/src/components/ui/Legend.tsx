import { type ReactNode } from "react";
import styled, { css } from "styled-components";
import { lighten } from "polished";
import { theme } from "../../styles";

interface LegendProps {
  title: string;
  children?: ReactNode;
}

export const Legend = ({ title, children }: LegendProps) => {
  return (
    <Container>
      <Content>
        <label className="legend-title">{title}</label>
        <div className="legend-content">{children}</div>
      </Content>
    </Container>
  );
};

const Container = styled.section`
  padding-top: 7px;
`;

const Content = styled.div`
  ${() => css`
    border-radius: ${theme.border_radius.xx_small};
    border: 1px solid ${lighten(0.1, theme.colors.secondary)};
    padding: ${theme.paddings.xxx_large} ${theme.paddings.medium}
      ${theme.paddings.medium} ${theme.paddings.medium};
    background: ${lighten(0.02, theme.colors.secondary)};
    position: relative;

    .legend-title {
      position: absolute;
      top: -16px;
      z-index: 100;
      pointer-events: none;
      display: flex;
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.font1};
      font-weight: ${theme.font_weight.large};
      font-size: ${theme.font_sizes.large};
      padding: 0 ${theme.border_radius.xx_small};
    }

    .legend-content {
      color: ${theme.colors.font2};
    }
  `}
`;
