import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Error } from "../../components/Error/Error";
import { Button, CircularProgress, Typography } from "@mui/material";
import {
  CustomerForm,
  CustomerFormValues,
} from "../../components/CustomerForm/CustomerForm";
import { useCustomer } from "../../hooks/customers/useCustomer";
import { useEditCustomer } from "../../hooks/customers/useEditCustomer";

type EditCustomerParams = {
  id: string;
};

export const EditCustomerPage: FC = () => {
  const { id } = useParams<EditCustomerParams>();
  const navigate = useNavigate();
  const { customer, loading, error: errorInitialLoad } = useCustomer(id);
  const {
    editCustomer,
    loading: editing,
    error: errorAfterEdit,
  } = useEditCustomer(id);

  const backClickHandler = () => navigate(`/customers/${id}`);

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
        <Error code={errorInitialLoad} />
        <Button variant="contained" color="primary" onClick={backClickHandler}>
          Back
        </Button>
      </>
    );
  }
  if (!customer || !id) {
    return (
      <>
        <Error code="INTERNAL_ERROR" />
        <Button variant="contained" color="primary" onClick={backClickHandler}>
          Back
        </Button>
      </>
    );
  }

  const submitHandler = (formValues: CustomerFormValues) => {
    editCustomer(formValues).then(() => {
      navigate(`/customers/${id}`);
    });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Edit customer
      </Typography>
      {errorAfterEdit && <Error code={errorAfterEdit} />}
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
