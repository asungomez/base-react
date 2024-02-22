import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { FC, useState } from "react";
import { DeleteCustomerExternalLinkButton } from "../DeleteCustomerExternalLinkButton/DeleteCustomerExternalLinkButton";
import { ErrorCode } from "../../services/error";
import {
  CustomerExternalLinkForm,
  CustomerExternalLinkFormValues,
} from "../CustomerExternalLinkForm/CustomerExternalLinkForm";
import EditIcon from "@mui/icons-material/Edit";
import { useEditCustomerExternalLink } from "../../hooks/customers/external-links/useEditCustomerExternalLink";

type CustomerExternalLinkProps = {
  url: string;
  customerId: string;
  index: number;
};

export const CustomerExternalLink: FC<CustomerExternalLinkProps> = ({
  url,
  customerId,
  index,
}) => {
  const [showForm, setShowForm] = useState(false);
  const { loading, error, editExternalLink } =
    useEditCustomerExternalLink(customerId);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const errorHandler = (error: ErrorCode) => {
    console.error(error);
  };

  const submitHandler = (values: CustomerExternalLinkFormValues) => {
    editExternalLink({ url: values.url, index })
      .then(() => {
        closeForm();
      })
      .catch(() => {
        if (error) {
          errorHandler(error);
        }
      });
  };

  return showForm ? (
    <CustomerExternalLinkForm
      onSubmit={submitHandler}
      onCancel={closeForm}
      loading={loading}
      initialValues={{ url }}
    />
  ) : (
    <ListItem
      secondaryAction={
        <>
          <DeleteCustomerExternalLinkButton
            onDeleteError={errorHandler}
            customerId={customerId}
            index={index}
          />
          <IconButton edge="end" aria-label="update" onClick={openForm}>
            <EditIcon />
          </IconButton>
        </>
      }
    >
      <ListItemButton component="a" href={url} target="_blank">
        <ListItemText primary={url} />
      </ListItemButton>
    </ListItem>
  );
};
