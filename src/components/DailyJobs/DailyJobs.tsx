import { FC } from "react";
import { useJobs } from "../../hooks/jobs/useJobs";
import { Button, CircularProgress } from "@mui/material";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import dayjs from "dayjs";
import { JobsList } from "../JobsList/JobsList";

type DailyJobs = {
  date: string;
};

export const DailyJobs: FC<DailyJobs> = ({ date }) => {
  const { jobs, loading, loadMore, loadingMore, error, moreToLoad } = useJobs(
    {
      from: dayjs().format(`${date} 00:00`),
      to: dayjs().format(`${date} 23:59`),
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
        <Button loading={loadingMore} onClick={loadMore}>
          Load more
        </Button>
      )}
    </>
  );
};
