import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormUtils } from "../../hooks";
import { Button, Col, Form, Input, notification, Row } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { theme } from "../../styles";
import { useState } from "react";
import { isEmpty } from "lodash";
import { useAuthentication } from "../../providers";

type StepDniProps = {
  onNext: () => void;
  loading: boolean;
};

interface DniForm {
  dni: string;
}

export const AccessDataLogin = ({ onNext }: StepDniProps) => {
  const [loading, setLoading] = useState(false);
  const { findUserByDNI } = useAuthentication();

  const schema = yup.object({
    dni: yup.string().min(8).max(8).required(),
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

  const onSubmit = async ({ dni }: DniForm) => {
    try {
      setLoading(true);

      const user = await findUserByDNI(dni);

      if (isEmpty(user))
        return notification({
          type: "warning",
          title: "El DNI, no se encuentra registrado!",
        });

      console.log(user);

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
                  value={value}
                  onChange={onChange}
                  name={name}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                  maxLength={8}
                  size="large"
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
              loading={loading}
            >
              Siguiente
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
  border: 1px dotted ${theme.colors.primary}30;
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
