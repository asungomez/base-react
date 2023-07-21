import { API } from "aws-amplify";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";

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
