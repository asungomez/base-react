import useSWR from "swr";
import {
  CustomerSecondaryAddress,
  getSecondaryAddresses,
} from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";

export const useCustomerSecondaryAddresses = (customerId: string) => {
  const {
    data: customerSecondaryAddresses,
    error,
    isLoading: loading,
  } = useSWR<CustomerSecondaryAddress[], Error, readonly [string, string]>(
    ["customer-secondary-addresses", customerId],
    async ([_operation, customerId]) => getSecondaryAddresses(customerId)
  );

  return {
    customerSecondaryAddresses,
    error: extractErrorCode(error),
    loading,
  };
};
