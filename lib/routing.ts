export type PerCollectionCodenames = Readonly<{
  healthtech: string | null;
  healthtech_imaging: string | null;
  healthtech_surgical: string | null;
}>;

export const pageCodenames = {
  "about-us": {
    healthtech: "about_us",
    healthtech_surgical: "about_us_0d30999",
    healthtech_imaging: "about_us_f1ef38e",
  },
  "terms": {
    healthtech: "terms_and_conditions",
    healthtech_surgical: null,
    healthtech_imaging: null,
  },
} as const satisfies Record<string, PerCollectionCodenames>;

const emptyCodenames: PerCollectionCodenames = {
  healthtech_imaging: "",
  healthtech_surgical: "",
  healthtech: "",
};

export type ValidCollectionCodename = keyof PerCollectionCodenames;

export const isValidCollectionCodename = (codename: string | undefined): codename is ValidCollectionCodename =>
  Object.keys(emptyCodenames).includes(codename || "");
