import { LoadingButton } from "@mui/lab";
import { FC } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import * as yup from "yup";
import { useFormik } from "formik";

export type ForgotPasswordFormValues = {
  email: string;
};

const EMPTY_FORM: ForgotPasswordFormValues = {
  email: "",
};

const validationSchema = yup.object<ForgotPasswordFormValues>({
  email: yup.string().email().required(),
});

type ForgotPasswordFormProps = {
  onSubmit: (values: ForgotPasswordFormValues) => void;
  loading?: boolean;
  initialValues?: ForgotPasswordFormValues;
};

export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
}) => {
  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <EmailInput
        value={formik.values.email}
        name="email"
        onChange={formik.handleChange}
      />
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Send
      </LoadingButton>
    </Form>
  );
};
