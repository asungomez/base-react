import { CircularProgress, Typography } from "@mui/material";
import { FC } from "react";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { CustomerAddress } from "../CustomerAddress/CustomerAddress";
import { useCustomerSecondaryAddress } from "../../hooks/customers/secondary-address/useCustomerSecondaryAddress";

type CustomerSecondaryAddressProps = {
  customerId: string;
  addressId: string;
};

export const CustomerSecondaryAddress: FC<CustomerSecondaryAddressProps> = ({
  customerId,
  addressId,
}) => {
  const { secondaryAddress, loading, error } = useCustomerSecondaryAddress(
    customerId,
    addressId
  );
  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Secondary address
        </Typography>
        <CircularProgress />
      </>
    );
  }

  if (error || !secondaryAddress) {
    return <ErrorMessage code={error ?? "INTERNAL_ERROR"} />;
  }

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Secondary address
      </Typography>
      <CustomerAddress address={secondaryAddress} />
    </>
  );
};
