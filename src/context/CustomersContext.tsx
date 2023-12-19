import { createContext, useContext } from "react";
import { Customer, CustomerAddress, TaxData } from "../services/customers";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";
import { TaxDataFormValues } from "../components/TaxDataForm/TaxDataForm";
import { CustomerAddressFormValues } from "../components/CustomerAddressForm/CustomerAddressForm";

export type CustomersContextData = {
  getCustomers: (
    nextToken?: string,
    searchInput?: string
  ) => Promise<{
    customers: Customer[];
    nextToken?: string;
  }>;
  getCustomer: (id: string) => Promise<Customer | null>;
  createCustomer: (formValues: CustomerFormValues) => Promise<Customer>;
  editCustomer: (
    id: string,
    formValues: CustomerFormValues
  ) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  deleteTaxData: (id: string) => Promise<void>;
  addTaxData: (
    customerId: string,
    formValues: TaxDataFormValues
  ) => Promise<TaxData>;
  editTaxData: (
    customerId: string,
    formValues: TaxDataFormValues
  ) => Promise<TaxData>;
  addMainAddress: (
    customerId: string,
    formValues: CustomerAddressFormValues
  ) => Promise<CustomerAddress>;
  getMainAddress: (customerId: string) => Promise<CustomerAddress | null>;
  deleteMainAddress: (customerId: string) => Promise<void>;
};

export const CustomersContext = createContext<CustomersContextData>({
  getCustomers: () => Promise.resolve({ customers: [] }),
  getCustomer: () => Promise.resolve(null),
  createCustomer: () => Promise.resolve({} as Customer),
  editCustomer: () => Promise.resolve({} as Customer),
  deleteCustomer: () => Promise.resolve(),
  deleteTaxData: () => Promise.resolve(),
  addTaxData: () => Promise.resolve({} as TaxData),
  editTaxData: () => Promise.resolve({} as TaxData),
  addMainAddress: () => Promise.resolve({} as CustomerAddress),
  getMainAddress: () => Promise.resolve(null),
  deleteMainAddress: () => Promise.resolve(),
});

export const useCustomers = () => useContext(CustomersContext);
