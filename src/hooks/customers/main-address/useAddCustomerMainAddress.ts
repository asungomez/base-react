import useSWRMutation from "swr/mutation";
import { CustomerAddressFormValues } from "../../../components/CustomerAddressForm/CustomerAddressForm";
import {
  CustomerAddress,
  CustomerSecondaryAddress,
  addMainAddress,
} from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "../address/useCustomerAddresses";

export const useAddCustomerMainAddress = (customerId: string | undefined) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    CustomerAddress,
    Error,
    readonly [string, string] | null,
    CustomerAddressFormValues
  >(
    customerId ? ["customer-main-address", customerId] : null,
    async ([_operation, customerId], { arg: formValues }) => {
      const address = await addMainAddress(customerId, formValues);
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
    { revalidate: false, populateCache: true }
  );

  return {
    addCustomerMainAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
