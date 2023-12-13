import { CircularProgress, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import {
  TaxDataForm,
  TaxDataFormValues,
} from "../../components/TaxDataForm/TaxDataForm";
import { Error } from "../../components/Error/Error";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomers } from "../../context/CustomersContext";

type EditCustomerTaxDataParams = {
  id: string;
};

export const EditCustomerTaxDataPage: FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [taxData, setTaxData] = useState<TaxDataFormValues | null>(null);
  const { id: customerId } = useParams<EditCustomerTaxDataParams>();
  const { getCustomer, editTaxData } = useCustomers();
  const navigate = useNavigate();

  useEffect(() => {
    if (customerId && loading) {
      getCustomer(customerId)
        .then((customer) => {
          if (customer?.taxData) {
            setTaxData(customer?.taxData);
          }
          setLoading(false);
        })
        .catch((e) => {
          if (isErrorCode(e.message)) {
            setError(e.message);
          } else {
            setError("INTERNAL_ERROR");
          }
          setLoading(false);
        });
    }
  }, [loading, customerId]);

  if (!customerId) {
    return <Error code="INTERNAL_ERROR" />;
  }

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

  const submitHandler = (formValues: TaxDataFormValues) => {
    setSubmitting(true);
    setError(null);
    editTaxData(customerId, formValues)
      .then(() => {
        setSubmitting(false);
        navigate(`/customers/${customerId}`);
      })
      .catch((e) => {
        if (isErrorCode(e.message)) {
          setError(e.message);
        } else {
          setError("INTERNAL_ERROR");
        }
        setSubmitting(false);
      });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom align="center">
        Edit tax information
      </Typography>
      {error && <Error code={error} />}
      {taxData && (
        <TaxDataForm
          loading={submitting}
          onSubmit={submitHandler}
          defaultValues={taxData}
        />
      )}
    </>
  );
};
