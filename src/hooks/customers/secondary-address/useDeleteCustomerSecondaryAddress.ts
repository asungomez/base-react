import useSWRMutation from "swr/mutation";
import {
  CustomerSecondaryAddress,
  deleteSecondaryAddress,
} from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "./useCustomerSecondaryAddresses";

export const useDeleteCustomerSecondaryAddress = (
  customerId: string,
  addressId: string
) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    never,
    CustomerSecondaryAddress[]
  >(
    ["delete-customer-secondary-address", customerId],
    async ([_operation, customerId]) => {
      await deleteSecondaryAddress(customerId, addressId);
      await mutate<
        readonly [string, string, string | undefined],
        {
          items: CustomerSecondaryAddress[];
          nextToken?: string;
        } | null
      >(
        // Temporary solution: https://github.com/vercel/swr/issues/1156
        unstable_serialize(keyFunctionGenerator(customerId)),
        () => undefined,
        {
          revalidate: true,
          populateCache: false,
        }
      );
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    deleteCustomerSecondaryAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
