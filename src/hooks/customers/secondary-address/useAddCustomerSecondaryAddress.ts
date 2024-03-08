import useSWRMutation from "swr/mutation";
import { CustomerAddressFormValues } from "../../../components/CustomerAddressForm/CustomerAddressForm";
import {
  CustomerSecondaryAddress,
  addSecondaryAddress,
} from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";

export const useCustomerAddSecondaryAddress = (customerId?: string) => {
  const { trigger, isMutating, error } = useSWRMutation<
    CustomerSecondaryAddress,
    Error,
    readonly [string, string] | null,
    CustomerAddressFormValues,
    CustomerSecondaryAddress[]
  >(
    customerId ? ["customer-secondary-addresses", customerId] : null,
    async ([_operation, customerId], { arg: formValues }) =>
      addSecondaryAddress(customerId, formValues),
    {
      revalidate: true,
      populateCache: false,
    }
  );

  return {
    addCustomerSecondaryAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
