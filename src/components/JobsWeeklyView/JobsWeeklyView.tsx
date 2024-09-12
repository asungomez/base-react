import { FC, useState } from "react";
import { WeeklyJobs } from "../WeeklyJobs/WeeklyJobs";
import dayjs from "dayjs";
import { CircularProgress } from "@mui/material";
import { useJobs } from "../../hooks/jobs/useJobs";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import en from "dayjs/locale/en";

export const JobsWeeklyView: FC = () => {
  dayjs.locale({
    ...en,
    weekStart: 1,
  });
  const initialStartDate = dayjs().startOf("week");
  const [startDate, setStartDate] = useState(initialStartDate);
  const startDateString = startDate.format("YYYY-MM-DD");

  const startDateChangeHandler = (startDate: string) => {
    setStartDate(dayjs(startDate));
  };

  const endDate = startDate.add(6, "day");
  const endDateString = endDate.format("YYYY-MM-DD");

  const { jobs, loading, error } = useJobs(
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
        initialStartDate={startDateString}
        onChangeStartDate={startDateChangeHandler}
        jobs={jobs}
      />
    </>
  );
};
