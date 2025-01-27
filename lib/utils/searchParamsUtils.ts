import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Updates the search parameters of a URL.
 *
 * @param {ReadonlyURLSearchParams} originalSearchParams - The original search parameters. To create new params from scratch use `new URLSearchParams()`.
 * @param {Record<string, ReadonlyArray<string> | null>} newValues - The new values to update the search parameters with.
 * @returns {ReadonlyURLSearchParams} The updated search parameters.
 */
export const updateSearchParams = (originalSearchParams: ReadonlyURLSearchParams, newValues: Record<string, ReadonlyArray<string> | null>) => {
  const params = new URLSearchParams(originalSearchParams?.toString());

  Object.entries(newValues).forEach(([name, value]) => {
    if (!value) {
      params.delete(name);
      return params.toString();
    }
    
    params.delete(name);
    value.forEach((val) => params.append(name, val));
  })

  return params;
}
