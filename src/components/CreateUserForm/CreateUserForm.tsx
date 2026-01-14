import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
} from "@mui/material";
import { ComponentType, FC } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { Form } from "../Form/Form";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import * as yup from "yup";
import { useFormik } from "formik";
import { CirclePicker, CirclePickerProps, ColorResult } from "react-color";

export type CreateUserFormValues = {
  email: string;
  password: string;
  color: string;
};

const EMPTY_FORM = {
  email: "",
  password: "",
  color: "#f44336",
};

const validationSchema = yup.object<CreateUserFormValues>({
  email: yup.string().email().required(),
  password: yup.string().required().min(8),
  color: yup.string().required(),
});

type CreateUserFormProps = {
  onSubmit: (values: CreateUserFormValues) => void;
  loading?: boolean;
  initialValues?: CreateUserFormValues;
};

const CirclePickerComponent = CirclePicker as ComponentType<CirclePickerProps>;

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

  const colorChangeHandler = (color: ColorResult) => {
    formik.handleChange({
      target: {
        name: "color",
        value: color.hex,
      },
    });
  };

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
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Pick a color" />
        <CardMedia
          sx={{ backgroundColor: formik.values.color, height: 50 }}
          component="div"
        />
        <CardContent>
          <CirclePickerComponent
            color={formik.values.color}
            onChange={colorChangeHandler}
          />
        </CardContent>
      </Card>

      <Button loading={loading} variant="outlined" type="submit">
        Create
      </Button>
    </Form>
  );
};
