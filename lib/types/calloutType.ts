import { contentTypes } from "../../models/project/contentTypes";

export type CalloutType = keyof typeof contentTypes.callout.elements.type.options;

export const isCalloutType = (codename: string | undefined): codename is CalloutType =>
  !!codename && Object.keys(contentTypes.callout.elements.type.options).includes(codename);
