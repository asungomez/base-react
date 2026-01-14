import { FC } from "react";
import { Button } from "@mui/material";
import { ErrorCode } from "../../services/error";
import { useDeleteJob } from "../../hooks/jobs/useDeleteJob";

type DeleteJobButtonProps = {
  jobId: string;
  onDelete: () => void;
  onError: (code: ErrorCode) => void;
};

export const DeleteJobButton: FC<DeleteJobButtonProps> = ({
  jobId,
  onDelete,
  onError,
}) => {
  const { deleteJob, loading } = useDeleteJob(jobId);
  const deleteHandler = () => {
    deleteJob()
      .then(() => {
        onDelete();
      })
      .catch((error) => {
        onError(error);
      });
  };
  return (
    <Button
      variant="contained"
      color="error"
      onClick={deleteHandler}
      loading={loading}
    >
      Delete
    </Button>
  );
};
