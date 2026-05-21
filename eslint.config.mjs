import kontentAiConfig from "@kontent-ai/eslint-config";
import kontentAiReactConfig from "@kontent-ai/eslint-config/react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "middleware.ts"],
    extends: [kontentAiConfig, kontentAiReactConfig],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "react/jsx-max-props-per-line": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "react/jsx-wrap-multilines": "off",
    },
  },
]);
