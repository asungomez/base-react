import { FC } from "react";
import { useJobs } from "../../hooks/jobs/useJobs";
import { Button, CircularProgress } from "@mui/material";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import dayjs from "dayjs";
import { JobsList } from "../JobsList/JobsList";

type PastAddressJobs = {
  addressId: string;
  customerId: string;
};

export const PastAddressJobs: FC<PastAddressJobs> = ({
  customerId,
  addressId,
}) => {
  const { jobs, loading, loadMore, loadingMore, error, moreToLoad } = useJobs(
    {
      addressId,
      customerId,
      to: dayjs().format("YYYY-MM-DD HH:mm"),
    },
    "desc"
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
        <Button loading={loadingMore} onClick={loadMore}>
          Load more
        </Button>
      )}
    </>
  );
};
