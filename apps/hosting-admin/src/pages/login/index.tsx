import { useState } from "react";
import styled from "styled-components";
import { Button, Col, Form, Input, InputCode, Row } from "../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheckCircle,
  faEnvelope,
  faMobileAlt,
  faShieldHalved,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { theme } from "../../styles";
import { useFormUtils } from "../../hooks/useFormUtils";
import { useAuthentication } from "../../providers";
import { useNavigate } from "react-router-dom";

type VerificationMethod = "email" | "phone";

interface DniForm {
  dni: string;
}

interface CodeForm {
  code: string;
}

export function Login() {
  const navigate = useNavigate();
  const { findUserByDNI, sendVerificationCode, verifyCode, loginLoading } =
    useAuthentication();

  const [currentStep, setCurrentStep] = useState(2);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>("email");

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleDniSubmit = async (dni: string) => {
    const user = await findUserByDNI(dni);
    if (user) {
      setFoundUser(user);
      nextStep();
    }
  };

  const handleSendCode = async () => {
    if (foundUser) {
      await sendVerificationCode(foundUser, verificationMethod);
      nextStep();
    }
  };

  const handleVerifyCode = async (code: string) => {
    await verifyCode(code);
    navigate("/home");
  };

  return (
    <LoginContainer>
      {/* ========== LADO IZQUIERDO: IMAGEN ========== */}
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

      {/* ========== LADO DERECHO: FORMULARIO ========== */}
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
              <StepDni onNext={handleDniSubmit} loading={loginLoading} />
            )}
            {currentStep === 1 && (
              <StepVerificationMethod
                verificationMethod={verificationMethod}
                setVerificationMethod={setVerificationMethod}
                onNext={handleSendCode}
                onBack={prevStep}
                loading={loginLoading}
                user={foundUser}
              />
            )}
            {currentStep === 2 && (
              <StepVerificationCode
                verificationMethod={verificationMethod}
                onBack={prevStep}
                onFinish={handleVerifyCode}
                loading={loginLoading}
              />
            )}
          </StepsContent>
        </FormContainer>
      </RightSide>
    </LoginContainer>
  );
}

// ============ STEP 1: DNI ============
type StepDniProps = {
  onNext: (dni: string) => Promise<void>;
  loading: boolean;
};

const StepDni = ({ onNext, loading }: StepDniProps) => {
  const schema = yup.object({
    dni: yup
      .string()
      .required("El DNI es obligatorio")
      .matches(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DniForm>({
    resolver: yupResolver(schema),
    defaultValues: { dni: "" },
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmit = async (formData: DniForm) => {
    await onNext(formData.dni);
  };

  return (
    <StepContainer>
      <StepHeader>
        <StepTitle>Verificación de identidad</StepTitle>
        <StepSubtitle>
          Ingresa tu DNI para buscar tu cuenta en nuestro sistema
        </StepSubtitle>
      </StepHeader>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              name="dni"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Documento de Identidad (DNI)"
                  placeholder="Ingresa 8 dígitos"
                  value={value}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "");
                    onChange(cleaned);
                  }}
                  name={name}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                  maxLength={8}
                  size="large"
                  variant="outlined"
                />
              )}
            />
          </Col>

          <Col span={24}>
            <InfoBox>
              <FontAwesomeIcon
                icon={faShieldHalved}
                style={{ marginRight: "0.5em" }}
              />
              Tu información está protegida y cifrada
            </InfoBox>
          </Col>

          <Col span={24}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Verificando...
                </>
              ) : (
                <>
                  Continuar{" "}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ marginLeft: "0.5em" }}
                  />
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </StepContainer>
  );
};

// ============ STEP 2: MÉTODO DE VERIFICACIÓN ============
type StepVerificationMethodProps = {
  verificationMethod: VerificationMethod;
  setVerificationMethod: (value: VerificationMethod) => void;
  onNext: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
  user: User | null;
};

