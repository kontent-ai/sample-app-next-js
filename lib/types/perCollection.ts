import { contentTypes } from "../../models";

export type PerCollection<T> = Readonly<{
  ficto_healthtech: T;
  ficto_imaging: T;
  ficto_surgical: T;
}>;

export type ValidCollectionCodename = keyof PerCollection<never>;

export const isValidCollectionCodename = (codename: string | undefined): codename is ValidCollectionCodename =>
  Object.keys(emptyCodenames).includes(codename || "");

const emptyCodenames: PerCollection<null> = {
  ficto_imaging: null,
  ficto_surgical: null,
  ficto_healthtech: null,
};

export type CalloutType = keyof typeof contentTypes.callout.elements.type.options;

export const isCalloutType = (codename: string | undefined): codename is CalloutType => 
  !!codename && Object.keys(contentTypes.callout.elements.type.options).includes(codename);