import useSWRMutation from "swr/mutation";
import { Customer, deleteCustomer } from "../services/customers";
import { useSWRConfig } from "swr";

export const useDeleteCustomer = (id: string | undefined) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    never,
    Customer | null
  >(
    id ? ["customer", id] : null,
    async ([_operation, customerId]) => {
      await deleteCustomer(customerId);
      await mutate<
        readonly [string, string | undefined, string | undefined],
        {
          customers: Customer[];
          nextToken?: string;
        }
      >(
        (key: unknown) => key && Array.isArray(key) && key[0] === "customers",
        undefined,
        { revalidate: false, populateCache: true }
      );
    },
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
