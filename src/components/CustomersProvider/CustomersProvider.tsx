import { FC, ReactNode, useState } from "react";
import { CustomersContext } from "../../context/CustomersContext";
import {
  Customer,
  getCustomers as getCustomersFromService,
  createCustomer as createCustomerFromService,
  deleteTaxData as deleteCustomerTaxDataFromService,
  addMainAddress as addMainAddressFromService,
  getMainAddress as getMainAddressFromService,
  deleteMainAddress as deleteMainAddressFromService,
  CustomerAddress,
} from "../../services/customers";
import { CustomerFormValues } from "../CustomerForm/CustomerForm";
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

  const createCustomer = async (
    formValues: CustomerFormValues
  ): Promise<Customer> => {
    setCustomersCollectionStore({});
    return createCustomerFromService(formValues);
  };

  const deleteTaxData = async (id: string): Promise<void> => {
    return deleteCustomerTaxDataFromService(id);
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

  const deleteMainAddress = async (customerId: string): Promise<void> => {
    setMainAddressStore({});
    return deleteMainAddressFromService(customerId);
  };

  return (
    <CustomersContext.Provider
      value={{
        getCustomers,
        createCustomer,
        deleteTaxData,
        addMainAddress,
        getMainAddress,
        deleteMainAddress,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
};
