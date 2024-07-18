import { Button, Typography } from "@mui/material";
import { FC } from "react";
import { DailyJobs } from "../../components/DailyJobs/DailyJobs";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

export const JobsPage: FC = () => {
  const date = dayjs().format("YYYY-MM-DD");
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Jobs
      </Typography>
      <Typography variant="h4" sx={{ mb: "20px" }}>
        Today&apos;s jobs
      </Typography>
      <Link to={`/jobs/create?date=${date}`}>
        <Button variant="outlined" startIcon={<AddIcon />} sx={{ mb: "20px" }}>
          Add new
        </Button>
      </Link>
      <DailyJobs date={date} />
    </>
  );
};
