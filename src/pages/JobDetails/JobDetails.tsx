import { CircularProgress, Typography } from "@mui/material";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useJob } from "../../hooks/jobs/useJob";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { JobAddresses } from "../../components/JobAddresses/JobAddresses";

type JobDetailsParams = {
  jobId: string;
};

export const JobDetailsPage: FC = () => {
  const { jobId } = useParams<JobDetailsParams>();
  const { job, loading, error } = useJob(jobId);

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
      <JobAddresses jobId={jobId} />
    </>
  );
};
