import nextPlugin from "@next/eslint-plugin-next";
import { config as baseConfig } from "./base.js";

/**
 * Configuración de ESLint para aplicaciones Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
    ...baseConfig,
    {
        plugins: {
            "@next/next": nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,
        },
    },
    {
        ignores: ["next-env.d.ts"],
    },
];