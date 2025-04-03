import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { useJob } from "../../hooks/jobs/useJob";
import { CircularProgress, Typography } from "@mui/material";
import { useJobAddresses } from "../../hooks/jobs/useJobAddresses";
import {
  JobForm,
  JobFormAddress,
  JobFormValues,
} from "../../components/JobForm/JobForm";
import { useEditJob } from "../../hooks/jobs/useEditJob";
import dayjs from "dayjs";

type EditJobParams = {
  jobId: string;
};

export const EditJobPage: FC = () => {
  const { jobId } = useParams<EditJobParams>();
  const { job, loading: loadingJob, error: errorLoadingJob } = useJob(jobId);
  const {
    addresses,
    error: errorLoadingAddresses,
    loading: loadingAddresses,
  } = useJobAddresses(jobId);
  const {
    editJob,
    loading: editingJob,
    error: errorEditingJob,
  } = useEditJob(jobId);
  const navigate = useNavigate();

  if (!jobId) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
  }

  if (loadingJob || loadingAddresses) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Edit job
        </Typography>
        <CircularProgress />
      </>
    );
  }

  const error = errorLoadingJob ?? errorLoadingAddresses;
  if (error) {
    return <ErrorMessage code={error} />;
  }

  if (!job) {
    return <ErrorMessage code="JOB_NOT_EXISTS" />;
  }

  if (!addresses?.length) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
  }

  const initialAddresses: JobFormAddress[] = addresses.map(
    (address) =>
      ({
        addressId: address.id,
        customerId: address.customerId,
      } as JobFormAddress)
  );

  const submitHandler = (formValues: JobFormValues, image: File | null) => {
    editJob({ formValues, image })
      .then(() => {
        navigate(`/jobs/${jobId}`);
      })
      .catch(() => {
        // The hook should handle the error and set the error state
      });
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Edit job
      </Typography>
      {errorEditingJob && <ErrorMessage code={errorEditingJob} />}
      <JobForm
        onSubmit={submitHandler}
        loading={editingJob}
        initialValues={{
          ...job,
          addresses: initialAddresses,
          date: dayjs(job.date),
          startTime: dayjs(`${job.date} ${job.startTime}`),
          endTime: dayjs(`${job.date} ${job.endTime}`),
          assignedTo: job.assignedTo?.sub,
        }}
      />
    </>
  );
};
