import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import styled, { css } from "styled-components";
import { Button } from "../../ui";
import React from "react";
import AntdModal from "antd/lib/modal";
import { theme } from "../../../styles";

interface PreviewFileProps {
  url: string;
  thumbUrl?: string;
  isImage: boolean;
  onCancel: () => void;
  visible: boolean;
}

interface UploadBodyProps {
  buttonText: string;
  visible?: boolean;
}

interface UploadDraggerBodyProps {
  text: string;
  hint: string;
}

export const PreviewFile: React.FC<PreviewFileProps> = ({
  url,
  isImage,
  onCancel,
  thumbUrl,
  visible,
}) => (
  <ModalStyled
    onCancel={onCancel}
    style={{ textAlign: "center" }}
    open={visible}
    title="Visualización"
    closable={true}
    centered={true}
    footer={[
      <ButtonStyled
        key="download"
        size="large"
        onClick={() => window.open(isImage ? thumbUrl : url, "_blank")}
        icon={<FontAwesomeIcon icon={faDownload} />}
      >
        &ensp; Descargar
      </ButtonStyled>,
    ]}
  >
    {isImage ? (
      <img src={thumbUrl || url} alt="thumbImage" />
    ) : (
      <span>Vista previa solo para imágenes</span>
    )}
  </ModalStyled>
);

export const UploadBody: React.FC<UploadBodyProps> = ({
  buttonText,
  visible = true,
}) =>
  visible ? (
    <Button size="large" block icon={<FontAwesomeIcon icon={faUpload} />}>
      &nbsp; {buttonText}
    </Button>
  ) : null;

export const UploadDraggerBody: React.FC<UploadDraggerBodyProps> = ({
  text,
  hint,
}) => (
  <Wrapper>
    <p className="ant-upload-drag-icon">
      <FontAwesomeIcon icon={faBox} size="2x" />
    </p>
    <p className="ant-upload-text">{text}</p>
    <p className="ant-upload-hint">{hint}</p>
  </Wrapper>
);

const ModalStyled = styled(AntdModal)`
  ${() => css`
    .ant-modal-content {
      background: ${theme.colors.secondary};
      color: ${theme.colors.font1} !important;
    }

    .ant-modal-header {
      background: ${theme.colors.secondary};
      border-bottom: 1px solid ${theme.colors.font2}40;

      .ant-modal-title {
        color: ${theme.colors.font1} !important;
      }
    }

    .ant-modal-close {
      color: ${theme.colors.font2};

      &:hover {
        color: ${theme.colors.primary};
      }
    }

    .ant-modal-footer {
      border-top: 1px solid ${theme.colors.font2}40;
    }

    img {
      max-width: 100%;
      box-sizing: border-box;
      object-fit: cover;
      border-radius: ${theme.border_radius.small};
    }

    span {
      color: ${theme.colors.font2};
    }
  `}
`;

const ButtonStyled = styled(Button)`
  ${() => css`
    display: inline-flex;
    align-items: center;
    color: ${theme.colors.font1};
    background: ${theme.colors.primary};
    border-color: ${theme.colors.primary};

    &:hover {
      background: ${theme.colors.primary}dd;
      border-color: ${theme.colors.primary}dd;
      color: ${theme.colors.dark};
    }

    svg {
      font-size: ${theme.font_sizes.x_small};
      margin: 0 5px 4px 0;
      color: ${theme.colors.dark};
    }
  `}
`;

const Wrapper = styled.div`
  ${() => css`
    p {
      font-size: 1em !important;
      color: ${theme.colors.font1} !important;

      svg {
        color: ${theme.colors.primary};
      }
    }

    .ant-upload-text {
      color: ${theme.colors.font1};
      font-weight: ${theme.font_weight.medium};
    }

    .ant-upload-hint {
      color: ${theme.colors.font2};
    }
  `}
`;
