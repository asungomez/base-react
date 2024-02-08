import useSWRInfinite from "swr/infinite";
import { extractErrorCode } from "../../services/error";
import { Customer, getCustomers } from "../../services/customers";

export const useCustomers = (searchInput?: string) => {
  const {
    data,
    error,
    isLoading: loading,
    isValidating: loadingMore,
    setSize,
  } = useSWRInfinite<
    {
      customers: Customer[];
      nextToken?: string;
    },
    Error,
    (
      index: number,
      previousPageData: {
        customers: Customer[];
        nextToken?: string;
      } | null
    ) => readonly [string, string | undefined, string | undefined]
  >(
    (_index, previousRequest) => [
      "customers",
      previousRequest?.nextToken,
      searchInput,
    ],
    async ([_operation, nextToken, searchInput]) =>
      getCustomers(nextToken, searchInput)
  );

  const loadMore = () => setSize((size) => size + 1);

  const customers: Customer[] =
    data?.reduce((acc, { customers }) => {
      return [...acc, ...customers];
    }, [] as Customer[]) ?? [];

  const moreToLoad = !!data?.[data.length - 1].nextToken;

  return {
    customers,
    moreToLoad,
    error: extractErrorCode(error),
    loading,
    loadMore,
    loadingMore,
  };
};
