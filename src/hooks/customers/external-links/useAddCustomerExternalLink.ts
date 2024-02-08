import { CustomerExternalLinkFormValues } from "../../../components/CustomerExternalLinkForm/CustomerExternalLinkForm";
import { Customer, addExternalLink } from "../../../services/customers";
import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../../services/error";

export const useAddCustomerExternalLink = (customerId: string) => {
  const {
    trigger,
    isMutating: loading,
    error,
  } = useSWRMutation<
    string,
    Error,
    readonly [string, string],
    CustomerExternalLinkFormValues,
    Customer | null
  >(
    ["customer", customerId],
    async ([_operation, customerId], { arg: formValues }) =>
      addExternalLink(customerId, formValues.url),
    {
      revalidate: false,
      populateCache: (url, customer) => {
        if (!customer) {
          return null;
        }
        if (!customer.externalLinks) {
          return {
            ...customer,
            externalLinks: [url],
          };
        }
        return {
          ...customer,
          externalLinks: [...customer.externalLinks, url],
        };
      },
    }
  );

  return {
    addExternalLink: trigger,
    loading,
    error: extractErrorCode(error),
  };
};
