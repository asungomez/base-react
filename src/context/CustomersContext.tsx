import { createContext, useContext } from "react";
import { Customer, CustomerAddress } from "../services/customers";
import { CustomerAddressFormValues } from "../components/CustomerAddressForm/CustomerAddressForm";

export type CustomersContextData = {
  getCustomers: (
    nextToken?: string,
    searchInput?: string
  ) => Promise<{
    customers: Customer[];
    nextToken?: string;
  }>;
  addMainAddress: (
    customerId: string,
    formValues: CustomerAddressFormValues
  ) => Promise<CustomerAddress>;
  getMainAddress: (customerId: string) => Promise<CustomerAddress | null>;
  deleteMainAddress: (customerId: string) => Promise<void>;
};

export const CustomersContext = createContext<CustomersContextData>({
  getCustomers: () => Promise.resolve({ customers: [] }),
  addMainAddress: () => Promise.resolve({} as CustomerAddress),
  getMainAddress: () => Promise.resolve(null),
  deleteMainAddress: () => Promise.resolve(),
});

export const useCustomers = () => useContext(CustomersContext);
