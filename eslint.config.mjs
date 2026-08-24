import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslint from "@eslint/js";

export default [
  { ignores: ["**/*.ts", "**/dist/*", "*.js", "*.md", "**/node_modules/**"] },
  eslintPluginPrettierRecommended,
  eslint.configs.recommended,
];
