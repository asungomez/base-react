import { Customer, editExternalLink } from "../../../services/customers";
import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../../services/error";

export const useEditCustomerExternalLink = (customerId: string) => {
  const {
    trigger,
    isMutating: loading,
    error,
  } = useSWRMutation<
    { url: string; index: number },
    Error,
    readonly [string, string],
    { url: string; index: number },
    Customer | null
  >(
    ["customer", customerId],
    async ([_operation, customerId], { arg: { index, url } }) =>
      editExternalLink(customerId, index, url),
    {
      revalidate: false,
      populateCache: ({ index, url }, customer) => {
        if (!customer) {
          return null;
        }
        if (!customer.externalLinks) {
          return customer;
        }
        return {
          ...customer,
          externalLinks: customer.externalLinks.map((original, i) =>
            i === index ? url : original
          ),
        };
      },
    }
  );

  return {
    editExternalLink: trigger,
    loading,
    error: extractErrorCode(error),
  };
};
