import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { GlobalStyle, theme } from "./styles";
import { ThemeProvider } from "styled-components";
import { ConfigProvider } from "antd";
import { darken, lighten } from "polished";

// const config = {
//   components: {
//     Button: {
//       colorPrimary: theme.colors.primary,
//       colorPrimaryHover: theme.colors.secondary,
//       colorPrimaryActive: theme.colors.secondary,
//     },
//     Drawer: {
//       colorBgElevated: darken(0.1, theme.colors.secondary),
//       colorIcon: "#fff",
//       colorIconHover: "rgba(255,255,255,0.69)",
//       algorithm: true,
//     },
//     Menu: {
//       colorPrimary: theme.colors.secondary,
//       colorPrimaryHover: lighten(0.05, theme.colors.secondary),
//       itemHoverBg: lighten(0.02, theme.colors.secondary),
//       colorBgElevated: darken(0.1, theme.colors.secondary),
//       itemBg: darken(0.1, theme.colors.secondary),
//       subMenuItemBg: darken(0.14, theme.colors.secondary),
//       colorText: theme.colors.white,
//       itemColor: theme.colors.white,
//       itemSelectedBg: darken(0.12, theme.colors.secondary),
//       itemSelectedColor: "rgb(255,255,255)",
//       colorTextDescription: "rgba(253,253,253,0.45)",
//       itemActiveBg: "rgb(233,252,224)",
//       horizontalItemSelectedColor: lighten(0.02, theme.colors.primary),
//       horizontalItemHoverColor: lighten(0.05, theme.colors.primary),
//       colorPrimaryBorder: lighten(0.02, theme.colors.primary),
//       algorithm: true,
//     },
//     Tabs: {
//       colorPrimary: theme.colors.primary,
//       colorPrimaryHover: theme.colors.secondary,
//       colorPrimaryActive: theme.colors.secondary,
//     },
//     Card: {
//       colorFillAlter: theme.colors.secondary,
//       colorTextHeading: "white",
//     },
//     Steps: {
//       colorPrimary: theme.colors.primary,
//     },
//   },
// };

const config = {
  components: {
    Button: {
      colorPrimary: theme.colors.primary, // #FFC107
      colorPrimaryHover: lighten(0.1, theme.colors.primary),
      colorPrimaryActive: darken(0.1, theme.colors.primary),
      colorText: theme.colors.font1,
    },
    Drawer: {
      colorBgElevated: "#0F1419",
      colorIcon: theme.colors.font1,
      colorIconHover: theme.colors.primary, // Hover amarillo
      colorText: theme.colors.font1,
      algorithm: true,
    },
    Menu: {
      colorPrimary: theme.colors.primary, // #FFC107
      colorPrimaryHover: lighten(0.05, theme.colors.primary),
      itemHoverBg: lighten(0.05, theme.colors.secondary),
      colorBgElevated: theme.colors.secondary,
      itemBg: theme.colors.secondary,
      subMenuItemBg: darken(0.02, theme.colors.secondary),
      colorText: theme.colors.font1,
      itemColor: theme.colors.font2,
      itemSelectedBg: lighten(0.08, theme.colors.secondary),
      itemSelectedColor: theme.colors.primary, // Amarillo seleccionado
      colorTextDescription: theme.colors.font2,
      itemActiveBg: lighten(0.05, theme.colors.secondary),
      horizontalItemSelectedColor: theme.colors.primary,
      horizontalItemHoverColor: lighten(0.1, theme.colors.primary),
      colorPrimaryBorder: theme.colors.primary,
      algorithm: true,
    },
    Tabs: {
      colorPrimary: theme.colors.primary, // #FFC107
      colorPrimaryHover: lighten(0.1, theme.colors.primary),
      colorPrimaryActive: darken(0.1, theme.colors.primary),
      colorText: theme.colors.font2,
      colorTextHeading: theme.colors.font1,
    },
    Card: {
      colorBgContainer: theme.colors.secondary,
      colorBorderSecondary: lighten(0.1, theme.colors.secondary),
      colorTextHeading: theme.colors.font1,
      colorText: theme.colors.font2,
    },
    Steps: {
      colorPrimary: theme.colors.primary, // #FFC107
      colorText: theme.colors.font2,
      colorTextDescription: theme.colors.font2,
    },
  },
  token: {
    colorBgBase: theme.colors.dark,
    colorTextBase: theme.colors.font1,
    colorBorder: lighten(0.15, theme.colors.secondary),
    colorBgElevated: lighten(0.03, theme.colors.secondary),
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ConfigProvider theme={config}>
        <GlobalStyle />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </ThemeProvider>
  </StrictMode>
);
