// filepath: c:\Users\kaued\Documents\1-FATEC\4-SEMESTRE\2-API\API-4-BACK\eslint.config.mjs
import { defineConfig } from "eslint/config";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";

export default defineConfig([
  {
    files: ["**/*.ts"], // Configuração para arquivos TypeScript
    languageOptions: {
      parser: typescriptEslintParser, // Define o parser para TypeScript
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error", // Aviso para variáveis não utilizadas no TypeScript
      "@typescript-eslint/explicit-function-return-type": "warn", // Não exige tipo de retorno explícito
      "@typescript-eslint/no-explicit-any": "off", // Aviso para uso do tipo `any`
      "no-console": ["warn", { "allow": ["warn", "error"] }], // Não permite o uso de console.log
      "eqeqeq": "error", // Exige o uso de === e !==
    },
  },
]);