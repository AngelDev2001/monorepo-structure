import { Button, Col, Row } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faMobileAlt,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { theme } from "../../styles";
import { useState } from "react";
import { useAuthentication } from "../../providers";
import { truncate } from "lodash";

type StepVerificationMethodProps = {
  onNext: () => void;
  onBack: () => void;
};

export const VerificationMethod = ({
  onNext,
  onBack,
}: StepVerificationMethodProps) => {
  const [verificationMethod, setVerificationMethod] = useState<
    "phone" | "email"
  >("phone");

  const [loading, setLoading] = useState(false);

  const { sendVerificationCode, tempUser } = useAuthentication();

  const onSendCode = async () => {
    try {
      setLoading(true);
      await sendVerificationCode(
        {
          email: tempUser?.email,
          phone: {
            prefix: tempUser?.phone.prefix,
            number: tempUser?.phone.number,
          },
        },
        verificationMethod
      );
      onNext();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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
        {/*<Col xs={24} sm={12}>*/}
        {/*  <MethodCard*/}
        {/*    selected={verificationMethod === "email"}*/}
        {/*    onClick={() => setVerificationMethod("email")}*/}
        {/*  >*/}
        {/*    <MethodIconCircle selected={verificationMethod === "email"}>*/}
        {/*      <FontAwesomeIcon icon={faEnvelope} />*/}
        {/*    </MethodIconCircle>*/}
        {/*    <MethodTitle>Correo Electrónico</MethodTitle>*/}
        {/*    <MethodSubtitle>*/}
        {/*      {tempUser?.email && truncate(tempUser?.email)}*/}
        {/*    </MethodSubtitle>*/}
        {/*    <MethodCheck selected={verificationMethod === "email"}>*/}
        {/*      {verificationMethod === "email" && (*/}
        {/*        <FontAwesomeIcon icon={faCheckCircle} />*/}
        {/*      )}*/}
        {/*    </MethodCheck>*/}
        {/*  </MethodCard>*/}
        {/*</Col>*/}

        <Col span={24}>
          <MethodCard
            selected={verificationMethod === "phone"}
            onClick={() => setVerificationMethod("phone")}
          >
            <MethodIconCircle selected={verificationMethod === "phone"}>
              <FontAwesomeIcon icon={faMobileAlt} />
            </MethodIconCircle>
            <MethodTitle>Número Celular</MethodTitle>
            <MethodSubtitle>
              {tempUser?.phone && truncate(tempUser?.phone.number)}
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
            onClick={onSendCode}
            disabled={loading}
            loading={loading}
          >
            Enviar Código
          </Button>
        </Col>
      </Row>
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
