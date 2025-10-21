export const theme = {
  font_weight: {
    small: "400",
    medium: "500",
    large: "700",
  },
  border_radius: {
    xx_small: ".3em",
    x_small: ".5em",
    small: ".7em",
    medium: ".9em",
    large: "1em",
    x_large: "1.2em",
    xx_large: "1.4em",
    xxx_large: "1.7em",
    percentage_medium: "50%",
    percentage_full: "100%",
  },
  paddings: {
    xx_small: ".3em",
    x_small: ".5em",
    small: ".7em",
    medium: ".9em",
    large: "1em",
    x_large: "1.2em",
    xx_large: "1.4em",
    xxx_large: "1.7em",
  },
  font_sizes: {
    xxx_small: ".6em",
    xx_small: ".7em",
    x_small: ".8em",
    small: "1em",
    medium: "1.1em",
    large: "1.3em",
    x_large: "1.4em",
    xx_large: "1.6em",
    xxx_large: "1.8em",
  },
  // colors: {
  //   primary: "#FFC107",
  //   secondary: "#000000",
  //   tertiary: "#FFFFFF",
  //
  //   font1: "#333333",
  //   font2: "#E0E0E0",
  //   font3: "#007BFF",
  //
  //   success: "#0ECB81",
  //   info: "#0795FF",
  //   warning: "#FF9800",
  //   error: "#F6465D",
  //
  //   black: "#090B0D",
  //   white: "#FFFFFF",
  //   dark: "#090B0D",
  //   light: "#ECECEC",
  //   gray: "#79838C",
  // },
  colors: {
    // Colores principales - IDENTIDAD SERVITEC
    primary: "#FFC107", // Amarillo corporativo del logo ⭐
    secondary: "#1A1D23", // Gris oscuro para fondos
    tertiary: "#F5F5F5", // Blanco suave

    // Fuentes optimizadas para dark mode
    font1: "#E8E8E8", // Texto principal claro
    font2: "#9CA3AF", // Texto secundario (gris medio)
    font3: "#FFC107", // Links/acciones en amarillo corporativo 🔗

    // Estados - Mantienen buena visibilidad
    success: "#10B981", // Verde
    info: "#3B82F6", // Azul (este es el "azulino" que mencionas)
    warning: "#F59E0B", // Naranja advertencia
    error: "#EF4444", // Rojo

    // Bases
    black: "#0F1419", // Negro suave
    white: "#FFFFFF",
    dark: "#1A1D23", // Fondo principal dark
    light: "#F9FAFB", // Fondos claros
    gray: "#6B7280", // Gris neutro
  },
} as const;
