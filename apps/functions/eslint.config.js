import { config } from "@servitec-peru/eslint-config/node";

/**
 * Configuración de ESLint para Firebase Functions (Node.js)
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...config,
  {
    // Reglas personalizadas específicas de Firebase Functions
    rules: {
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "no-console": "off", // Firebase Functions usa console.log
    },
  },
];