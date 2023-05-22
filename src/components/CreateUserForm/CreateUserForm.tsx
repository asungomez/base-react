import { LoadingButton } from "@mui/lab";
import { FC } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import * as yup from "yup";
import { useFormik } from "formik";

export type CreateUserFormValues = {
  email: string;
  password: string;
};

const EMPTY_FORM = {
  email: "",
  password: "",
};

const validationSchema = yup.object<CreateUserFormValues>({
  email: yup.string().email().required(),
  password: yup.string().required().min(8),
});

type CreateUserFormProps = {
  onSubmit: (values: CreateUserFormValues) => void;
  loading?: boolean;
  initialValues?: CreateUserFormValues;
};

export const CreateUserForm: FC<CreateUserFormProps> = ({
  onSubmit,
  loading = false,
  initialValues = EMPTY_FORM,
}) => {
  const formik = useFormik<CreateUserFormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <EmailInput
        value={formik.values.email}
        onChange={formik.handleChange}
        name="email"
      />
      <PasswordInput
        value={formik.values.password}
        onChange={formik.handleChange}
      />
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Create
      </LoadingButton>
    </Form>
  );
};
