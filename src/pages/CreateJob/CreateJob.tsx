import { FC } from "react";
import { useCreateJob } from "../../hooks/jobs/useCreateJob";
import {
  JobForm,
  JobFormAddress,
  JobFormValues,
} from "../../components/JobForm/JobForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";

export const CreateJobPage: FC = () => {
  const { user } = useAuth();
  const { createJob, loading, error } = useCreateJob();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addressId = searchParams.get("addressId");
  const customerId = searchParams.get("customerId");
  const date = searchParams.get("date");

  const initialAddresses: JobFormAddress[] = [];
  if (addressId && customerId) {
    initialAddresses.push({ addressId, customerId });
  }

  const submitHandler = (formValues: JobFormValues, file: File | null) => {
    createJob({ formValues, image: file })
      .then((job) => {
        navigate(`/jobs/${job.id}`);
      })
      .catch(() => {
        // The hook should handle the error and set the error state
      });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Create new job
      </Typography>
      {error && <ErrorMessage code={error} />}
      <JobForm
        onSubmit={submitHandler}
        loading={loading}
        initialValues={{
          name: "",
          addresses: initialAddresses,
          date: dayjs(date),
          startTime: dayjs(),
          endTime: dayjs().add(1, "hour"),
          assignedTo: user?.attributes?.sub,
          price: 0,
        }}
      />
    </>
  );
};
