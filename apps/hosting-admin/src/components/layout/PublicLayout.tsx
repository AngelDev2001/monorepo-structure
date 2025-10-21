import { type ReactNode } from "react";
import styled from "styled-components";
import { Layout } from "../ui";
import { theme } from "../../styles";

type PublicLayoutProps = {
  children: ReactNode;
};

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <LayoutContainer>
      <div className="site-layout-background">
        <div className="content-wrapper">{children}</div>
      </div>
    </LayoutContainer>
  );
};

const LayoutContainer = styled(Layout)`
  min-width: 100vw;
  min-height: 100vh;

  .site-layout-background {
    min-height: 100svh;
    background: linear-gradient(
      135deg,
      ${theme.colors.dark} 0%,
      ${theme.colors.black} 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.paddings.large};
    position: relative;

    /* Efecto de puntos decorativos */
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(
        rgba(255, 184, 77, 0.1) 1px,
        transparent 1px
      );
      background-size: 50px 50px;
      opacity: 0.3;
    }
  }

  .content-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 450px;
    background: ${theme.colors.secondary};
    padding: ${theme.paddings.xx_large};
    border-radius: ${theme.border_radius.medium};
    box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);

    @media (max-width: 768px) {
      padding: ${theme.paddings.x_large};
      max-width: 100%;
    }
  }
`;
