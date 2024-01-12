import useSWR from "swr";
import { Customer, getCustomer } from "../services/customers";
import { ErrorCode, extractErrorCode } from "../services/error";

type CustomerHookReturn = {
  customer: Customer | undefined;
  error: ErrorCode | null;
  loading: boolean;
};

export const useCustomer = (id: string | undefined): CustomerHookReturn => {
  const {
    data: customer,
    error,
    isLoading: loading,
  } = useSWR<Customer, Error, readonly [string, string] | null>(
    id ? ["customer", id] : null,
    async ([_operation, id]) => getCustomer(id),
    { revalidateOnMount: false, revalidateOnFocus: false }
  );

  return {
    customer,
    error: extractErrorCode(error),
    loading,
  };
};
