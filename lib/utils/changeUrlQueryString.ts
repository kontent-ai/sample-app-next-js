import { NextRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";

export const changeUrlQueryString = (query: ParsedUrlQueryInput, router: NextRouter, as?: string) => {
  router.replace({ query: query }, as ?? undefined, { scroll: false, shallow: true });
}