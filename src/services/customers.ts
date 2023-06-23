import { API } from "aws-amplify";
import { CreateCustomerFormValues } from "../components/CreateCustomerForm/CreateCustomerForm";

const get = async (
  path: string,
  queryParams: { [param: string]: string } = {}
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

export const CUSTOMER_TYPES = ["individual", "company", "other"] as const;
export type CustomerType = typeof CUSTOMER_TYPES[number];
export type Customer = {
  id: string;
  name: string;
  email: string;
  type: CustomerType;
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
    CUSTOMER_TYPES.includes(customer.type as CustomerType)
  );
};

export const createCustomer = async (
  formValues: CreateCustomerFormValues
): Promise<Customer> => {
  const response = await post("/customers", formValues);
  if (!isCustomer(response.customer)) {
    throw new Error("INTERNAL_ERROR");
  }
  return response.customer;
};

export const getCustomer = async (id: string): Promise<Customer> => {
  const response = await get(`/customers/${id}`);
  if (!isCustomer(response.customer)) {
    throw new Error("INTERNAL_ERROR");
  }
  return response.customer;
};

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await get("/customers");
    if (
      !("customers" in response) ||
      !Array.isArray(response.customers) ||
      response.customers.some((element: unknown) => !isCustomer(element))
    ) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.customers as Customer[];
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};
