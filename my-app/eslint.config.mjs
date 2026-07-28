import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".open-next/**",
    ".wrangler/**",
    "public/scrape/**",
    "public/about/**",
    "public/blogs/**",
    "public/book-a-trip/**",
    "public/destinations/**",
    "public/generated-plan/**",
    "public/policies/**",
    "public/tours/**",
    "public/404/**",
    "public/framerusercontent.com/**",
    "public/fonts.gstatic.com/**",
    "public/index.html",
  ]),
]);

export default eslintConfig;
