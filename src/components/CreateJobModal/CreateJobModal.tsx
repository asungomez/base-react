import { FC } from "react";
import { useCreateJob } from "../../hooks/jobs/useCreateJob";
import { JobForm, JobFormValues } from "../JobForm/JobForm";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import dayjs from "dayjs";

type CreateJobModalProps = {
  initialValues?: Partial<JobFormValues>;
  onClose: () => void;
};

export const CreateJobModal: FC<CreateJobModalProps> = ({
  initialValues: initialValuesProp = {},
  onClose,
}) => {
  const { createJob, loading, error } = useCreateJob();

  const submitHandler = (values: JobFormValues, file: File | null) => {
    createJob({ formValues: values, image: file })
      .then(() => {
        onClose();
      })
      .catch(() => {
        // The hook should handle the error and set the error
      });
  };

  const initialValues: JobFormValues = {
    name: "",
    addresses: [],
    date: dayjs(),
    startTime: dayjs(),
    endTime: dayjs().add(1, "hour"),
    ...initialValuesProp,
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Create job</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {error && <ErrorMessage code={error} />}
        <JobForm
          onSubmit={submitHandler}
          loading={loading}
          initialValues={initialValues}
        />
        <Button size="small" color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};