const StepVerificationMethod = ({
  verificationMethod,
  setVerificationMethod,
  onNext,
  onBack,
  loading,
  user,
}: StepVerificationMethodProps) => {
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    return `${localPart.substring(0, 3)}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    return `+51 *** *** ${phone.slice(-3)}`;
  };

  return (
    <StepContainer>
      <StepHeader>
        <StepTitle>Método de verificación</StepTitle>
        <StepSubtitle>
          Selecciona cómo deseas recibir tu código de seguridad
        </StepSubtitle>
      </StepHeader>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <MethodCard
            selected={verificationMethod === "email"}
            onClick={() => setVerificationMethod("email")}
          >
            <MethodIconCircle selected={verificationMethod === "email"}>
              <FontAwesomeIcon icon={faEnvelope} />
            </MethodIconCircle>
            <MethodTitle>Correo Electrónico</MethodTitle>
            <MethodSubtitle>
              {user?.email ? maskEmail(user.email) : "ejemplo@*****.com"}
            </MethodSubtitle>
            <MethodCheck selected={verificationMethod === "email"}>
              {verificationMethod === "email" && (
                <FontAwesomeIcon icon={faCheckCircle} />
              )}
            </MethodCheck>
          </MethodCard>
        </Col>

        <Col xs={24} sm={12}>
          <MethodCard
            selected={verificationMethod === "phone"}
            onClick={() => setVerificationMethod("phone")}
          >
            <MethodIconCircle selected={verificationMethod === "phone"}>
              <FontAwesomeIcon icon={faMobileAlt} />
            </MethodIconCircle>
            <MethodTitle>Número Celular</MethodTitle>
            <MethodSubtitle>
              {user?.phone ? maskPhone(user.phone.number) : "+51 *** *** ***"}
            </MethodSubtitle>
            <MethodCheck selected={verificationMethod === "phone"}>
              {verificationMethod === "phone" && (
                <FontAwesomeIcon icon={faCheckCircle} />
              )}
            </MethodCheck>
          </MethodCard>
        </Col>

        <Col span={24}>
          <InfoBox>
            <FontAwesomeIcon
              icon={faShieldHalved}
              style={{ marginRight: "0.5em" }}
            />
            Enviaremos un código de 6 dígitos que expira en 5 minutos
          </InfoBox>
        </Col>

        <Col xs={24} sm={12}>
          <Button size="large" block onClick={onBack}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ marginRight: "0.5em" }}
            />
            Atrás
          </Button>
        </Col>

        <Col xs={24} sm={12}>
          <Button
            type="primary"
            size="large"
            block
            onClick={onNext}
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Enviando...
              </>
            ) : (
              <>
                Enviar Código{" "}
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ marginLeft: "0.5em" }}
                />
              </>
            )}
          </Button>
        </Col>
      </Row>
    </StepContainer>
  );
};

// ============ STEP 3: CÓDIGO DE VERIFICACIÓN ============
type StepVerificationCodeProps = {
  verificationMethod: VerificationMethod;
  onBack: () => void;
  onFinish: (code: string) => Promise<void>;
  loading: boolean;
};

const StepVerificationCode = ({
  verificationMethod,
  onBack,
  onFinish,
  loading,
}: StepVerificationCodeProps) => {
  const schema = yup.object({
    code: yup
      .string()
      .required("El código es obligatorio")
      .matches(/^\d{6}$/, "El código debe tener 6 dígitos"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CodeForm>({
    resolver: yupResolver(schema),
    defaultValues: { code: "" },
  });

  const { errorMessage } = useFormUtils({ errors, schema });
  const codeValue = watch("code");

  const onSubmit = async (formData: CodeForm) => {
    await onFinish(formData.code);
  };

  return (
    <StepContainer>
      <StepHeader>
        <StepTitle>Código de verificación</StepTitle>
        <StepSubtitle>
          Enviamos un código de 6 dígitos a tu{" "}
          {verificationMethod === "email" ? "correo electrónico" : "celular"}
        </StepSubtitle>
      </StepHeader>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Controller
              name="code"
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputCode
                  value={value || ""}
                  onChange={(code) => {
                    onChange(code);
                    setValue("code", code);
                  }}
                  numInputs={6}
                  type="number"
                  error={!!errors.code}
                  helperText={errorMessage("code")}
                />
              )}
            />
          </Col>

          <Col span={24}>
            <ResendSection>
              <ResendText>¿No recibiste el código?</ResendText>
              <ResendLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Reenviar código");
                }}
              >
                Reenviar código de verificación
              </ResendLink>
            </ResendSection>
          </Col>

          <Col span={24}>
            <InfoBox>
              <FontAwesomeIcon
                icon={faShieldHalved}
                style={{ marginRight: "0.5em" }}
              />
              El código expira en 5 minutos
            </InfoBox>
          </Col>

          <Col xs={24} sm={12}>
            <Button size="large" block onClick={onBack}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{ marginRight: "0.5em" }}
              />
              Atrás
            </Button>
          </Col>

          <Col xs={24} sm={12}>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              disabled={loading || codeValue.length !== 6}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Verificando...
                </>
              ) : (
                <>
                  Ingresar{" "}
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{ marginLeft: "0.5em" }}
                  />
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </StepContainer>
  );
};

// ============ STYLED COMPONENTS ============

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
  min-height: 480px;
`;

const StepContainer = styled.div`
  animation: fadeInScale 0.4s ease;

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const StepHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5em;
`;

const StepIconWrapper = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto 1.2em;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, #f39c12 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8em;
  color: ${theme.colors.black};
  box-shadow: 0 4px 24px ${theme.colors.primary}50;
`;

const StepTitle = styled.h3`
  font-size: 1.7em;
  font-weight: ${theme.font_weight.large};
  color: ${theme.colors.font1};
  margin: 0 0 0.4em;
`;

const StepSubtitle = styled.p`
  color: ${theme.colors.font2};
  margin: 0;
  font-size: 1em;
  line-height: 1.5;
`;

const InfoBox = styled.div`
  background: ${theme.colors.secondary};
  border: 1px solid ${theme.colors.primary}30;
  border-radius: ${theme.border_radius.small};
  padding: 1em;
  text-align: center;
  color: ${theme.colors.font2};
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${theme.colors.primary};
  }
