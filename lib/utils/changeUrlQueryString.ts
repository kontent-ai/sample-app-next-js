import { NextRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";

export const changeUrlQueryString = (query: ParsedUrlQueryInput, router: NextRouter) => {
  router.replace({ query: query }, undefined, { scroll: false, shallow: true });
}