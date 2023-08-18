export type PerCollection<T> = Readonly<{
  ficto_healthtech: T;
  ficto_healthtech_imaging: T;
  ficto_healthtech_surgical: T;
  common: T
}>;

export type ValidCollectionCodename = keyof PerCollection<never>;

export const isValidCollectionCodename = (codename: string | undefined): codename is ValidCollectionCodename =>
  Object.keys(emptyCodenames).includes(codename || "");

const emptyCodenames: PerCollection<null> = {
  ficto_healthtech_imaging: null,
  ficto_healthtech_surgical: null,
  ficto_healthtech: null,
  common: null
};

