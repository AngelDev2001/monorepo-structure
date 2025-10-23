import useFetch, { CachePolicies } from "use-http";
import { apiUrl } from "../firebase";

type Options = { cachePolicy: CachePolicies };

export function useApi(pathname: string, deps = []) {
  const options: Options = {
    cachePolicy: CachePolicies.NO_CACHE,
  };

  return useFetch(apiUrl + pathname, options, deps);
}
