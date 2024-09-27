import { FC, useMemo, useState } from "react";
import { WeeklyJobs } from "../WeeklyJobs/WeeklyJobs";
import dayjs from "dayjs";
import { CircularProgress } from "@mui/material";
import { useJobs } from "../../hooks/jobs/useJobs";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import "dayjs/locale/en";

export const JobsWeeklyView: FC = () => {
  dayjs.locale("en");
  const initialStartDate = useMemo(
    () => dayjs().startOf("week").add(1, "day"),
    []
  );
  const [startDate, setStartDate] = useState(initialStartDate);
  const startDateString = startDate.format("YYYY-MM-DD");

  const startDateChangeHandler = (startDate: string) => {
    setStartDate(dayjs(startDate));
  };

  const endDate = startDate.add(6, "day");
  const endDateString = endDate.format("YYYY-MM-DD");

  const { jobs, loading, error, reload } = useJobs(
    {
      from: dayjs().format(`${startDateString} 00:00`),
      to: dayjs().format(`${endDateString} 23:59`),
    },
    "asc",
    false
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !jobs) {
    return <ErrorMessage code={error ?? "INTERNAL_ERROR"} />;
  }

  return (
    <>
      <WeeklyJobs
        startDate={startDateString}
        onChangeStartDate={startDateChangeHandler}
        jobs={jobs}
        onJobCreated={reload}
      />
    </>
  );
};
