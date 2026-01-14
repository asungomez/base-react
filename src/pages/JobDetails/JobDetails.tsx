import {
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJob } from "../../hooks/jobs/useJob";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { JobAddresses } from "../../components/JobAddresses/JobAddresses";
import { DeleteJobButton } from "../../components/DeleteJobButton/DeleteJobButton";
import { ErrorCode } from "../../services/error";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";
import { JobImage, JobImageWrapper } from "./JobDetails.style";
import { S3DownloadButton } from "../../components/S3DownloadButton/S3DownloadButton";

type JobDetailsParams = {
  jobId: string;
};

export const JobDetailsPage: FC = () => {
  const { jobId } = useParams<JobDetailsParams>();
  const { job, loading, error } = useJob(jobId);
  const [operationError, setOperationError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const closeDownloadError = () => {
    setDownloadError(null);
  };

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
        <Link to={`/jobs/${jobId}/edit`}>
          <Button variant="contained">Edit</Button>
        </Link>
        <DeleteJobButton
          jobId={jobId}
          onError={errorHandler}
          onDelete={deleteHandler}
        />
        {job.invoiceKey && (
          <S3DownloadButton
            s3Key={job.invoiceKey}
            label="Download Invoice"
            onDownloadError={(errorMessage) => {
              setOperationError(errorMessage as ErrorCode);
            }}
          />
        )}
      </Stack>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        direction={{ xs: "column", md: "row-reverse" }}
      >
        {job?.imageUrl && (
          <Grid
            size={{
              xs: 12,
              md: 6
            }}>
            <JobImageWrapper>
              <JobImage src={job.imageUrl} alt="Job" />
            </JobImageWrapper>
          </Grid>
        )}
        <Grid
          size={{
            xs: 12,
            md: job?.imageUrl ? 6 : 12
          }}>
          <List>
            <ListItem disablePadding>
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              <ListItemText primary="Date" secondary={job.date} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <CurrencyPoundIcon />
              </ListItemIcon>
              <ListItemText primary="Price" secondary={job.price.toFixed(2)} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary="Start time" secondary={job.startTime} />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary="End time" secondary={job.endTime} />
            </ListItem>
            {job.assignedTo && (
              <ListItem disablePadding>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Assigned to"
                  secondary={[job.assignedTo.name, job.assignedTo.email]
                    .filter(Boolean)
                    .join(" - ")}
                />
              </ListItem>
            )}
          </List>
        </Grid>
      </Grid>
      <JobAddresses jobId={jobId} />
      <Snackbar
        open={!!downloadError}
        autoHideDuration={6000}
        onClose={closeDownloadError}
        message={downloadError}
      />
    </>
  );
};
