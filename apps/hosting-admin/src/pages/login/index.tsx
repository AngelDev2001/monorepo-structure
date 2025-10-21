import { useState } from "react";
import styled from "styled-components";
import { Button, Form, Input, Radio, Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faEnvelope,
  faIdCard,
  faMobileAlt,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { theme } from "../../styles";

type VerificationMethod = "email" | "phone";

export function Login() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dni, setDni] = useState("");
  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>("email");
  const [verificationCode, setVerificationCode] = useState("");

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <LoginContainer>
      <Logo>
        <div className="logo-circle">
          <FontAwesomeIcon icon={faShieldHalved} size="2x" />
        </div>
        <h1>Bienvenido</h1>
        <p>Ingresa de forma segura</p>
      </Logo>
      <StepContent>
        {currentStep === 0 && (
          <StepDni dni={dni} setDni={setDni} onNext={nextStep} />
        )}
        {currentStep === 1 && (
          <StepVerificationMethod
            verificationMethod={verificationMethod}
            setVerificationMethod={setVerificationMethod}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {currentStep === 2 && (
          <StepVerificationCode
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            verificationMethod={verificationMethod}
            onBack={prevStep}
            onFinish={() => console.log("Login completado!")}
          />
        )}
      </StepContent>
    </LoginContainer>
  );
}

// ============ STEP 1: DNI ============
type StepDniProps = {
  dni: string;
  setDni: (value: string) => void;
  onNext: () => void;
};

const StepDni = ({ dni, setDni, onNext }: StepDniProps) => {
  const handleSubmit = () => {
    if (dni.length === 8) {
      onNext();
    }
  };

  return (
    <StepWrapper>
      <StepTitle>
        <FontAwesomeIcon icon={faIdCard} size="2x" />
        <h2>Ingresa tu DNI</h2>
        <p>Necesitamos verificar tu identidad</p>
      </StepTitle>

      <Form onFinish={handleSubmit}>
        <Form.Item
          rules={[
            { required: true, message: "Por favor ingresa tu DNI" },
            { len: 8, message: "El DNI debe tener 8 dígitos" },
          ]}
        >
          <DniInput
            placeholder="12345678"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
            maxLength={8}
            size="large"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          disabled={dni.length !== 8}
        >
          Continuar
        </Button>
      </Form>
    </StepWrapper>
  );
};

// ============ STEP 2: MÉTODO DE VERIFICACIÓN ============
type StepVerificationMethodProps = {
  verificationMethod: VerificationMethod;
  setVerificationMethod: (value: VerificationMethod) => void;
  onNext: () => void;
  onBack: () => void;
};

const StepVerificationMethod = ({
  verificationMethod,
  setVerificationMethod,
  onNext,
  onBack,
}: StepVerificationMethodProps) => {
  return (
    <StepWrapper>
      <StepTitle>
        <FontAwesomeIcon icon={faShieldHalved} size="2x" />
        <h2>¿Cómo quieres recibir el código?</h2>
        <p>Selecciona tu método preferido</p>
      </StepTitle>

      <MethodOptions>
        <MethodCard
          selected={verificationMethod === "email"}
          onClick={() => setVerificationMethod("email")}
        >
          <div className="icon">
            <FontAwesomeIcon icon={faEnvelope} size="2x" />
          </div>
          <h3>Correo Electrónico</h3>
          <p>ejemplo@email.com</p>
          <Radio checked={verificationMethod === "email"} />
        </MethodCard>

        <MethodCard
          selected={verificationMethod === "phone"}
          onClick={() => setVerificationMethod("phone")}
        >
          <div className="icon">
            <FontAwesomeIcon icon={faMobileAlt} size="2x" />
          </div>
          <h3>Número Celular</h3>
          <p>+51 *** *** 123</p>
          <Radio checked={verificationMethod === "phone"} />
        </MethodCard>
      </MethodOptions>

      <ButtonGroup>
        <Button size="large" onClick={onBack}>
          Atrás
        </Button>
        <Button type="primary" size="large" onClick={onNext}>
          Enviar Código
        </Button>
      </ButtonGroup>
    </StepWrapper>
  );
};

// ============ STEP 3: CÓDIGO DE VERIFICACIÓN ============
type StepVerificationCodeProps = {
  verificationCode: string;
  setVerificationCode: (value: string) => void;
  verificationMethod: VerificationMethod;
  onBack: () => void;
  onFinish: () => void;
};

