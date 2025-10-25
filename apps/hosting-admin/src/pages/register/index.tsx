import { useState } from "react";
import styled from "styled-components";
import { notification } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { theme } from "../../styles";
import { Link, useNavigate } from "react-router-dom";
import { useApiUserPost } from "../../api";
import { PersonalInformation } from "./PersonalInformation.tsx";
import { AccessData } from "./AccessData.tsx";

export function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null);

  const { postUser, postUserLoading } = useApiUserPost();

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const onSubmitAccessData = (user) => {
    setStep1Data(user);
    nextStep();
  };

  const onSubmit = async (user) => {
    const fullData = {
      ...step1Data!,
      ...user,
    };

    try {
      const userData = {
        firstName: fullData.firstName,
        paternalSurname: fullData.paternalSurname,
        maternalSurname: fullData.maternalSurname,
        email: fullData.email,
        document: {
          type: fullData.documentType,
          number: fullData.documentNumber,
        },
        phone: {
          prefix: "+51",
          number: fullData.phoneNumber,
        },
        gender: fullData.gender,
      };

      const response = await postUser(userData);

      if (response && response.ok !== false) {
        notification({
          type: "success",
          title: "¡Registro exitoso!",
          description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error("Error in the register");
      }
    } catch (error: any) {
      console.error("Error in register:", error);

      let errorMessage =
        "No se pudo completar el registro. Intenta nuevamente.";

      if (error.message?.includes("email_already_exists")) {
        errorMessage = "Este correo electrónico ya está registrado";
      } else if (error.message?.includes("dni_already_exists")) {
        errorMessage = "Este documento ya está registrado";
      } else if (error.message?.includes("phone_number_already_exists")) {
        errorMessage = "Este número de teléfono ya está registrado";
      }

      notification({
        type: "error",
        title: "Error en el registro",
        description: errorMessage,
      });
    }
  };

  return (
    <RegisterContainer>
      <LeftSide>
        <ImageOverlay />
        <ContentOverlay>
          <BrandSection>
            <LogoCircle>
              <FontAwesomeIcon icon={faUserPlus} />
            </LogoCircle>
            <BrandTitle>SERVITEC</BrandTitle>
            <BrandSubtitle>Únete a nuestro sistema</BrandSubtitle>
          </BrandSection>

          <HeroSection>
            <HeroTitle>Crea tu cuenta en minutos</HeroTitle>
            <HeroDescription>
              Completa el registro para acceder a todas las funcionalidades de
              nuestra plataforma de gestión empresarial
            </HeroDescription>

            <BenefitsList>
              <BenefitItem>
                <BenefitIcon>✓</BenefitIcon>
                <span>Acceso seguro con verificación por SMS</span>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>✓</BenefitIcon>
                <span>Gestión completa de cotizaciones</span>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>✓</BenefitIcon>
                <span>Control de asistencias en tiempo real</span>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>✓</BenefitIcon>
                <span>Reportes y análisis detallados</span>
              </BenefitItem>
            </BenefitsList>
          </HeroSection>

          <ProgressSection>
            <ProgressBar>
              <ProgressFill step={currentStep} />
            </ProgressBar>
            <ProgressLabel>
              {currentStep === 0 && "Paso 1 de 2: Datos de identificación"}
              {currentStep === 1 && "Paso 2 de 2: Información personal"}
            </ProgressLabel>
          </ProgressSection>
        </ContentOverlay>
      </LeftSide>

      <RightSide>
        <FormContainer>
          <WelcomeHeader>
            <WelcomeTitle>Crear cuenta nueva</WelcomeTitle>
            <WelcomeSubtitle>
              Completa tus datos para registrarte
            </WelcomeSubtitle>
          </WelcomeHeader>

          <StepsContent>
            {currentStep === 0 && <AccessData onNext={onSubmitAccessData} />}
            {currentStep === 1 && (
              <PersonalInformation
                onBack={prevStep}
                onSubmit={onSubmit}
                loading={postUserLoading}
              />
            )}
          </StepsContent>

          <LoginLink>
            ¿Ya tienes cuenta? <Link to="/">Iniciar sesión</Link>
          </LoginLink>
        </FormContainer>
      </RightSide>
    </RegisterContainer>
  );
}

const RegisterContainer = styled.div`
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

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 1em;
  font-size: 1.05em;
  color: ${theme.colors.font2};
`;

const BenefitIcon = styled.div`
  width: 28px;
  height: 28px;
  background: ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.black};
  font-weight: ${theme.font_weight.large};
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
  width: ${({ step }) => ((step + 1) / 2) * 100}%;
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
  overflow-y: auto;

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
  margin-bottom: 2.5em;
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
  min-height: 520px;
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
