import { FC } from "react";
import { Job } from "../../services/jobs";
import { Alert, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

type JobsListProps = {
  jobs: Job[];
};

export const JobsList: FC<JobsListProps> = ({ jobs }) => {
  const navigate = useNavigate();
  if (jobs.length === 0) {
    return <Alert severity="warning">No jobs found.</Alert>;
  }

  const jobText = (job: Job): string | React.ReactNode => {
    const dateAndTime = `${job.date} ${job.startTime} - ${job.endTime}`;
    if (job.assignedTo) {
      const assignedTo = [job.assignedTo.name, job.assignedTo.email]
        .filter(Boolean)
        .join(" - ");
      return (
        <>
          {assignedTo}
          <br />
          {dateAndTime}
        </>
      );
    }
    return dateAndTime;
  };
  return (
    <List>
      {jobs.map((job) => (
        <ListItemButton
          onClick={() => navigate(`/jobs/${job.id}`)}
          key={job.id}
        >
          <ListItemText primary={job.name} secondary={jobText(job)} />
        </ListItemButton>
      ))}
    </List>
  );
};
