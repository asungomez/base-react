import useSWRMutation from "swr/mutation";
import { Customer, TaxData, editTaxData } from "../../../services/customers";
import { TaxDataFormValues } from "../../../components/TaxDataForm/TaxDataForm";
import { extractErrorCode } from "../../../services/error";

export const useEditCustomerTaxData = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    TaxData | null,
    Error,
    readonly [string, string] | null,
    TaxDataFormValues,
    Customer | null
  >(
    id ? ["customer", id] : null,
    async ([_operation, customerId], { arg: formValues }) =>
      editTaxData(customerId, formValues),
    {
      populateCache: (taxData, customer) => {
        if (!customer) return null;
        if (!taxData)
          return {
            ...customer,
            taxData: undefined,
          };
        return {
          ...customer,
          taxData,
        };
      },
      revalidate: false,
    }
  );

  return {
    editCustomerTaxData: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};