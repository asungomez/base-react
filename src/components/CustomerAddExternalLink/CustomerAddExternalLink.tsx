import { Button } from "@mui/material";
import { FC, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  CustomerExternalLinkForm,
  CustomerExternalLinkFormValues,
} from "../CustomerExternalLinkForm/CustomerExternalLinkForm";
import { useAddCustomerExternalLink } from "../../hooks/customers/external-links/useAddCustomerExternalLink";
import { Error } from "../Error/Error";

type CustomerAddExternalLinkProps = {
  customerId: string;
};

export const CustomerAddExternalLink: FC<CustomerAddExternalLinkProps> = ({
  customerId,
}) => {
  const [showForm, setShowForm] = useState(false);
  const { addExternalLink, loading, error } =
    useAddCustomerExternalLink(customerId);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const submitHandler = (formValues: CustomerExternalLinkFormValues) => {
    addExternalLink(formValues).then(() => closeForm());
  };
  return showForm ? (
    <>
      {error && <Error code={error} />}
      <CustomerExternalLinkForm
        onSubmit={submitHandler}
        onCancel={closeForm}
        loading={loading}
      />
    </>
  ) : (
    <Button variant="outlined" startIcon={<AddIcon />} onClick={openForm}>
      Add new
    </Button>
  );
};
