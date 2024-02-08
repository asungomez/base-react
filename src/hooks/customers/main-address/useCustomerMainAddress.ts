import useSWR from "swr";
import { CustomerAddress, getMainAddress } from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";

export const useCustomerMainAddress = (customerId: string) => {
  const {
    data: customerMainAddress,
    error,
    isLoading: loading,
  } = useSWR<CustomerAddress, Error, readonly [string, string]>(
    ["customer-main-address", customerId],
    async ([_operation, customerId]) => getMainAddress(customerId)
  );

  return {
    customerMainAddress,
    error: extractErrorCode(error),
    loading,
  };
};
