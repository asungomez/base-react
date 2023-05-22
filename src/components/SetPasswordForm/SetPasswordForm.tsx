import { LoadingButton } from "@mui/lab";
import { FC } from "react";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import * as yup from "yup";
import { useFormik } from "formik";

export type SetPasswordFormValues = {
  password: string;
};

const EMPTY_FORM: SetPasswordFormValues = {
  password: "",
};

const validationSchema = yup.object<SetPasswordFormValues>({
  password: yup.string().required().min(8),
});

type SetPasswordFormProps = {
  onSubmit: (values: SetPasswordFormValues) => void;
  loading?: boolean;
  initialValues?: SetPasswordFormValues;
};

export const SetPasswordForm: FC<SetPasswordFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
}) => {
  const formik = useFormik<SetPasswordFormValues>({
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
