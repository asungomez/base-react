import useSWRMutation from "swr/mutation";
import {
  CustomerAddress,
  deleteMainAddress,
} from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";

export const useDeleteCustomerMainAddress = (customerId: string) => {
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string],
    never,
    CustomerAddress | null
  >(
    ["customer-main-address", customerId],
    async ([_operation, customerId]) => deleteMainAddress(customerId),
    { revalidate: false, populateCache: () => null }
  );

  return {
    deleteCustomerMainAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
