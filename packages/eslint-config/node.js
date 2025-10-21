import pluginImport from "eslint-plugin-import";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * Configuración de ESLint para aplicaciones Node.js (Firebase Functions).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
    ...baseConfig,
    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es6,
            },
        },
    },
    {
        plugins: {
            import: pluginImport,
        },
        settings: {
            "import/resolver": {
                typescript: true,
                node: true,
            },
        },
        rules: {
            "import/no-unresolved": "off",
            "import/order": [
                "warn",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                    ],
                    "newlines-between": "always",
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],
            quotes: ["error", "double"],
            indent: ["error", 2],
            "no-console": "off",
        },
    },
];