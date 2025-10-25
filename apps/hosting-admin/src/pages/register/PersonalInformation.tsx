import { Button, Col, Form, Input, Row, Select } from "../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheckCircle,
  faSpinner,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useFormUtils } from "../../hooks";
import styled from "styled-components";
import { theme } from "../../styles";

type Gender = "male" | "female" | "other";

interface UserRegister {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  gender: Gender;
}

type PersonalInformationProps = {
  onBack: () => void;
  onSubmit: (data: UserRegister) => void;
  loading: boolean;
};

export const PersonalInformation = ({
  onBack,
  onSubmit,
  loading,
}: PersonalInformationProps) => {
  const schema = yup.object({
    firstName: yup
      .string()
      .required("Los nombres son obligatorios")
      .min(2, "Mínimo 2 caracteres"),
    paternalSurname: yup
      .string()
      .required("El apellido paterno es obligatorio")
      .min(2, "Mínimo 2 caracteres"),
    maternalSurname: yup
      .string()
      .required("El apellido materno es obligatorio")
      .min(2, "Mínimo 2 caracteres"),
    email: yup
      .string()
      .required("El correo es obligatorio")
      .email("Correo electrónico inválido"),
    phonePrefix: yup.string().required("Prefijo requerido"),
    phoneNumber: yup
      .string()
      .required("El celular es obligatorio")
      .matches(/^\d{9}$/, "El celular debe tener 9 dígitos"),
    gender: yup.string().required("Selecciona tu género"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserRegister>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      paternalSurname: "",
      maternalSurname: "",
      email: "",
      phonePrefix: "+51",
      phoneNumber: "",
      gender: undefined,
    },
  });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const genderOptions = [
    { value: "male", label: "Masculino" },
    { value: "female", label: "Femenino" },
    { value: "other", label: "Otro / Prefiero no decirlo" },
  ];

  return (
    <StepContainer>
      <StepHeader>
        <StepIconWrapper>
          <FontAwesomeIcon icon={faUser} />
        </StepIconWrapper>
        <StepTitle>Información personal</StepTitle>
        <StepSubtitle>
          Completa tus datos para finalizar el registro
        </StepSubtitle>
      </StepHeader>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              name="firstName"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Nombres"
                  value={value}
                  onChange={onChange}
                  name={name}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                  size="large"
                  variant="outlined"
                />
              )}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Controller
              name="paternalSurname"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Apellido Paterno"
                  value={value}
                  onChange={onChange}
                  name={name}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                  size="large"
                  variant="outlined"
                />
              )}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Controller
              name="maternalSurname"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Apellido Materno"
                  value={value}
                  onChange={onChange}
                  name={name}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                  size="large"
                  variant="outlined"
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Correo Electrónico"
                  value={value}
                  onChange={onChange}
                  name={name}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                  size="large"
                  variant="outlined"
                  type="email"
                />
              )}
            />
          </Col>
          <Col xs={8} sm={6}>
            <Controller
              name="phonePrefix"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Código"
                  value={`${value}`}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "");
                    onChange(cleaned);
                  }}
                  name={name}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                  maxLength={3}
                  size="large"
                  variant="outlined"
                />
              )}
            />
          </Col>
          <Col xs={16} sm={18}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Número de Celular"
                  value={value}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "");
                    onChange(cleaned);
                  }}
                  name={name}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                  maxLength={9}
                  size="large"
                  variant="outlined"
                />
              )}
            />
          </Col>
          <Col span={24}>
            <Controller
              name="gender"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <Select
                  label="Género"
                  value={value}
                  onChange={onChange}
                  options={genderOptions}
                  name={name}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                  variant="outlined"
                />
              )}
            />
          </Col>
          <Col span={24}>
            <InfoBox>
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ marginRight: "0.5em" }}
              />
              Tus datos están protegidos y no serán compartidos
            </InfoBox>
          </Col>
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
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Registrando...
                </>
              ) : (
                <>
                  Crear Cuenta{" "}
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
  margin-bottom: 2em;
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
