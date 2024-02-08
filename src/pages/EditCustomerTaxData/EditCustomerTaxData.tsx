import { Button, CircularProgress, Typography } from "@mui/material";
import { FC } from "react";
import {
  TaxDataForm,
  TaxDataFormValues,
} from "../../components/TaxDataForm/TaxDataForm";
import { Error } from "../../components/Error/Error";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomer } from "../../hooks/customers/useCustomer";
import { useEditCustomerTaxData } from "../../hooks/customers/tax-data/useEditCustomerTaxData";

type EditCustomerTaxDataParams = {
  id: string;
};

export const EditCustomerTaxDataPage: FC = () => {
  const { id: customerId } = useParams<EditCustomerTaxDataParams>();
  const {
    editCustomerTaxData,
    loading: submitting,
    error: errorAfterEdit,
  } = useEditCustomerTaxData(customerId);
  const {
    error: errorInitialLoad,
    customer,
    loading,
  } = useCustomer(customerId);
  const navigate = useNavigate();

  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom align="center">
          Edit tax information
        </Typography>
        <CircularProgress />
      </>
    );
  }

  if (!customerId) {
    return <Error code="INTERNAL_ERROR" />;
  }

  const backClickHandler = () => navigate(`/customers/${customerId}`);

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

  const submitHandler = (formValues: TaxDataFormValues) => {
    editCustomerTaxData(formValues).then(() => {
      navigate(`/customers/${customerId}`);
    });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Edit tax information
      </Typography>
      {errorAfterEdit && <Error code={errorAfterEdit} />}
      {customer?.taxData && (
        <TaxDataForm
          loading={submitting}
          onSubmit={submitHandler}
          defaultValues={customer?.taxData}
        />
      )}
    </>
  );
};
