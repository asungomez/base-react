import { FC } from "react";
import {
  CustomerAddressForm,
  CustomerAddressFormValues,
} from "../CustomerAddressForm/CustomerAddressForm";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useCustomerAddSecondaryAddress } from "../../hooks/customers/secondary-address/useAddCustomerSecondaryAddress";
import { Error } from "../Error/Error";
import { useCustomerEditSecondaryAddress } from "../../hooks/customers/secondary-address/useEditCustomerSecondaryAddress";

type CustomerSecondaryAddressModalProps = {
  customerId: string;
  onClose: () => void;
  open: boolean;
  initialValues?: CustomerAddressFormValues;
  addressId?: string;
};

export const CustomerSecondaryAddressModal: FC<
  CustomerSecondaryAddressModalProps
> = ({ customerId, onClose, open, initialValues, addressId }) => {
  const {
    addCustomerSecondaryAddress,
    loading: creating,
    error: creationError,
  } = useCustomerAddSecondaryAddress(customerId);
  const {
    editCustomerSecondaryAddress,
    loading: editing,
    error: editionError,
  } = useCustomerEditSecondaryAddress(customerId, addressId);

  const submitHandler = (address: CustomerAddressFormValues) => {
    if (addressId) {
      // If the address ID is specified, this is an edit
      editCustomerSecondaryAddress(address)
        .then(onClose)
        .catch(() => {
          // Do nothing, error is handled by the hook
        });
    } else {
      // If not, this is a new address
      addCustomerSecondaryAddress(address)
        .then(onClose)
        .catch(() => {
          // Do nothing, error is handled by the hook
        });
    }
  };

  const error = creationError ?? editionError;
  const loading = editing || creating;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Modal title
      </DialogTitle>
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
        {error && <Error code={error} />}
        <CustomerAddressForm
          onSubmit={submitHandler}
          loading={loading}
          defaultValues={initialValues}
        />
        <Button size="small" color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};
