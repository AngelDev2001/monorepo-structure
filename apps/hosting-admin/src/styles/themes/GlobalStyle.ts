import { createGlobalStyle, css } from "styled-components";
import { mediaQuery } from "../constants";
import { lighten } from "polished";
import { theme } from "./theme.ts";

const global = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: ${() => theme.colors.dark};
    font-size: 15px;
    overflow-x: hidden;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    color: ${() => theme.colors.font2};
  }

  h1,
  h2,
  h3 {
    color: ${() => theme.colors.font1};
  }

  h4,
  h5,
  h6 {
    color: ${() => theme.colors.font2};
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    line-height: 3.4rem;
  }

  h2 {
    font-size: 1.7rem;
    font-weight: bold;
    line-height: 2.2rem;
  }

  h3 {
    font-size: 1.3rem;
    font-weight: bold;
  }

  h4 {
    font-size: 1.1rem;
    font-weight: bold;
  }

  h5 {
    font-size: 1rem;
    font-weight: bold;
  }

  .link-color {
    color: ${() => theme.colors.font3};
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: ${() => theme.colors.primary};
    }
  }

  .d-flex {
    display: flex;
  }

  .pointer {
    cursor: pointer;
  }

  .capitalize {
    text-transform: capitalize;
  }

  .data-entry-modal {
    pointer-events: none;
  }

  /* Ant Design Global Overrides */
  .ant-input,
  .ant-input-number,
  .ant-select-selector,
  .ant-picker {
    background: ${() => lighten(0.02, theme.colors.secondary)} !important;
    border-color: ${() => lighten(0.1, theme.colors.secondary)} !important;
    color: ${() => theme.colors.font1} !important;

    &:hover {
      border-color: ${() => theme.colors.primary} !important;
    }

    &:focus,
    &.ant-input-focused,
    &.ant-select-focused .ant-select-selector {
      border-color: ${() => theme.colors.primary} !important;
      box-shadow: 0 0 0 2px ${() => theme.colors.primary}20 !important;
    }

    &::placeholder {
      color: ${() => theme.colors.gray} !important;
    }
  }

  .ant-select-arrow,
  .ant-picker-suffix {
    color: ${() => theme.colors.font2} !important;
  }

  .ant-select-dropdown,
  .ant-picker-dropdown {
    background: ${() => theme.colors.secondary} !important;
    border: 1px solid ${() => lighten(0.1, theme.colors.secondary)} !important;
  }

  .ant-select-item {
    color: ${() => theme.colors.font2} !important;

    &:hover {
      background: ${() => lighten(0.05, theme.colors.secondary)} !important;
    }

    &.ant-select-item-option-selected {
      background: ${() => lighten(0.08, theme.colors.secondary)} !important;
      color: ${() => theme.colors.primary} !important;
    }
  }

  .ant-modal-content {
    background: ${() => theme.colors.secondary} !important;
    color: ${() => theme.colors.font1} !important;
  }

  .ant-modal-header {
    background: ${() => theme.colors.secondary} !important;
    border-bottom: 1px solid ${() => lighten(0.1, theme.colors.secondary)} !important;

    .ant-modal-title {
      color: ${() => theme.colors.font1} !important;
    }
  }

  .ant-modal-close {
    color: ${() => theme.colors.font2} !important;

    &:hover {
      color: ${() => theme.colors.primary} !important;
    }
  }

  .ant-modal-footer {
    border-top: 1px solid ${() => lighten(0.1, theme.colors.secondary)} !important;
  }

  .ant-table {
    background: transparent !important;
    color: ${() => theme.colors.font2} !important;

    .ant-table-thead > tr > th {
      background: ${() => lighten(0.05, theme.colors.secondary)} !important;
      color: ${() => theme.colors.font1} !important;
      border-bottom: 1px solid ${() => lighten(0.1, theme.colors.secondary)} !important;
    }

    .ant-table-tbody > tr > td {
      border-bottom: 1px solid ${() => lighten(0.05, theme.colors.secondary)} !important;
    }

    .ant-table-tbody > tr:hover > td {
      background: ${() => lighten(0.03, theme.colors.secondary)} !important;
    }
  }

  .ant-pagination {
    .ant-pagination-item {
      background: ${() => theme.colors.secondary} !important;
      border-color: ${() => lighten(0.1, theme.colors.secondary)} !important;

      a {
        color: ${() => theme.colors.font2} !important;
      }

      &:hover {
        border-color: ${() => theme.colors.primary} !important;

        a {
          color: ${() => theme.colors.primary} !important;
        }
      }

      &.ant-pagination-item-active {
        background: ${() => theme.colors.primary} !important;
        border-color: ${() => theme.colors.primary} !important;

        a {
          color: ${() => theme.colors.black} !important;
        }
      }
    }

    .ant-pagination-prev,
    .ant-pagination-next {
      button {
        background: ${() => theme.colors.secondary} !important;
        border-color: ${() => lighten(0.1, theme.colors.secondary)} !important;
        color: ${() => theme.colors.font2} !important;

        &:hover {
          border-color: ${() => theme.colors.primary} !important;
          color: ${() => theme.colors.primary} !important;
        }
      }
    }
  }

  .ant-form-item-label > label {
    color: ${() => theme.colors.font1} !important;
  }

  .ant-form-item-explain-error {
    color: ${() => theme.colors.error} !important;
  }

  .ant-btn-default {
    background: ${() => theme.colors.secondary} !important;
    border-color: ${() => lighten(0.1, theme.colors.secondary)} !important;
    color: ${() => theme.colors.font1} !important;

    &:hover {
      border-color: ${() => theme.colors.primary} !important;
      color: ${() => theme.colors.primary} !important;
    }
  }

  .ant-notification-notice {
    background: ${() => theme.colors.secondary} !important;
    border: 1px solid ${() => lighten(0.1, theme.colors.secondary)} !important;

    .ant-notification-notice-message {
      color: ${() => theme.colors.font1} !important;
    }

    .ant-notification-notice-description {
      color: ${() => theme.colors.font2} !important;
    }
  }

  .ant-message-notice-content {
    background: ${() => theme.colors.secondary} !important;
    color: ${() => theme.colors.font1} !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  }
