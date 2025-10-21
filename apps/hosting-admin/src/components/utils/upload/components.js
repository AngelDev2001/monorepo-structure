import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Button } from "../../ui";
import AntdModal from "antd/lib/modal";
// interface PreviewFileProps {
//     url: string;
//     thumbUrl?: string;
//     isImage: boolean;
//     onCancel: () => void;
//     visible: boolean;
// }
export const PreviewFile = ({ url, isImage, onCancel, thumbUrl, visible }) => (_jsx(ModalStyled, { onCancel: onCancel, style: { textAlign: "center" }, open: visible, title: "Visualizaci\u00F3n", closable: true, centered: true, footer: [
        _jsx(ButtonStyled, { size: "large", onClick: () => window.open(isImage ? thumbUrl : url, "_blank"), icon: _jsx(FontAwesomeIcon, { icon: faDownload }), children: "\u2002 Descargar" }, "download"),
    ], children: isImage ? (_jsx("img", { src: thumbUrl || url, alt: "thumbImage" })) : (_jsx("span", { children: "Vista previa solo para im\u00E1genes" })) }));
const ModalStyled = styled(AntdModal) `
  img {
    max-width: 100%;
    box-sizing: border-box;
    object-fit: cover;
  }
`;
const ButtonStyled = styled(Button) `
  display: inline-flex;
  align-items: center;
  color: #595e63;

  svg {
    font-size: ${({ theme }) => theme.font_sizes.x_small};
    margin: 0 5px 4px 0;
  }
`;
//
// interface UploadBodyProps {
//   buttonText: string;
//   visible?: boolean;
// }
export const UploadBody = ({ buttonText, visible = true }) => visible ? (_jsxs(Button, { size: "large", block: true, icon: _jsx(FontAwesomeIcon, { icon: faUpload }), children: ["\u00A0 ", buttonText] })) : null;
// interface UploadDraggerBodyProps {
//   text: string;
//   hint: string;
// }
export const UploadDraggerBody = ({ text, hint }) => (_jsxs(Wrapper, { children: [_jsx("p", { className: "ant-upload-drag-icon", children: _jsx(FontAwesomeIcon, { icon: faBox, size: "2x" }) }), _jsx("p", { className: "ant-upload-text", children: text }), _jsx("p", { className: "ant-upload-hint", children: hint })] }));
const Wrapper = styled.div `
  p {
    font-size: 1em !important;
  }
`;
