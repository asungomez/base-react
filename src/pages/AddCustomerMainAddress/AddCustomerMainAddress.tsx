import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Error } from "../../components/Error/Error";
import {
  CustomerAddressForm,
  CustomerAddressFormValues,
} from "../../components/CustomerAddressForm/CustomerAddressForm";
import { Typography } from "@mui/material";
import { useAddCustomerMainAddress } from "../../hooks/customers/main-address/useAddCustomerMainAddress";

type AddCustomerMainAddressParams = {
  id: string;
};

export const AddCustomerMainAddressPage: FC = () => {
  const { id: customerId } = useParams<AddCustomerMainAddressParams>();
  const { addCustomerMainAddress, loading, error } =
    useAddCustomerMainAddress(customerId);
  const navigate = useNavigate();

  if (!customerId) {
    return <Error code="INTERNAL_ERROR" />;
  }

  const submitHandler = (formValues: CustomerAddressFormValues) => {
    addCustomerMainAddress(formValues).then(() => {
      navigate(`/customers/${customerId}`);
    });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Add main address
      </Typography>
      {error && <Error code={error} />}
      <CustomerAddressForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};
