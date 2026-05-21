import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    // ts-jest forces a CommonJS program; under TypeScript 6 that surfaces the
    // node10 resolution deprecation and an ambiguous rootDir. Both are scoped here.
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          ignoreDeprecations: "6.0",
          rootDir: ".",
        },
      },
    ],
  },
  testMatch: ["**/tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};

export default config;
