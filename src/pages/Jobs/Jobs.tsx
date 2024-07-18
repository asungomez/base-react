import { Typography } from "@mui/material";
import { FC } from "react";
import { DailyJobs } from "../../components/DailyJobs/DailyJobs";
import dayjs from "dayjs";

export const JobsPage: FC = () => {
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Jobs
      </Typography>
      <Typography variant="h4" sx={{ mb: "20px" }}>
        Today&apos;s jobs
      </Typography>
      <DailyJobs date={dayjs().format("YYYY-MM-DD")} />
    </>
  );
};
