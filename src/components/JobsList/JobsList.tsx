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
  return (
    <List>
      {jobs.map((job) => (
        <ListItemButton
          onClick={() => navigate(`/jobs/${job.id}`)}
          key={job.id}
        >
          <ListItemText
            primary={job.name}
            secondary={`${job.date} ${job.startTime} - ${job.endTime}`}
          />
        </ListItemButton>
      ))}
    </List>
  );
};
