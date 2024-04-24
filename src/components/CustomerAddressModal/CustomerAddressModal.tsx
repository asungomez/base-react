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
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { useCustomerAddSecondaryAddress } from "../../hooks/customers/secondary-address/useAddCustomerSecondaryAddress";
import { useCustomerEditSecondaryAddress } from "../../hooks/customers/secondary-address/useEditCustomerSecondaryAddress";
import { useAddCustomerMainAddress } from "../../hooks/customers/main-address/useAddCustomerMainAddress";
import { useEditCustomerMainAddress } from "../../hooks/customers/main-address/useEditCustomerMainAddress";

type CustomerAddressModalProps = {
  customerId: string;
  onClose: () => void;
  open: boolean;
  initialValues?: CustomerAddressFormValues;
  addressId?: string;
  addressType: "main" | "secondary";
};

export const CustomerAddressModal: FC<CustomerAddressModalProps> = ({
  customerId,
  onClose,
  open,
  initialValues,
  addressId,
  addressType,
}) => {
  const {
    addCustomerSecondaryAddress,
    loading: creatingSecondary,
    error: secondaryCreationError,
  } = useCustomerAddSecondaryAddress(customerId);
  const {
    editCustomerSecondaryAddress,
    loading: editingSecondary,
    error: secondaryEditionError,
  } = useCustomerEditSecondaryAddress(customerId, addressId);
  const {
    addCustomerMainAddress,
    loading: creatingMain,
    error: mainCreationError,
  } = useAddCustomerMainAddress(customerId);
  const {
    editCustomerMainAddress,
    loading: editingMain,
    error: mainEditionError,
  } = useEditCustomerMainAddress(customerId);

  const submitHandler = (address: CustomerAddressFormValues) => {
    // If the address ID is specified, this is an edit
    if (addressId) {
      if (addressType === "main") {
        editCustomerMainAddress(address)
          .then(onClose)
          .catch(() => {
            // Do nothing, error is handled by the hook
          });
      } else {
        editCustomerSecondaryAddress(address)
          .then(onClose)
          .catch(() => {
            // Do nothing, error is handled by the hook
          });
      }
    }
    // If not, this is a new address
    else if (addressType === "main") {
      addCustomerMainAddress(address)
        .then(onClose)
        .catch(() => {
          // Do nothing, error is handled by the hook
        });
      return;
    } else {
      addCustomerSecondaryAddress(address)
        .then(onClose)
        .catch(() => {
          // Do nothing, error is handled by the hook
        });
    }
  };

  const error =
    secondaryCreationError ??
    secondaryEditionError ??
    mainCreationError ??
    mainEditionError;
  const loading =
    editingSecondary || creatingSecondary || creatingMain || editingMain;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {addressId ? "Edit address" : "Add address"}
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
        {error && <ErrorMessage code={error} />}
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