const StepVerificationCode = ({
  verificationCode,
  setVerificationCode,
  verificationMethod,
  onBack,
  onFinish,
}: StepVerificationCodeProps) => {
  const handleSubmit = () => {
    if (verificationCode.length === 6) {
      onFinish();
    }
  };

  return (
    <StepWrapper>
      <StepTitle>
        <FontAwesomeIcon icon={faCheckCircle} size="2x" />
        <h2>Ingresa el código</h2>
        <p>
          Enviamos un código de 6 dígitos a tu{" "}
          {verificationMethod === "email" ? "correo" : "celular"}
        </p>
      </StepTitle>

      <Form onFinish={handleSubmit}>
        <CodeInputWrapper>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <CodeDigit
              key={index}
              maxLength={1}
              value={verificationCode[index] || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                const newCode = verificationCode.split("");
                newCode[index] = value;
                setVerificationCode(newCode.join(""));

                // Auto-focus siguiente input
                if (value && index < 5) {
                  const nextInput = document.querySelector(
                    `input[data-index="${index + 1}"]`
                  ) as HTMLInputElement;
                  nextInput?.focus();
                }
              }}
              onKeyDown={(e) => {
                // Backspace en input vacío va al anterior
                if (
                  e.key === "Backspace" &&
                  !verificationCode[index] &&
                  index > 0
                ) {
                  const prevInput = document.querySelector(
                    `input[data-index="${index - 1}"]`
                  ) as HTMLInputElement;
                  prevInput?.focus();
                }
              }}
              data-index={index}
            />
          ))}
        </CodeInputWrapper>

        <ResendLink>
          ¿No recibiste el código? <a href="#">Reenviar</a>
        </ResendLink>

        <ButtonGroup>
          <Button size="large" onClick={onBack}>
            Atrás
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            disabled={verificationCode.length !== 6}
          >
            Verificar
          </Button>
        </ButtonGroup>
      </Form>
    </StepWrapper>
  );
};

// ============ STYLED COMPONENTS ============

const LoginContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2.5em;

  .logo-circle {
    width: 80px;
    height: 80px;
    margin: 0 auto 1em;
    background: linear-gradient(
      135deg,
      ${theme.colors.primary} 0%,
      #ff8c42 100%
    );
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.black};
    box-shadow: 0 8px 24px rgba(255, 184, 77, 0.3);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 8px 24px rgba(255, 184, 77, 0.3);
    }
    50% {
      box-shadow: 0 8px 32px rgba(255, 184, 77, 0.5);
    }
  }

  h1 {
    color: ${theme.colors.font1};
    font-size: ${theme.font_sizes.xx_large};
    font-weight: ${theme.font_weight.large};
    margin: 0 0 0.3em;
  }

  p {
    color: ${theme.colors.font2};
    font-size: ${theme.font_sizes.medium};
    margin: 0;
  }
`;

const StepContent = styled.div`
  min-height: 350px;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StepWrapper = styled.div`
  padding: 1em 0;
`;

const StepTitle = styled.div`
  text-align: center;
  margin-bottom: 2em;

  svg {
    color: ${theme.colors.primary};
    margin-bottom: 0.8em;
  }

  h2 {
    color: ${theme.colors.font1};
    font-size: ${theme.font_sizes.x_large};
    font-weight: ${theme.font_weight.large};
    margin: 0 0 0.5em;
  }

  p {
    color: ${theme.colors.font2};
    font-size: ${theme.font_sizes.small};
    margin: 0;
  }
`;

const DniInput = styled(Input)`
  text-align: center;
  font-size: 1.5em;
  font-weight: ${theme.font_weight.medium};
  letter-spacing: 0.3em;
  padding: 0.5em;

  &::placeholder {
    letter-spacing: normal;
  }
`;

const MethodOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
  margin-bottom: 2em;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MethodCard = styled.div<{ selected: boolean }>`
  background: ${({ selected }) =>
    selected
      ? `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.primary}05 100%)`
      : theme.colors.dark};
  border: 2px solid
    ${({ selected }) => (selected ? theme.colors.primary : "transparent")};
  border-radius: ${theme.border_radius.medium};
  padding: 1.5em;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  .icon {
    color: ${({ selected }) =>
      selected ? theme.colors.primary : theme.colors.font2};
    margin-bottom: 0.8em;
    transition: color 0.3s ease;
  }

  h3 {
    color: ${theme.colors.font1};
    font-size: ${theme.font_sizes.medium};
    font-weight: ${theme.font_weight.medium};
    margin: 0 0 0.3em;
  }

  p {
    color: ${theme.colors.font2};
    font-size: ${theme.font_sizes.x_small};
    margin: 0 0 0.8em;
  }

  .ant-radio {
    position: absolute;
    top: 1em;
    right: 1em;
  }
`;

const CodeInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8em;
  margin-bottom: 1.5em;
`;

const CodeDigit = styled(Input)`
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 1.8em;
  font-weight: ${theme.font_weight.large};
  border: 2px solid ${theme.colors.gray};
  border-radius: ${theme.border_radius.small};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 50px;
    font-size: 1.5em;
  }
`;

const ResendLink = styled.div`
  text-align: center;
  margin-bottom: 2em;
  color: ${theme.colors.font2};
  font-size: ${theme.font_sizes.small};

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    font-weight: ${theme.font_weight.medium};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ButtonGroup = styled(Space)`
  width: 100%;
  display: flex;
  justify-content: space-between;

  button {
    flex: 1;
  }
`;
