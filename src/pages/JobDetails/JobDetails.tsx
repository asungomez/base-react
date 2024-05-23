import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJob } from "../../hooks/jobs/useJob";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { JobAddresses } from "../../components/JobAddresses/JobAddresses";
import { DeleteJobButton } from "../../components/DeleteJobButton/DeleteJobButton";
import { ErrorCode } from "../../services/error";

type JobDetailsParams = {
  jobId: string;
};

export const JobDetailsPage: FC = () => {
  const { jobId } = useParams<JobDetailsParams>();
  const { job, loading, error } = useJob(jobId);
  const [operationError, setOperationError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();

  const errorHandler = (code: ErrorCode) => {
    setOperationError(code);
  };

  const deleteHandler = () => {
    navigate("/jobs");
  };

  if (!jobId) {
    return <ErrorMessage code="INTERNAL_ERROR" />;
  }

  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Job
        </Typography>
        <CircularProgress />
      </>
    );
  }

  if (error) {
    return <ErrorMessage code={error} />;
  }

  if (!job) {
    return <ErrorMessage code="JOB_NOT_EXISTS" />;
  }

  return (
    <>
      <Typography variant="h3" gutterBottom>
        {job.name}
      </Typography>
      {operationError && <ErrorMessage code={operationError} />}
      <Stack direction="row" spacing={2}>
        <Button variant="contained">Edit</Button>
        <DeleteJobButton
          jobId={jobId}
          onError={errorHandler}
          onDelete={deleteHandler}
        />
      </Stack>
      <JobAddresses jobId={jobId} />
    </>
  );
};
