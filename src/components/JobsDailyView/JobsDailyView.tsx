import { Stack, Button, Typography } from "@mui/material";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs from "dayjs";
import { DailyJobs } from "../DailyJobs/DailyJobs";

export const JobsDailyView: FC = () => {
  const initialDate = dayjs();
  const [date, setDate] = useState(initialDate);
  const dateString = date.format("YYYY-MM-DD");
  const title = date.format("dddd, MMMM D, YYYY");
  const previousDayHandler = () => {
    setDate((date) => date.subtract(1, "day"));
  };

  const nextDayHandler = () => {
    setDate((date) => date.add(1, "day"));
  };
  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: "20px" }}>
        <Button
          variant="outlined"
          onClick={previousDayHandler}
          startIcon={<ArrowBackIosIcon />}
        >
          Previous
        </Button>
        <Typography variant="h4">{title}</Typography>
        <Button
          variant="outlined"
          onClick={nextDayHandler}
          endIcon={<ArrowForwardIosIcon />}
        >
          Next
        </Button>
      </Stack>

      <Link to={`/jobs/create?date=${dateString}`}>
        <Button variant="outlined" startIcon={<AddIcon />} sx={{ mb: "20px" }}>
          Add new
        </Button>
      </Link>
      <DailyJobs date={dateString} />
    </>
  );
};
