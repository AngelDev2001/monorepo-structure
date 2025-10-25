import React, { createContext, type ReactNode, useContext } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firestore, version } from "../firebase";
import { Button, Result, Spinner } from "../components";
import styled, { css } from "styled-components";
import { theme } from "../styles";

interface SettingDefault {
  version: string;
  [key: string]: any;
}

interface VersionContextValue {
  version: string;
}

interface VersionProviderProps {
  children: ReactNode;
}

const VersionContext = createContext<VersionContextValue>({
  version: "",
});

export const VersionProvider: React.FC<VersionProviderProps> = ({
  children,
}) => {
  const [settingDefault, settingDefaultLoading, settingDefaultError] =
    useDocumentData<SettingDefault>(
      firestore.collection("settings").doc("default")
    );

  const onClickRefresh = (): void => {
    document.location.reload();
  };

  if (settingDefaultLoading) {
    return <Spinner height="80vh" />;
  }

  if (settingDefaultError) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Perdón, algo salió mal."
        extra={
          <Button onClick={onClickRefresh} type="primary">
            Actualizar
          </Button>
        }
      />
    );
  }

  const isLastVersion = version === settingDefault?.version;

  return (
    <VersionContext.Provider
      value={{
        version,
      }}
    >
      {isLastVersion ? children : <Version />}
    </VersionContext.Provider>
  );
};

export const useVersion = (): VersionContextValue => {
  const context = useContext(VersionContext);

  if (!context) {
    throw new Error("useVersion must be used within a VersionProvider");
  }

  return context;
};

export const Version: React.FC = () => (
  <VersionContainer>
    <ContentWrapper>
      <IconWrapper>
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </IconWrapper>

      <Title>Nueva versión disponible</Title>

      <Description>
        Actualice para obtener la última versión de la aplicación con nuevas
        funciones y mejoras de seguridad.
      </Description>

      <Button
        type="primary"
        size="large"
        onClick={() => document.location.reload()}
      >
        Actualizar ahora
      </Button>

      <VersionInfo>
        Versión actual: <span>{version}</span>
      </VersionInfo>
    </ContentWrapper>
  </VersionContainer>
);

export const VersionContainer = styled.section`
  ${() => css`
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: ${theme.colors.dark};
    padding: ${theme.paddings.large};
  `}
`;

const ContentWrapper = styled.div`
  ${() => css`
    max-width: 600px;
    width: 100%;
    padding: ${theme.paddings.xxx_large};
    background: ${theme.colors.secondary};
    border-radius: ${theme.border_radius.large};
    border: 2px solid ${theme.colors.primary}40;
    box-shadow: 0 10px 40px ${theme.colors.primary}20;
    animation: fadeInUp 0.6s ease-out;

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}
`;

const IconWrapper = styled.div`
  ${() => css`
    width: 80px;
    height: 80px;
    margin: 0 auto ${theme.paddings.large};
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.primary}20;
    border-radius: 50%;
    color: ${theme.colors.primary};
    animation: pulse 2s ease-in-out infinite;

    @keyframes pulse {
      0%,
      100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.8;
      }
    }

    svg {
      width: 40px;
      height: 40px;
    }
  `}
`;

const Title = styled.h1`
  ${() => css`
    font-size: ${theme.font_sizes.xxx_large};
    font-weight: ${theme.font_weight.large};
    color: ${theme.colors.primary};
    margin-bottom: ${theme.paddings.medium};
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: ${theme.font_sizes.xx_large};
    }
  `}
`;

const Description = styled.p`
  ${() => css`
    font-size: ${theme.font_sizes.medium};
    color: ${theme.colors.font2};
    margin-bottom: ${theme.paddings.x_large};
    line-height: 1.6;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;

    @media (max-width: 768px) {
      font-size: ${theme.font_sizes.small};
    }
  `}
`;

const VersionInfo = styled.div`
  ${() => css`
    margin-top: ${theme.paddings.large};
    font-size: ${theme.font_sizes.small};
    color: ${theme.colors.font2};

    span {
      color: ${theme.colors.primary};
      font-weight: ${theme.font_weight.medium};
      font-family: monospace;
      background: ${theme.colors.primary}10;
      padding: ${theme.paddings.xx_small} ${theme.paddings.x_small};
      border-radius: ${theme.border_radius.xx_small};
      margin-left: ${theme.paddings.xx_small};
    }
  `}
`;
