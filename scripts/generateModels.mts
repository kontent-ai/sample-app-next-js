import * as fsPromises from "fs/promises";
import { DefaultResolverType, generateModelsAsync, textHelper } from '@kontent-ai/model-generator';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const createMissingVarErrorMsg = (variableDescription: string) => `Missing ${variableDescription}. Please, make sure it is properly set in your .env.local file or otherwise provided as an environment variable.`

type Style = "camelCase" | "pascalCase" | "camelOrPascalCase";

const byNameResolver = (style: Style) => (obj: Readonly<{ name: string }>) => resolveName(obj.name, style);

const resolveName = (name: string, style: Style) => replaceInvalidChars(textHelper.resolveTextWithDefaultResolver(name, handleCaseSwitch(style, name)));

const upperLetterRegex = /[A-Z]/;
const handleCaseSwitch = (style: Style, name: string): DefaultResolverType => {
  if (style === "camelCase" || style === "pascalCase") {
    return style;
  }

  return upperLetterRegex.test(name[1])
    ? "pascalCase"
    : "camelCase";
}

const replaceInvalidChars = (str: string) => map(replaceIfNeeded, str)

const replaceIfNeeded = (char: string, index: number) => {
  const isValid = index === 0 ? isValidFirstChar : isValidChar;

  return isValid(char) ? char : "_";
};

const firstCharRegex = /[a-zA-Z_$]/;
const isValidFirstChar = (char: string) => firstCharRegex.test(char);

const validCharRegex = /\w$/;
const isValidChar = (char: string) => validCharRegex.test(char);

const map = (mapper: (char: string, index: number) => string, str: string) =>
  str.replaceAll(/./g, mapper);

const {
  KONTENT_MANAGEMENT_API_KEY,
  NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID,
} = process.env;

if (!KONTENT_MANAGEMENT_API_KEY) {
  throw new Error(createMissingVarErrorMsg("management api key"));
}
if (!NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID) {
  throw new Error(createMissingVarErrorMsg("environment id"));
}

console.log("Deleting 'models' directory.");

await fsPromises.rm(new URL("../../models", import.meta.url), { recursive: true, force: true });

console.log("'models' directory deleted. Generating models.");

await generateModelsAsync({
  apiKey: KONTENT_MANAGEMENT_API_KEY,
  sdkType: "delivery",
  projectId: NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID,
  outputDir: "models",
  isEnterpriseSubscription: false,
  addTimestamp: false,
  kontentUrl: "https://manage.devkontentmasters.com/v2",
  elementResolver: (_, elementCodename) => resolveName(elementCodename, "camelCase"),
  contentTypeResolver: byNameResolver("pascalCase"),
  taxonomyTypeResolver: byNameResolver("pascalCase"),
  contentTypeFileResolver: byNameResolver("camelOrPascalCase"),
  taxonomyTypeFileResolver: byNameResolver("camelOrPascalCase"),
  contentTypeSnippetResolver: byNameResolver("pascalCase"),
  contentTypeSnippetFileResolver: byNameResolver("camelOrPascalCase"),
});

console.log("Generating models is finished.");
