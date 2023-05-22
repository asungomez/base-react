import { LoadingButton } from "@mui/lab";
import { FC } from "react";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import * as yup from "yup";
import { useFormik } from "formik";

export type ResetPasswordFormValues = {
  password: string;
};

const EMPTY_FORM: ResetPasswordFormValues = {
  password: "",
};

const validationSchema = yup.object<ResetPasswordFormValues>({
  password: yup.string().required().min(8),
});

type ResetPasswordFormProps = {
  onSubmit: (values: ResetPasswordFormValues) => void;
  loading?: boolean;
  initialValues?: ResetPasswordFormValues;
};

export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
}) => {
  const formik = useFormik<ResetPasswordFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <PasswordInput
        value={formik.values.password}
        onChange={formik.handleChange}
        name="password"
      />
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Change password
      </LoadingButton>
    </Form>
  );
};
