export const parseBoolean = (str: string | string[] | undefined) => {
    if (typeof str !== "string" || !["true", "false"].includes(str)) {
      return null;
    }
    return str === "true";
  }