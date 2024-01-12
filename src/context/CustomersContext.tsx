import { createContext, useContext } from "react";
import { Customer, CustomerAddress } from "../services/customers";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";
import { CustomerAddressFormValues } from "../components/CustomerAddressForm/CustomerAddressForm";

export type CustomersContextData = {
  getCustomers: (
    nextToken?: string,
    searchInput?: string
  ) => Promise<{
    customers: Customer[];
    nextToken?: string;
  }>;
  createCustomer: (formValues: CustomerFormValues) => Promise<Customer>;
  deleteTaxData: (id: string) => Promise<void>;
  addMainAddress: (
    customerId: string,
    formValues: CustomerAddressFormValues
  ) => Promise<CustomerAddress>;
  getMainAddress: (customerId: string) => Promise<CustomerAddress | null>;
  deleteMainAddress: (customerId: string) => Promise<void>;
};

export const CustomersContext = createContext<CustomersContextData>({
  getCustomers: () => Promise.resolve({ customers: [] }),
  createCustomer: () => Promise.resolve({} as Customer),
  deleteTaxData: () => Promise.resolve(),
  addMainAddress: () => Promise.resolve({} as CustomerAddress),
  getMainAddress: () => Promise.resolve(null),
  deleteMainAddress: () => Promise.resolve(),
});

export const useCustomers = () => useContext(CustomersContext);
