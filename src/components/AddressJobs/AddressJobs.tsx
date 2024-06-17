import {
  Button,
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
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

type AddressJobsProps = {
  addressId: string;
  customerId: string;
};

export const AddressJobs: FC<AddressJobsProps> = ({
  addressId,
  customerId,
}) => {
  const { jobs, loading, loadMore, loadingMore, error, moreToLoad } = useJobs({
    addressId,
    customerId,
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
      <Link to={`/jobs/create?addressId=${addressId}&customerId=${customerId}`}>
        <Button variant="outlined" startIcon={<AddIcon />}>
          Add new
        </Button>
      </Link>
      <List>
        {jobs.map((job) => (
          <Link to={`/jobs/${job.id}`} key={job.id}>
            <ListItemButton>
              <ListItemText primary={job.name} />
            </ListItemButton>
          </Link>
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
