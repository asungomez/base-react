import useSWRMutation from "swr/mutation";
import { CustomerAddressFormValues } from "../../../components/CustomerAddressForm/CustomerAddressForm";
import { CustomerAddress, addMainAddress } from "../../../services/customers";
import { extractErrorCode } from "../../../services/error";

export const useAddCustomerMainAddress = (customerId: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    CustomerAddress,
    Error,
    readonly [string, string] | null,
    CustomerAddressFormValues
  >(
    customerId ? ["customer-main-address", customerId] : null,
    async ([_operation, customerId], { arg: formValues }) =>
      addMainAddress(customerId, formValues),
    { revalidate: false, populateCache: true }
  );

  return {
    addCustomerMainAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
