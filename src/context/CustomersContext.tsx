import { createContext, useContext } from "react";
import { Customer, TaxData } from "../services/customers";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";
import { TaxDataFormValues } from "../components/TaxDataForm/TaxDataForm";

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
});

export const useCustomers = () => useContext(CustomersContext);
