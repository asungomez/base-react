import { Typography } from "@mui/material";
import { FC } from "react";
import {
  TaxDataForm,
  TaxDataFormValues,
} from "../../components/TaxDataForm/TaxDataForm";
import { Error } from "../../components/Error/Error";
import { useNavigate, useParams } from "react-router-dom";
import { useAddCustomerTaxData } from "../../hooks/useAddCustomerTaxData";

type AddCustomerTaxDataParams = {
  id: string;
};

export const AddCustomerTaxDataPage: FC = () => {
  const { id: customerId } = useParams<AddCustomerTaxDataParams>();
  const navigate = useNavigate();
  const { addCustomerTaxData, loading, error } =
    useAddCustomerTaxData(customerId);

  if (!customerId) {
    return <Error code="INTERNAL_ERROR" />;
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
      {error && <Error code={error} />}
      <TaxDataForm loading={loading} onSubmit={submitHandler} />
    </>
  );
};