`;

const antd = {
  datePicker: css`
    .ant-picker-panel-container {
      background: ${() => theme.colors.secondary} !important;
      border: 1px solid ${() => lighten(0.1, theme.colors.secondary)} !important;
    }

    .ant-picker-header {
      border-bottom: 1px solid ${() => lighten(0.05, theme.colors.secondary)} !important;
      color: ${() => theme.colors.font1} !important;

      button {
        color: ${() => theme.colors.font2} !important;

        &:hover {
          color: ${() => theme.colors.primary} !important;
        }
      }
    }

    .ant-picker-content {
      th {
        color: ${() => theme.colors.font2} !important;
      }
    }

    .ant-picker-cell {
      color: ${() => theme.colors.font2} !important;

      &:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-disabled)
        .ant-picker-cell-inner {
        background: ${() => lighten(0.05, theme.colors.secondary)} !important;
      }
    }

    .ant-picker-cell-in-view {
      color: ${() => theme.colors.font1} !important;
    }

    .ant-picker-cell-selected .ant-picker-cell-inner {
      background: ${() => theme.colors.primary} !important;
      color: ${() => theme.colors.black} !important;
    }

    .ant-picker-cell-today .ant-picker-cell-inner::before {
      border: 1px solid ${() => theme.colors.primary} !important;
    }

    .ant-picker-today-btn {
      color: ${() => theme.colors.primary} !important;
    }

    .ant-picker-footer {
      border-top: 1px solid ${() => lighten(0.05, theme.colors.secondary)} !important;
    }
  `,
  radio: css`
    .ant-radio-wrapper {
      color: ${() => theme.colors.font2} !important;
    }

    .ant-radio-inner {
      background: ${() => theme.colors.secondary} !important;
      border-color: ${() => theme.colors.gray} !important;
    }

    .ant-radio-checked .ant-radio-inner {
      border-color: ${() => theme.colors.primary} !important;
      background-color: ${() => theme.colors.primary} !important;

      &::after {
        background-color: ${() => theme.colors.black} !important;
      }

      &:hover {
        border-color: ${() => theme.colors.primary} !important;
      }
    }

    .ant-radio:hover .ant-radio-inner {
      border-color: ${() => theme.colors.primary} !important;
    }
  `,
  checkbox: css`
    .ant-checkbox-wrapper {
      color: ${() => theme.colors.font2} !important;
    }

    .ant-checkbox-inner {
      background: ${() => theme.colors.secondary} !important;
      border-color: ${() => theme.colors.gray} !important;
    }

    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: ${() => theme.colors.primary} !important;
      border-color: ${() => theme.colors.primary} !important;

      &::after {
        border-color: ${() => theme.colors.black} !important;
      }
    }

    .ant-checkbox-wrapper:hover .ant-checkbox-inner,
    .ant-checkbox:hover .ant-checkbox-inner,
    .ant-checkbox-input:focus + .ant-checkbox-inner {
      border-color: ${() => theme.colors.primary} !important;
    }

    .ant-checkbox-checked::after {
      border-color: ${() => theme.colors.primary} !important;
    }
  `,
  switch: css`
    .ant-switch {
      background-color: ${() => theme.colors.gray} !important;

      &:hover {
        background-color: ${() => lighten(0.1, theme.colors.gray)} !important;
      }
    }

    .ant-switch-checked {
      background-color: ${() => theme.colors.primary} !important;

      &:hover {
        background-color: ${() =>
          lighten(0.1, theme.colors.primary)} !important;
      }
    }

    .ant-switch-inner {
      color: ${() => theme.colors.white} !important;
    }
  `,
  dropdown: css`
    .ant-dropdown {
      background: ${() => theme.colors.secondary} !important;
      border: 1px solid ${() => lighten(0.1, theme.colors.secondary)} !important;
    }

    .ant-dropdown-menu {
      background: ${() => theme.colors.secondary} !important;
    }

    .ant-dropdown-menu-item,
    .ant-dropdown-menu-submenu-title {
      color: ${() => theme.colors.font2} !important;

      &:hover {
        background: ${() => lighten(0.05, theme.colors.secondary)} !important;
        color: ${() => theme.colors.primary} !important;
      }
    }

    .ant-dropdown-menu-item-divider {
      background: ${() => lighten(0.1, theme.colors.secondary)} !important;
    }
  `,
  card: css`
    .ant-card {
      background: ${() => theme.colors.secondary} !important;
      border: 1px solid ${() => lighten(0.05, theme.colors.secondary)} !important;
    }

    .ant-card-head {
      border-bottom: 1px solid ${() => lighten(0.08, theme.colors.secondary)} !important;
      color: ${() => theme.colors.font1} !important;

      .ant-card-head-title {
        color: ${() => theme.colors.font1} !important;
      }
    }

    .ant-card-body {
      color: ${() => theme.colors.font2} !important;
    }

    .ant-card-bordered {
      border: 1px solid ${() => lighten(0.08, theme.colors.secondary)} !important;
    }
  `,
};

const scroll = css`
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${() => theme.colors.secondary};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${() => theme.colors.gray};
    transition: background 0.2s ease;

    &:hover {
      background: ${() => theme.colors.primary};
    }
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`;

export const GlobalStyle = createGlobalStyle`
    ${global}
    ${Object.values(antd).map((antdComponent) => antdComponent)}
    ${mediaQuery.minTablet}{
        ${scroll}
    }
`;
