import * as fsPromises from "fs/promises";
import { generateDeliveryModelsAsync, generateEnvironmentModelsAsync, resolveCase } from '@kontent-ai/model-generator';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const createMissingVarErrorMsg = (variableDescription: string) => `Missing ${variableDescription}. Please, make sure it is properly set in your .env.local file or otherwise provided as an environment variable.`

const byNameResolver = (obj: Readonly<{ name: string }>, style: 'pascalCase' | 'camelCase') =>  createPrefixFromName(obj.name) + resolveCase(obj.name, style);

const createPrefixFromName = (str: string) => {
  switch (str.codePointAt(0)) {
    case 0x1F9F1:
      return "Block_";

    case 0x1F9E9:
      return "Component_";

    case 0x1F4A1:
      return "LP_"

    case 0x1F9ED:
      return "Nav_"

    default:
      return "";
  }
};

const KONTENT_MANAGEMENT_API_KEY = process.env.KONTENT_MANAGEMENT_API_KEY;
const  NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID = process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID;
const  NEXT_PUBLIC_KONTENT_DOMAIN = process.env.NEXT_PUBLIC_KONTENT_DOMAIN;
const  NEXT_PUBLIC_KONTENT_MAPI_DOMAIN = process.env.NEXT_PUBLIC_KONTENT_MAPI_DOMAIN;

if (!KONTENT_MANAGEMENT_API_KEY) {
  throw new Error(createMissingVarErrorMsg("management api key"));
}
if (!NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID) {
  throw new Error(createMissingVarErrorMsg("environment id"));
}
if (!NEXT_PUBLIC_KONTENT_DOMAIN && !NEXT_PUBLIC_KONTENT_MAPI_DOMAIN) {
  throw new Error(createMissingVarErrorMsg("management api domain"))
}

console.log("Deleting 'models' directory.");

await fsPromises.rm(new URL("../../models", import.meta.url), { recursive: true, force: true });

console.log("'models' directory deleted. Generating models.");

await generateDeliveryModelsAsync({
  apiKey: KONTENT_MANAGEMENT_API_KEY,
  environmentId: NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID,
  moduleFileExtension: "ts",
  formatOptions: {
    tabWidth: 2,
    parser: "typescript",
  },
  outputDir: "models",
  addTimestamp: false,
  baseUrl: `${NEXT_PUBLIC_KONTENT_DOMAIN ? `https://manage.${NEXT_PUBLIC_KONTENT_DOMAIN}` : NEXT_PUBLIC_KONTENT_MAPI_DOMAIN}/v2`,
  fileResolvers: {
    contentType: (obj) => byNameResolver(obj, 'camelCase'),
    taxonomy: (obj) => byNameResolver(obj, 'camelCase'),
    snippet: (obj) => byNameResolver(obj, 'camelCase'),
  },
  nameResolvers: {
    contentType: (obj) => byNameResolver(obj, 'pascalCase'),  
    taxonomy: (obj) => byNameResolver(obj, 'pascalCase'),
    snippet: (obj) => byNameResolver(obj, 'pascalCase'),
  }
});

await generateEnvironmentModelsAsync({
  apiKey: KONTENT_MANAGEMENT_API_KEY,
  environmentId: NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID,
  moduleFileExtension: "ts",
  isEnterpriseSubscription: false,
  formatOptions: {
    tabWidth: 2,
    parser: "typescript",
  },
  outputDir: "models/environment",
  addTimestamp: false,
  baseUrl: `${NEXT_PUBLIC_KONTENT_DOMAIN ? `https://manage.${NEXT_PUBLIC_KONTENT_DOMAIN}` : NEXT_PUBLIC_KONTENT_MAPI_DOMAIN}/v2`,
});

await fsPromises.appendFile('./models/index.ts', `export * from "./environment/index.ts";`);

console.log("Generating models is finished.");