`;

const MethodCard = styled.div<{ selected: boolean }>`
  background: ${({ selected }) =>
    selected
      ? `linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.primary}08 100%)`
      : theme.colors.secondary};
  border: 2px solid
    ${({ selected }) =>
      selected ? theme.colors.primary : "rgba(255, 255, 255, 0.05)"};
  border-radius: ${theme.border_radius.medium};
  padding: 2em 1.5em;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
  }
`;

const MethodIconCircle = styled.div<{ selected: boolean }>`
  width: 60px;
  height: 60px;
  margin: 0 auto 1em;
  border-radius: 50%;
  background: ${({ selected }) =>
    selected
      ? `linear-gradient(135deg, ${theme.colors.primary} 0%, #f39c12 100%)`
      : theme.colors.dark};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  color: ${({ selected }) =>
    selected ? theme.colors.black : theme.colors.font2};
  transition: all 0.3s ease;
`;

const MethodTitle = styled.h4`
  color: ${theme.colors.font1};
  font-size: 1.1em;
  font-weight: ${theme.font_weight.medium};
  margin: 0 0 0.5em;
`;

const MethodSubtitle = styled.p`
  color: ${theme.colors.font2};
  font-size: 0.9em;
  margin: 0;
`;

const MethodCheck = styled.div<{ selected: boolean }>`
  position: absolute;
  top: 1em;
  right: 1em;
  font-size: 1.3em;
  color: ${theme.colors.primary};
  opacity: ${({ selected }) => (selected ? 1 : 0)};
  transform: scale(${({ selected }) => (selected ? 1 : 0.5)});
  transition: all 0.3s ease;
`;

const CodeInputWrapper = styled.div`
  margin: 2em 0;
`;

const ResendSection = styled.div`
  text-align: center;
`;

const ResendText = styled.p`
  color: ${theme.colors.font2};
  font-size: 0.95em;
  margin: 0 0 0.5em;
`;

const ResendLink = styled.a`
  color: ${theme.colors.primary};
  text-decoration: none;
  font-weight: ${theme.font_weight.medium};
  font-size: 0.95em;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`;
