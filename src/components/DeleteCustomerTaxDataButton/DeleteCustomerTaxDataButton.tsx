import { Button } from "@mui/material";
import { FC } from "react";
import { ErrorCode } from "../../services/error";
import { useDeleteCustomerTaxData } from "../../hooks/customers/tax-data/useDeleteCustomerTaxData";

type DeleteCustomerTaxDataButtonProps = {
  customerId: string;
  onError: (code: ErrorCode) => void;
};

export const DeleteCustomerTaxDataButton: FC<
  DeleteCustomerTaxDataButtonProps
> = ({ customerId, onError }) => {
  const { deleteCustomerTaxData, loading } =
    useDeleteCustomerTaxData(customerId);

  const clickHander = () => {
    deleteCustomerTaxData().catch((error) => {
      onError(error);
    });
  };
  return (
    <Button
      variant="contained"
      color="error"
      onClick={clickHander}
      loading={loading}
    >
      Delete
    </Button>
  );
};
