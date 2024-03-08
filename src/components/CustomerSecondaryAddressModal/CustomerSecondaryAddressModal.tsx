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

type CustomerSecondaryAddressModalProps = {
  customerId: string;
  onClose: () => void;
  open: boolean;
};

export const CustomerSecondaryAddressModal: FC<
  CustomerSecondaryAddressModalProps
> = ({ customerId, onClose, open }) => {
  const { addCustomerSecondaryAddress, loading, error } =
    useCustomerAddSecondaryAddress(customerId);

  const submitHandler = (address: CustomerAddressFormValues) => {
    addCustomerSecondaryAddress(address)
      .then(onClose)
      .catch(() => {
        // Do nothing, error is handled by the hook
      });
  };

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
        <CustomerAddressForm onSubmit={submitHandler} loading={loading} />
        <Button size="small" color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};
