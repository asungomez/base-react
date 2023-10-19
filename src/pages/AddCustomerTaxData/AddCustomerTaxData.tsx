import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import {
  TaxDataForm,
  TaxDataFormValues,
} from "../../components/TaxDataForm/TaxDataForm";
import { Error } from "../../components/Error/Error";
import { useNavigate, useParams } from "react-router-dom";
import { addTaxData } from "../../services/customers";

type AddCustomerTaxDataParams = {
  id: string;
};

export const AddCustomerTaxDataPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { id: customerId } = useParams<AddCustomerTaxDataParams>();
  const navigate = useNavigate();

  if (!customerId) {
    return <Error code="INTERNAL_ERROR" />;
  }

  const submitHandler = (formValues: TaxDataFormValues) => {
    setLoading(true);
    addTaxData(customerId, formValues)
      .then(() => {
        navigate(`/customers/${customerId}`);
      })
      .catch((error) => {
        if (isErrorCode(error.message)) {
          setError(error.message);
        } else {
          setError("INTERNAL_ERROR");
        }
        setLoading(false);
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
