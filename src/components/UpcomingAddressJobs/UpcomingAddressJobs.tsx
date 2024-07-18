import { FC } from "react";
import { useJobs } from "../../hooks/jobs/useJobs";
import { CircularProgress } from "@mui/material";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { JobsList } from "../JobsList/JobsList";

type UpcomingAddressJobs = {
  addressId: string;
  customerId: string;
};

export const UpcomingAddressJobs: FC<UpcomingAddressJobs> = ({
  customerId,
  addressId,
}) => {
  const { jobs, loading, loadMore, loadingMore, error, moreToLoad } = useJobs(
    {
      addressId,
      customerId,
      from: dayjs().format("YYYY-MM-DD HH:mm"),
    },
    "asc"
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !jobs) {
    return <ErrorMessage code={error ?? "INTERNAL_ERROR"} />;
  }

  return (
    <>
      <JobsList jobs={jobs} />
      {moreToLoad && (
        <LoadingButton loading={loadingMore} onClick={loadMore}>
          Load more
        </LoadingButton>
      )}
    </>
  );
};
