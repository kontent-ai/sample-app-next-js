import { Component_Callout } from "../../models";
import { contentTypes } from "../../models/environment/contentTypes";

export type CalloutType = Component_Callout["elements"]["type"]["value"][0]["codename"];

export const isCalloutType = (codename: string | undefined): codename is CalloutType =>
  !!codename && Object.keys(contentTypes.callout.elements.type.options).includes(codename);
