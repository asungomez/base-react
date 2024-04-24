import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { CustomerMainAddress } from "../../components/CustomerMainAddress/CustomerMainAddress";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { CustomerSecondaryAddress } from "../../components/CustomerSecondaryAddress/CustomerSecondaryAddress";
import { Breadcrumbs, Typography } from "@mui/material";

type CustomerAddressParams = {
  customerId: string;
  addressId: string;
};

export const CustomerAddressPage: FC = () => {
  const { customerId, addressId } = useParams<CustomerAddressParams>();

  if (!customerId || !addressId) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
  }
  const isMainAddress = addressId === "main";

  const addressComponent = isMainAddress ? (
    <CustomerMainAddress customerId={customerId} />
  ) : (
    <CustomerSecondaryAddress customerId={customerId} addressId={addressId} />
  );

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="/customers">Customers</Link>
        <Link to={`/customers/${customerId}`}>Customer</Link>
        <Link to={`/customers/${customerId}?tab=addresses`}>Addresses</Link>
        <Typography color="textPrimary">Address</Typography>
      </Breadcrumbs>
      {addressComponent}
    </>
  );
};
