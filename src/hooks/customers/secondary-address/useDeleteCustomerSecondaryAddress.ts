import useSWRMutation from "swr/mutation";
import {
  CustomerSecondaryAddress,
  deleteSecondaryAddress,
} from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";

export const useDeleteCustomerSecondaryAddress = (
  customerId: string,
  addressId: string
) => {
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    never,
    CustomerSecondaryAddress[]
  >(
    ["customer-secondary-addresses", customerId],
    async ([_operation, customerId]) =>
      deleteSecondaryAddress(customerId, addressId),
    {
      revalidate: true,
      populateCache: false,
      optimisticData: (addresses?: CustomerSecondaryAddress[]) =>
        addresses?.filter((address) => address.id !== addressId) ?? [],
    }
  );

  return {
    deleteCustomerSecondaryAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
