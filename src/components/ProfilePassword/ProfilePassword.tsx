import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import { FC } from "react";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import * as yup from "yup";
import { useFormik } from "formik";

export type ProfilePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
};

const INITIAL_VALUES: ProfilePasswordFormValues = {
  oldPassword: "",
  newPassword: "",
};

const validationSchema = yup.object<ProfilePasswordFormValues>({
  password: yup.string().required().min(8),
});

type ProfilePasswordProps = {
  onChange: (formValues: ProfilePasswordFormValues) => void;
  loading?: boolean;
};

export const ProfilePassword: FC<ProfilePasswordProps> = ({
  onChange,
  loading = false,
}) => {
  const formik = useFormik<ProfilePasswordFormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema,
    onSubmit: onChange,
  });

  return (
    <>
      <Typography variant="h4">Change password</Typography>
      <Form onSubmit={formik.handleSubmit}>
        <PasswordInput
          value={formik.values.oldPassword}
          onChange={formik.handleChange}
          label="Current password"
          name="oldPassword"
        />
        <PasswordInput
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          label="New password"
          name="newPassword"
        />
        <LoadingButton loading={loading} variant="outlined" type="submit">
          Change password
        </LoadingButton>
      </Form>
    </>
  );
};
