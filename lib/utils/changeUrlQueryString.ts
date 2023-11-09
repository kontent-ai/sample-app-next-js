import { Url } from "next/dist/shared/lib/router/router";
import { NextRouter } from "next/router";
import { ParsedUrlQueryInput } from "querystring";

/**
 * Helper method for shallow client routing.
 * Adds query parameters without including `envId` in the path.
 *
 * @param query Parsed query parameters from the router.
 * @param router Instance of NextRouter.
 */
export const changeUrlQueryString = (query: ParsedUrlQueryInput, router: NextRouter) => {
  // Clone the query object to avoid mutating the original
  const newQuery = { ...query };
  // Delete the envId property
  delete newQuery.envId;

  const asPath: Url = {
    // nextJS mixes path and query params, this ensure envId is not in the pathname
    pathname: router.asPath.split('?')[0],
    query: newQuery,
  };
  router.replace({ query: query }, asPath, { scroll: false, shallow: true });
}
