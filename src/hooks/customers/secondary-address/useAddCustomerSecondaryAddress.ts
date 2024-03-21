import useSWRMutation from "swr/mutation";
import { CustomerAddressFormValues } from "../../../components/CustomerAddressForm/CustomerAddressForm";
import {
  CustomerSecondaryAddress,
  addSecondaryAddress,
} from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "./useCustomerSecondaryAddresses";

export const useCustomerAddSecondaryAddress = (customerId?: string) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    CustomerSecondaryAddress,
    Error,
    readonly [string, string] | null,
    CustomerAddressFormValues,
    CustomerSecondaryAddress[]
  >(
    customerId ? ["add-customer-secondary-address", customerId] : null,
    async ([_operation, customerId], { arg: formValues }) => {
      const address = addSecondaryAddress(customerId, formValues);
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
      return address;
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    addCustomerSecondaryAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
