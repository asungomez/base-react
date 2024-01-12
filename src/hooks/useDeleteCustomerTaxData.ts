import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../services/error";
import { Customer, deleteTaxData } from "../services/customers";

export const useDeleteCustomerTaxData = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    never,
    Customer | null
  >(
    id ? ["customer", id] : null,
    async ([_operation, customerId]) => deleteTaxData(customerId),
    {
      revalidate: false,
      populateCache: (_response, customer) => {
        if (!customer) return null;
        return {
          ...customer,
          taxData: undefined,
        };
      },
    }
  );

  return {
    deleteCustomerTaxData: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
