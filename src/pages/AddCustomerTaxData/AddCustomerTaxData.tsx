import { Typography } from "@mui/material";
import { FC } from "react";
import {
  TaxDataForm,
  TaxDataFormValues,
} from "../../components/TaxDataForm/TaxDataForm";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { useNavigate, useParams } from "react-router-dom";
import { useAddCustomerTaxData } from "../../hooks/customers/tax-data/useAddCustomerTaxData";

type AddCustomerTaxDataParams = {
  customerId: string;
};

export const AddCustomerTaxDataPage: FC = () => {
  const { customerId } = useParams<AddCustomerTaxDataParams>();
  const navigate = useNavigate();
  const { addCustomerTaxData, loading, error } =
    useAddCustomerTaxData(customerId);

  if (!customerId) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
  }

  const submitHandler = (formValues: TaxDataFormValues) => {
    addCustomerTaxData(formValues).then(() => {
      navigate(`/customers/${customerId}`);
    });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Add tax information
      </Typography>
      {error && <ErrorMessage code={error} />}
      <TaxDataForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};
