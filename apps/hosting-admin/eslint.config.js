import { config } from "@servitec-peru/eslint-config/react";

/**
 * Configuración de ESLint para la aplicación hosting-admin (React + Vite)
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...config,
  {
    // Reglas personalizadas específicas de esta app si las necesitas
    rules: {
      // Ejemplo: "react/prop-types": "off"
    },
  },
];