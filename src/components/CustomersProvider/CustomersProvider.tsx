import { FC, ReactNode, useState } from "react";
import { CustomersContext } from "../../context/CustomersContext";
import {
  addMainAddress as addMainAddressFromService,
  getMainAddress as getMainAddressFromService,
  deleteMainAddress as deleteMainAddressFromService,
  CustomerAddress,
} from "../../services/customers";
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
  const [mainAddressStore, setMainAddressStore] = useState<
    Record<string, { response: CustomerAddress | null; expiresAt: Date }>
  >({});

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
        addMainAddress,
        getMainAddress,
        deleteMainAddress,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
};
