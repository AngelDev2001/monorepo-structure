import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { theme } from "../../styles";
import { useAuthentication } from "../../providers";
import { Link, useNavigate } from "react-router-dom";
import { VerificationCode } from "./VerificationCode.tsx";
import { AccessDataLogin } from "./AccessDataLogin.tsx";
import { VerificationMethod } from "./VerificationMethod.tsx";

export function Login() {
  const navigate = useNavigate();
  const { verifyCode, loginLoading } = useAuthentication();

  const [currentStep, setCurrentStep] = useState(0);
  const onNext = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleVerifyCode = async (code: string) => {
    await verifyCode(code);
    navigate("/home");
  };

  return (
    <LoginContainer>
      <LeftSide>
        <ImageOverlay />
        <ContentOverlay>
          <BrandSection>
            <LogoCircle>
              <FontAwesomeIcon icon={faShieldHalved} />
            </LogoCircle>
            <BrandTitle>SERVITEC</BrandTitle>
            <BrandSubtitle>Sistema de Gestión Empresarial</BrandSubtitle>
          </BrandSection>

          <HeroSection>
            <HeroTitle>Gestión inteligente para tu negocio</HeroTitle>
            <HeroDescription>
              Administra cotizaciones, asistencias y operaciones desde una sola
              plataforma segura y moderna diseñada para el éxito de tu empresa
            </HeroDescription>

            <FeatureList>
              <FeatureItem>
                <FeatureDot />
                <span>Control total de cotizaciones</span>
              </FeatureItem>
              <FeatureItem>
                <FeatureDot />
                <span>Gestión de asistencias en tiempo real</span>
              </FeatureItem>
              <FeatureItem>
                <FeatureDot />
                <span>Reportes y análisis avanzados</span>
              </FeatureItem>
            </FeatureList>
          </HeroSection>

          <ProgressSection>
            <ProgressBar>
              <ProgressFill step={currentStep} />
            </ProgressBar>
            <ProgressLabel>
              {currentStep === 0 && "Paso 1 de 3: Verificación de identidad"}
              {currentStep === 1 && "Paso 2 de 3: Método de verificación"}
              {currentStep === 2 && "Paso 3 de 3: Código de seguridad"}
            </ProgressLabel>
          </ProgressSection>
        </ContentOverlay>
      </LeftSide>

      <RightSide>
        <FormContainer>
          <WelcomeHeader>
            <WelcomeTitle>¡Bienvenido de vuelta!</WelcomeTitle>
            <WelcomeSubtitle>
              Ingresa de forma segura con tu DNI
            </WelcomeSubtitle>
          </WelcomeHeader>

          <StepsContent>
            {currentStep === 0 && (
              <AccessDataLogin onNext={onNext} loading={loginLoading} />
            )}
            {currentStep === 1 && (
              <VerificationMethod onNext={onNext} onBack={prevStep} />
            )}
            {currentStep === 2 && (
              <VerificationCode onBack={prevStep} onFinish={handleVerifyCode} />
            )}
          </StepsContent>

          <LoginLink>
            ¿Aún no tienes cuenta? <Link to="/register">Registrarme</Link>
          </LoginLink>
        </FormContainer>
      </RightSide>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background: ${theme.colors.black};

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const LeftSide = styled.div`
  position: relative;
  background-image: url("https://i.pinimg.com/1200x/81/aa/f7/81aaf7f04d128265a3662a90efb20524.jpg");
  background-size: cover;
  background-position: center;
  overflow: hidden;

  @media (max-width: 968px) {
    display: none;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(15, 20, 25, 0.94) 0%,
    rgba(26, 29, 35, 0.9) 50%,
    rgba(15, 20, 25, 0.94) 100%
  );
`;

const ContentOverlay = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3em;
  color: ${theme.colors.white};
`;

const BrandSection = styled.div`
  text-align: center;
  animation: fadeInDown 0.8s ease;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LogoCircle = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1em;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, #f39c12 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  color: ${theme.colors.black};
  box-shadow: 0 8px 32px ${theme.colors.primary}50;
  animation: pulse 3s infinite;

  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 8px 32px ${theme.colors.primary}50;
      transform: scale(1);
    }
    50% {
      box-shadow: 0 8px 40px ${theme.colors.primary}70;
      transform: scale(1.05);
    }
  }
`;

const BrandTitle = styled.h1`
  font-size: 3em;
  font-weight: ${theme.font_weight.large};
  color: ${theme.colors.primary};
  margin: 0 0 0.2em;
  letter-spacing: 0.1em;
`;

const BrandSubtitle = styled.p`
  font-size: 1.1em;
  color: ${theme.colors.font2};
  margin: 0;
  font-weight: ${theme.font_weight.medium};
`;

const HeroSection = styled.div`
  animation: fadeInUp 0.8s ease 0.2s both;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroTitle = styled.h2`
  font-size: 2.8em;
  font-weight: ${theme.font_weight.large};
  color: ${theme.colors.white};
  margin: 0 0 0.5em;
  line-height: 1.2;
`;

const HeroDescription = styled.p`
  font-size: 1.15em;
  color: ${theme.colors.font2};
  line-height: 1.6;
  margin: 0 0 2em;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 1em;
  font-size: 1.05em;
  color: ${theme.colors.font2};
`;

const FeatureDot = styled.div`
  width: 8px;
  height: 8px;
  background: ${theme.colors.primary};
  border-radius: 50%;
  flex-shrink: 0;
`;

const ProgressSection = styled.div`
  animation: fadeIn 0.8s ease 0.4s both;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.8em;
`;

const ProgressFill = styled.div<{ step: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.primary} 0%, #f39c12 100%);
  width: ${({ step }) => ((step + 1) / 3) * 100}%;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px ${theme.colors.primary}80;
`;

const ProgressLabel = styled.p`
  font-size: 0.9em;
  color: ${theme.colors.font2};
  margin: 0;
  text-align: center;
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2em;
  background: ${theme.colors.dark};

  @media (max-width: 968px) {
    min-height: 100vh;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 540px;
  animation: slideInRight 0.6s ease;

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const WelcomeHeader = styled.div`
  text-align: center;
  margin-bottom: 3em;
`;

const WelcomeTitle = styled.h2`
  font-size: 2.4em;
  font-weight: ${theme.font_weight.large};
  color: ${theme.colors.font1};
  margin: 0 0 0.3em;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.05em;
  color: ${theme.colors.font2};
  margin: 0;
`;

const StepsContent = styled.div`
  min-height: 300px;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 2em;
  padding-top: 2em;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  color: ${theme.colors.font2};
  font-size: 0.95em;

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    font-weight: ${theme.font_weight.medium};
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  }
`;
