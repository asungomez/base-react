import useSWRMutation from "swr/mutation";
import { CustomerAddressFormValues } from "../../../components/CustomerAddressForm/CustomerAddressForm";
import {
  CustomerSecondaryAddress,
  editSecondaryAddress,
} from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "../address/useCustomerAddresses";

export const useCustomerEditSecondaryAddress = (
  customerId?: string,
  addressId?: string
) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    CustomerSecondaryAddress,
    Error,
    readonly [string, string, string] | null,
    CustomerAddressFormValues
  >(
    customerId && addressId
      ? ["customer-secondary-address", customerId, addressId]
      : null,
    async ([_operation, customerId, addressId], { arg: formValues }) => {
      const address = editSecondaryAddress(customerId, addressId, formValues);
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
      populateCache: true,
    }
  );

  return {
    editCustomerSecondaryAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
