export type PerCollectionCodenames = Readonly<{
  healthtech_medical: string;
  healthtech_imaging: string;
  healthtech_surgical: string;
}>;

export const pageCodenames = {
  aboutUs: {
    healthtech_medical: "about_us",
    healthtech_surgical: "about_us_f1ef38e",
    healthtech_imaging: "about_us_0d30999",
  },
} as const satisfies Record<string, PerCollectionCodenames>;

const emptyCodenames: PerCollectionCodenames = {
  healthtech_imaging: "",
  healthtech_surgical: "",
  healthtech_medical: "",
};

export type ValidCollectionCodename = keyof PerCollectionCodenames;

export const isValidCollectionCodename = (codename: string | undefined): codename is ValidCollectionCodename =>
  Object.keys(emptyCodenames).includes(codename || "");
