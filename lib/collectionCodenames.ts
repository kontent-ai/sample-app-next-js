export type PerCollectionCodenames = Readonly<{
  healthtech: string;
  healthtech_imaging: string;
  healthtech_surgical: string;
}>;

export const pageCodenames = {
  aboutUs: {
    healthtech: "about_us",
    healthtech_surgical: "about_us_0d30999",
    healthtech_imaging: "about_us_f1ef38e",
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
