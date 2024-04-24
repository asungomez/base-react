import useSWR from "swr";
import { CustomerAddress, getMainAddress } from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";

export const useCustomerMainAddress = (customerId: string | undefined) => {
  const {
    data: customerMainAddress,
    error,
    isLoading: loading,
  } = useSWR<CustomerAddress, Error, readonly [string, string] | null>(
    customerId ? ["customer-main-address", customerId] : null,
    async ([_operation, customerId]) => getMainAddress(customerId)
  );

  return {
    customerMainAddress,
    error: extractErrorCode(error),
    loading,
  };
};
