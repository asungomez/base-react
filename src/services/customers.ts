import { API } from "aws-amplify";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";
import { TaxDataFormValues } from "../components/TaxDataForm/TaxDataForm";
import { is } from "cypress/types/bluebird";

const del = async (path: string) => {
  return API.del("dataapi", path, {});
};

const get = async (
  path: string,
  queryParams: { [param: string]: string | undefined } = {}
) => {
  return API.get("dataapi", path, {
    queryStringParameters: queryParams,
  });
};

const post = async (path: string, body: { [param: string]: string } = {}) => {
  return API.post("dataapi", path, {
    body,
  });
};

const put = async (path: string, body: { [param: string]: string } = {}) => {
  return API.put("dataapi", path, {
    body,
  });
};

export const CUSTOMER_TYPES = ["individual", "company", "other"] as const;
export type CustomerType = typeof CUSTOMER_TYPES[number];
export type Customer = {
  id: string;
  name: string;
  email: string;
  type: CustomerType;
  taxData?: TaxData;
};

export type TaxData = {
  taxId: string;
  companyName: string;
  companyAddress: string;
};

const isCustomer = (value: unknown): value is Customer => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const customer = value as Customer;
  return (
    typeof customer.id === "string" &&
    typeof customer.name === "string" &&
    typeof customer.email === "string" &&
    typeof customer.type === "string" &&
    CUSTOMER_TYPES.includes(customer.type) &&
    ((typeof customer.taxData === "object" && isTaxData(customer.taxData)) ||
      customer.taxData === undefined)
  );
};

const isTaxData = (value: unknown): value is TaxData => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const taxData = value as TaxData;
  return (
    typeof taxData.taxId === "string" &&
    typeof taxData.companyName === "string" &&
    typeof taxData.companyAddress === "string"
  );
};

type ResponseError = {
  response: {
    status: number;
    data: { error: string };
  };
};

const isResponseError = (value: unknown): value is ResponseError => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const responseError = value as ResponseError;
  return (
    typeof responseError.response === "object" &&
    responseError.response !== null &&
    typeof responseError.response.status === "number" &&
    typeof responseError.response.data === "object" &&
    responseError.response.data !== null &&
    typeof responseError.response.data.error === "string"
  );
};

export const addTaxData = async (
  customerId: string,
  formValues: TaxDataFormValues
): Promise<TaxData> => {
  try {
    const response = await post(
      `/customers/${customerId}/tax-data`,
      formValues
    );
    if (!isTaxData(response.taxData)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.taxData;
  } catch (error) {
    if (isResponseError(error)) {
      const status = error.response.status;
      if (status === 400) {
        if (error.response.data.error === "Tax ID is required") {
          throw new Error("REQUIRED_TAX_ID");
        }
        if (error.response.data.error === "Company name is required") {
          throw new Error("REQUIRED_COMPANY_NAME");
        }
        if (error.response.data.error === "Company address is required") {
          throw new Error("REQUIRED_COMPANY_ADDRESS");
        }
      }
      if (status === 404) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const createCustomer = async (
  formValues: CustomerFormValues
): Promise<Customer> => {
  try {
    const response = await post("/customers", formValues);
    if (!isCustomer(response.customer)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.customer;
  } catch (error) {
    if (isResponseError(error)) {
      const status = error.response.status;
      if (status === 400) {
        if (error.response.data.error === "This email already exists") {
          throw new Error("DUPLICATED_CUSTOMER");
        }
        if (error.response.data.error === "Email is required") {
          throw new Error("REQUIRED_EMAIL");
        }
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await del("/customers/" + id);
};

export const deleteTaxData = async (customerId: string): Promise<void> => {
  console.log(`Deleting data from customer ${customerId}`);
};

export const editCustomer = async (
  id: string,
  formValues: CustomerFormValues
): Promise<Customer> => {
  try {
    const response = await put("/customers/" + id, formValues);
    if (!isCustomer(response.customer)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.customer;
  } catch (error) {
    if (isResponseError(error)) {
      const status = error.response.status;
      if (status === 400) {
        if (error.response.data.error === "Email is required") {
          throw new Error("REQUIRED_EMAIL");
        }
        if (error.response.data.error === "This email already exists") {
          throw new Error("DUPLICATED_CUSTOMER");
        }
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const getCustomer = async (id: string): Promise<Customer> => {
  try {
    const response = await get(`/customers/${id}`);
    if (!isCustomer(response.customer)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.customer;
  } catch (error) {
    if (isResponseError(error)) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const getCustomers = async (
  nextToken?: string,
  searchInput?: string
): Promise<{
  customers: Customer[];
  nextToken?: string;
}> => {
  try {
    const response = await get("/customers", {
      nextToken,
      search: searchInput,
    });
    if (
      !("customers" in response) ||
      !Array.isArray(response.customers) ||
      response.customers.some((element: unknown) => !isCustomer(element))
    ) {
      throw new Error("INTERNAL_ERROR");
    }
    const customers = response.customers as Customer[];
    const responseToken = response.nextToken as string | undefined;
    return { customers, nextToken: responseToken };
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};
