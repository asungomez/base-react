import {
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { useJobs } from "../../hooks/jobs/useJobs";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { LoadingButton } from "@mui/lab";

type AddressJobsProps = {
  addressId: string;
};

export const AddressJobs: FC<AddressJobsProps> = ({ addressId }) => {
  const { jobs, loading, loadMore, loadingMore, error, moreToLoad } = useJobs({
    addressId,
  });

  if (loading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  if (error || !jobs) {
    return (
      <>
        <Typography variant="h4" gutterBottom>
          Jobs
        </Typography>
        <ErrorMessage code={error ?? "INTERNAL_ERROR"} />
      </>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Jobs
      </Typography>
      <List>
        {jobs.map((job) => (
          <ListItemButton key={job.id}>
            <ListItemText primary={job.name} />
          </ListItemButton>
        ))}
      </List>
      {moreToLoad && (
        <LoadingButton loading={loadingMore} onClick={loadMore}>
          Load more
        </LoadingButton>
      )}
    </>
  );
};
