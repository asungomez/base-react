import useSWRMutation from "swr/mutation";
import { Customer, deleteCustomer } from "../services/customers";

export const useDeleteCustomer = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    never,
    Customer | null
  >(
    id ? ["customer", id] : null,
    async ([_operation, customerId]) => deleteCustomer(customerId),
    {
      revalidate: false,
      populateCache: () => null,
    }
  );

  return {
    deleteCustomer: trigger,
    loading: isMutating,
    error,
  };
};
