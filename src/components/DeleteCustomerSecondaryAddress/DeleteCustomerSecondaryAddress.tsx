import { LoadingButton } from "@mui/lab";
import { FC } from "react";
import { useDeleteCustomerSecondaryAddress } from "../../hooks/customers/secondary-address/useDeleteCustomerSecondaryAddress";
import DeleteIcon from "@mui/icons-material/Delete";

type DeleteCustomerSecondaryAddressProps = {
  customerId: string;
  addressId: string;
};

export const DeleteCustomerSecondaryAddress: FC<
  DeleteCustomerSecondaryAddressProps
> = ({ customerId, addressId }) => {
  const { deleteCustomerSecondaryAddress, loading, error } =
    useDeleteCustomerSecondaryAddress(customerId, addressId);
  const clickHander = () => {
    deleteCustomerSecondaryAddress().catch(() => {
      console.error("Failed to delete secondary address", error);
    });
  };
  return (
    <LoadingButton
      variant="contained"
      color="error"
      onClick={clickHander}
      loading={loading}
    >
      <DeleteIcon />
    </LoadingButton>
  );
};
