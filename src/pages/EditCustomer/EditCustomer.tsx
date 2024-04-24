import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { Button, CircularProgress, Typography } from "@mui/material";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../components/CustomerForm/CustomerForm";
import { useCustomer } from "../../hooks/customers/useCustomer";
import { useEditCustomer } from "../../hooks/customers/useEditCustomer";

type EditCustomerParams = {
  customerId: string;
};

export const EditCustomerPage: FC = () => {
  const { customerId } = useParams<EditCustomerParams>();
  const navigate = useNavigate();
  const {
    customer,
    loading,
    error: errorInitialLoad,
  } = useCustomer(customerId);
  const {
    editCustomer,
    loading: editing,
    error: errorAfterEdit,
  } = useEditCustomer(customerId);

  const backClickHandler = () => navigate(`/customers/${customerId}`);

  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Edit customer
        </Typography>
        <CircularProgress />
      </>
    );
  }
  if (errorInitialLoad) {
    return (
      <>
        <ErrorMessage code={errorInitialLoad} />
        <Button variant="contained" color="primary" onClick={backClickHandler}>
          Back
        </Button>
      </>
    );
  }
  if (!customer || !customerId) {
    return (
      <>
        <ErrorMessage code="INTERNAL_ERROR" />
        <Button variant="contained" color="primary" onClick={backClickHandler}>
          Back
        </Button>
      </>
    );
  }

  const submitHandler = (formValues: CustomerFormValues) => {
    editCustomer(formValues).then(() => {
      navigate(`/customers/${customerId}`);
    });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Edit customer
      </Typography>
      {errorAfterEdit && <ErrorMessage code={errorAfterEdit} />}
      <CustomerForm
        defaultValues={customer}
        onSubmit={submitHandler}
        loading={editing}
      />
      <Button variant="contained" color="primary" onClick={backClickHandler}>
        Back
      </Button>
    </>
  );
};
