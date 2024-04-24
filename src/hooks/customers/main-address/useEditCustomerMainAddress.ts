import useSWRMutation from "swr/mutation";
import { CustomerAddressFormValues } from "../../../components/CustomerAddressForm/CustomerAddressForm";
import {
  CustomerAddress,
  CustomerSecondaryAddress,
  editMainAddress,
} from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "../address/useCustomerAddresses";

export const useEditCustomerMainAddress = (customerId: string) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    CustomerAddress | null,
    Error,
    readonly [string, string] | null,
    CustomerAddressFormValues
  >(
    customerId ? ["customer-main-address", customerId] : null,
    async ([_operation, id], { arg: formValues }) => {
      const address = await editMainAddress(id, formValues);
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
    { populateCache: false, revalidate: true }
  );

  return {
    editCustomerMainAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
