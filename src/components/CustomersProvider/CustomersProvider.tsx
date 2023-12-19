import { FC, ReactNode, useState } from "react";
import { CustomersContext } from "../../context/CustomersContext";
import {
  Customer,
  getCustomers as getCustomersFromService,
  getCustomer as getCustomerFromService,
  createCustomer as createCustomerFromService,
  editCustomer as editCustomerFromService,
  deleteCustomer as deleteCustomerFromService,
  deleteTaxData as deleteCustomerTaxDataFromService,
  addTaxData as addTaxDataFromService,
  editTaxData as editTaxDataFromService,
  addMainAddress as addMainAddressFromService,
  getMainAddress as getMainAddressFromService,
  TaxData,
  CustomerAddress,
} from "../../services/customers";
import { CustomerFormValues } from "../CustomerForm/CustomerForm";
import { TaxDataFormValues } from "../TaxDataForm/TaxDataForm";
import { CustomerAddressFormValues } from "../CustomerAddressForm/CustomerAddressForm";

type CustomersProviderProps = {
  children?: ReactNode;
};

const MINUTES_TO_EXPIRE = 1;

const expirationDate = (minutesFromNow: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesFromNow);
  return date;
};

const isExpired = (expiresAt: Date) => {
  return expiresAt < new Date();
};

export const CustomersProvider: FC<CustomersProviderProps> = ({ children }) => {
  const [customersCollectionStore, setCustomersCollectionStore] = useState<
    Record<
      string,
      {
        response: {
          customers: Customer[];
          nextToken?: string;
        };
        expiresAt: Date;
      }
    >
  >({});
  const [individualCustomerStore, setIndividualCustomerStore] = useState<
    Record<string, { response: Customer | null; expiresAt: Date }>
  >({});
  const [mainAddressStore, setMainAddressStore] = useState<
    Record<string, { response: CustomerAddress | null; expiresAt: Date }>
  >({});

  const getCustomers = async (
    nextToken?: string,
    searchInput?: string
  ): Promise<{
    customers: Customer[];
    nextToken?: string;
  }> => {
    const args = JSON.stringify({ nextToken, searchInput });
    if (
      customersCollectionStore[args] &&
      !isExpired(customersCollectionStore[args].expiresAt)
    ) {
      return customersCollectionStore[args].response;
    }
    const response = await getCustomersFromService(nextToken, searchInput);
    const expiresAt = expirationDate(MINUTES_TO_EXPIRE);
    setCustomersCollectionStore((customersCollectionStore) => ({
      ...customersCollectionStore,
      [args]: { response, expiresAt },
    }));
    return response;
  };

  const getCustomer = async (id: string): Promise<Customer | null> => {
    const args = JSON.stringify({ id });
    if (
      individualCustomerStore[args] &&
      !isExpired(individualCustomerStore[args].expiresAt)
    ) {
      return individualCustomerStore[args].response;
    }
    const response = await getCustomerFromService(id);
    const expiresAt = expirationDate(MINUTES_TO_EXPIRE);
    setIndividualCustomerStore((individualCustomerStore) => ({
      ...individualCustomerStore,
      [args]: { response, expiresAt },
    }));
    return response;
  };

  const createCustomer = async (
    formValues: CustomerFormValues
  ): Promise<Customer> => {
    setCustomersCollectionStore({});
    return createCustomerFromService(formValues);
  };

  const editCustomer = async (
    id: string,
    formValues: CustomerFormValues
  ): Promise<Customer> => {
    setIndividualCustomerStore({});
    setCustomersCollectionStore({});
    return editCustomerFromService(id, formValues);
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    setIndividualCustomerStore({});
    setCustomersCollectionStore({});
    return deleteCustomerFromService(id);
  };

  const deleteTaxData = async (id: string): Promise<void> => {
    setIndividualCustomerStore({});
    return deleteCustomerTaxDataFromService(id);
  };

  const addTaxData = async (
    customerId: string,
    formValues: TaxDataFormValues
  ): Promise<TaxData> => {
    setIndividualCustomerStore({});
    return addTaxDataFromService(customerId, formValues);
  };

  const editTaxData = async (
    customerId: string,
    formValues: TaxDataFormValues
  ): Promise<TaxData> => {
    setIndividualCustomerStore({});
    return editTaxDataFromService(customerId, formValues);
  };

  const addMainAddress = async (
    customerId: string,
    formValues: CustomerAddressFormValues
  ): Promise<CustomerAddress> => {
    setMainAddressStore({});
    return addMainAddressFromService(customerId, formValues);
  };

  const getMainAddress = async (
    customerId: string
  ): Promise<CustomerAddress | null> => {
    const args = JSON.stringify({ customerId });
    if (
      mainAddressStore[args] &&
      !isExpired(mainAddressStore[args].expiresAt)
    ) {
      return mainAddressStore[args].response;
    }
    const response = await getMainAddressFromService(customerId);
    const expiresAt = expirationDate(MINUTES_TO_EXPIRE);
    setMainAddressStore((mainAddressStore) => ({
      ...mainAddressStore,
      [args]: { response, expiresAt },
    }));
    return response;
  };

  return (
    <CustomersContext.Provider
      value={{
        getCustomers,
        getCustomer,
        createCustomer,
        editCustomer,
        deleteCustomer,
        deleteTaxData,
        addTaxData,
        editTaxData,
        addMainAddress,
        getMainAddress,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
};
