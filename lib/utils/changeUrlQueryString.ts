import { NextRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";

export const changeUrlQueryString = (query: ParsedUrlQueryInput, router: NextRouter) => {
  const { envId, ...restQuery } = query; // get rid of envId
  const asPath = {
    pathname: router.asPath.split('?')[0],
    query: restQuery,
  };
  router.replace({ query: query }, asPath, { scroll: false, shallow: true });
}