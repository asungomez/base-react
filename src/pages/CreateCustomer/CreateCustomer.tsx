import { FC } from "react";
import { Typography } from "@mui/material";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../components/CustomerForm/CustomerForm";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error/Error";
import { useCreateCustomer } from "../../hooks/useCreateCustomer";

export const CreateCustomerPage: FC = () => {
  const navigate = useNavigate();
  const { createCustomer, error, loading } = useCreateCustomer();

  const submitHandler = (formValues: CustomerFormValues) => {
    createCustomer(formValues).then((customer) => {
      navigate(`/customers/${customer.id}`);
    });
  };
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Customers
      </Typography>
      {error && <Error code={error} />}
      <CustomerForm onSubmit={submitHandler} loading={loading} />
    </>
  );
};
