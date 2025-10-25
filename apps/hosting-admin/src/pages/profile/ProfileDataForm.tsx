import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useFormUtils } from "../../hooks";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Upload,
} from "../../components";
import { useAuthentication } from "../../providers";
import {
  apiErrorNotification,
  getApiErrorResponse,
  useApiUserPut,
} from "../../api";
import { assign } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getSearchDataToUser } from "../../utils";
import styled, { css } from "styled-components";
import { theme } from "../../styles";

interface ProfileFormData {
  profilePhoto?: any;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  email: string;
  phoneNumber: string;
  dni: string;
}

export const ProfileDataForm: React.FC = () => {
  const { authUser } = useAuthentication();
  const { putUser, putUserLoading, putUserResponse } = useApiUserPut();

  const schema = yup.object({
    profilePhoto: yup.mixed().notRequired(),
    firstName: yup.string().required(),
    paternalSurname: yup.string().required(),
    maternalSurname: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string().min(9).max(9).required(),
    dni: yup
      .string()
      .min(8)
      .max(8)
      .required()
      .transform((value) => (value === null ? "" : value)),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
  });

  const { error, errorMessage, required } = useFormUtils({ errors, schema });

  const updateProfile = async (formData: ProfileFormData): Promise<void> => {
    try {
      const response = await putUser(
        assign({}, formData, {
          id: authUser.id,
          profilePhoto: formData?.profilePhoto || null,
          phone: { prefix: "+51", number: formData.phoneNumber },
          searchData: getSearchDataToUser(formData, formData.firstName),
        })
      );

      if (!putUserResponse.ok) {
        throw new Error(response);
      }

      notification({
        type: "success",
        title: "Perfil actualizado correctamente",
      });
    } catch (e) {
      const errorResponse = await getApiErrorResponse(e);
      apiErrorNotification(errorResponse);
    }
  };

  const resetForm = (): void => {
    reset({
      profilePhoto: authUser?.profilePhoto || null,
      firstName: authUser?.firstName || "",
      maternalSurname: authUser?.maternalSurname || "",
      paternalSurname: authUser?.paternalSurname || "",
      email: authUser?.email || "",
      phoneNumber: authUser?.phone?.number || "",
      dni: authUser?.document.number || "",
    });
  };

  useEffect(() => {
    resetForm();
  }, [authUser]);

  const onSubmit = async (formData: ProfileFormData): Promise<void> => {
    await updateProfile(formData);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Controller
              control={control}
              name="profilePhoto"
              render={({ field: { onChange, value, name } }) => (
                <Upload
                  isImage
                  label="Foto personal"
                  accept="image/*"
                  resize="313x370"
                  buttonText="Subir foto"
                  value={value}
                  name={name}
                  fileName={`perfil-foto-${uuidv4()}`}
                  filePath={`users/${authUser.id}/profile`}
                  onChange={(file) => onChange(file)}
                  required={required(name)}
                  error={error(name)}
                />
              )}
            />
          </Col>

          <Col span={24} md={12}>
            <Controller
              name="firstName"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <Input
                  label="Nombres"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col span={24} md={12}>
            <Controller
              name="dni"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <Input
                  label="DNI"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col span={24} md={12}>
            <Controller
              name="paternalSurname"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <Input
                  label="Apellido paterno"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col span={24} md={12}>
            <Controller
              name="maternalSurname"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <Input
                  label="Apellido materno"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col span={24} md={12}>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <Input
                  label="Email"
                  type="email"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>

          <Col span={24} md={12}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field: { onChange, name, value } }) => (
                <Input
                  label="N° Celular"
                  type="number"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                />
              )}
            />
          </Col>
        </Row>

        <ActionRow justify="end" gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={putUserLoading}
            >
              Guardar Cambios
            </Button>
          </Col>
        </ActionRow>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  ${() => css`
    .ant-form-item {
      margin-bottom: ${theme.paddings.large};
    }
  `}
`;

const ActionRow = styled(Row)`
  ${() => css`
    margin-top: ${theme.paddings.x_large};
    padding-top: ${theme.paddings.large};
    border-top: 1px solid ${theme.colors.primary}20;
  `}
`;
