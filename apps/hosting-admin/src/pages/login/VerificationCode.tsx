import { useEffect, useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import {
  Button,
  Col,
  Form,
  InputCode,
  notification,
  Row,
} from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { theme } from "../../styles";

type StepVerificationCodeProps = {
  onBack: () => void;
  onFinish: (code: string) => Promise<void>;
};

export const VerificationCode = ({
  onBack,
  onFinish,
}: StepVerificationCodeProps) => {
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    code: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<{ code: string }>({
    resolver: yupResolver(schema),
    defaultValues: { code: "" },
  });

  const { errorMessage } = useFormUtils({ errors, schema });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const onSubmit = async ({ code }: { code: string }) => {
    try {
      setLoading(true);
      await onFinish(code);
    } catch (e) {
      console.error(e);
      reset({ code: "" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendDisabled(true);
    setCountdown(60);

    try {
      notification({
        type: "info",
        title: "Reenviando código",
        description: "Por favor espera...",
      });
    } catch (e) {
      console.error(e);
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  return (
    <StepContainer>
      <StepHeader>
        <StepIconWrapper>
          <FontAwesomeIcon icon={faCheckCircle} />
        </StepIconWrapper>
        <StepTitle>Código de verificación</StepTitle>
        <StepSubtitle>
          Enviamos un código de 6 dígitos a tu celular
          {/*{verificationMethod === "email" ? "correo electrónico" : "celular"}*/}
        </StepSubtitle>
      </StepHeader>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Controller
              name="code"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CodeInputWrapper>
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
                </CodeInputWrapper>
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
                  if (!resendDisabled) {
                    handleResendCode();
                  }
                }}
                disabled={resendDisabled}
              >
                {resendDisabled
                  ? `Reenviar en ${countdown}s`
                  : "Reenviar código de verificación"}
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
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Button size="large" block onClick={onBack} disabled={loading}>
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
              disabled={loading}
              loading={loading}
            >
              Ingresar
            </Button>
          </Col>
        </Row>
      </Form>
    </StepContainer>
  );
};

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

const ResendLink = styled.a<{ disabled?: boolean }>`
  color: ${({ disabled }) =>
    disabled ? theme.colors.gray : theme.colors.primary};
  text-decoration: none;
  font-weight: ${theme.font_weight.medium};
  font-size: 0.95em;
  transition: opacity 0.2s ease;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 1 : 0.8)};
    text-decoration: ${({ disabled }) => (disabled ? "none" : "underline")};
  }
`;
