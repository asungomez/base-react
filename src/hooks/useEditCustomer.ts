import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";
import useSWRMutation from "swr/mutation";
import { Customer, editCustomer } from "../services/customers";
import { extractErrorCode } from "../services/error";

export const useEditCustomer = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    Customer | null,
    Error,
    readonly [string, string] | null,
    CustomerFormValues
  >(
    id ? ["customer", id] : null,
    async ([_operation, id], { arg: formValues }) =>
      editCustomer(id, formValues),
    { populateCache: true, revalidate: false }
  );

  return {
    editCustomer: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
