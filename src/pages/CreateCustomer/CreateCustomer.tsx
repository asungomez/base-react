import { FC, useState } from "react";
import { Typography } from "@mui/material";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../components/CustomerForm/CustomerForm";
import { useNavigate } from "react-router-dom";
import { ErrorCode, isErrorCode } from "../../services/error";
import { Error } from "../../components/Error/Error";
import { useCustomers } from "../../context/CustomersContext";

export const CreateCustomerPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();
  const { createCustomer } = useCustomers();

  const submitHandler = (formValues: CustomerFormValues) => {
    setLoading(true);
    setError(null);
    createCustomer(formValues)
      .then((customer) => {
        setLoading(false);
        navigate(`/customers/${customer.id}`);
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error.message)) {
          setError(error.message);
        } else {
          setError("INTERNAL_ERROR");
        }
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
