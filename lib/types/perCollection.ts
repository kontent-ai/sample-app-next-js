export type PerCollection<T> = Readonly<{
  healthtech: T;
  healthtech_imaging: T;
  healthtech_surgical: T;
}>;

export type ValidCollectionCodename = keyof PerCollection<never>;

export const isValidCollectionCodename = (codename: string | undefined): codename is ValidCollectionCodename =>
  Object.keys(emptyCodenames).includes(codename || "");

const emptyCodenames: PerCollection<null> = {
  healthtech_imaging: null,
  healthtech_surgical: null,
  healthtech: null,
};

