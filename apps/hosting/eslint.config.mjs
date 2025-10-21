import { config } from "@servitec-peru/eslint-config/next";

/**
 * Configuración de ESLint para la aplicación hosting (Next.js)
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...config,
  {
    // Reglas personalizadas específicas de esta app si las necesitas
    rules: {
      // Ejemplo: "@next/next/no-html-link-for-pages": "off"
    },
  },
];