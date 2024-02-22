import { Customer, deleteExternalLink } from "../../../services/customers";
import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../../services/error";

export const useDeleteCustomerExternalLink = (customerId: string) => {
  const {
    trigger,
    isMutating: loading,
    error,
  } = useSWRMutation<
    number,
    Error,
    readonly [string, string],
    number,
    Customer | null
  >(
    ["customer", customerId],
    async ([_operation, customerId], { arg: index }) =>
      deleteExternalLink(customerId, index),
    {
      revalidate: false,
      populateCache: (index, customer) => {
        if (!customer) {
          return null;
        }
        if (!customer.externalLinks) {
          return customer;
        }
        return {
          ...customer,
          externalLinks: customer.externalLinks.splice(index, 1),
        };
      },
    }
  );

  return {
    deleteExternalLink: trigger,
    loading,
    error: extractErrorCode(error),
  };
};
