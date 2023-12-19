import { LoadingButton } from "@mui/lab";
import { FC, useState } from "react";
import { useCustomers } from "../../context/CustomersContext";
import { ErrorCode, isErrorCode } from "../../services/error";

type DeleteCustomerMainAddressButtonProps = {
  customerId: string;
  onDelete: () => void;
  onError: (code: ErrorCode) => void;
};

export const DeleteCustomerMainAddressButton: FC<
  DeleteCustomerMainAddressButtonProps
> = ({ customerId, onDelete, onError }) => {
  const [loading, setLoading] = useState(false);
  const { deleteMainAddress } = useCustomers();

  const clickHander = () => {
    setLoading(true);
    deleteMainAddress(customerId)
      .then(() => {
        setLoading(false);
        onDelete();
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error.message)) {
          onError(error.message);
        } else {
          onError("INTERNAL_ERROR");
        }
      });
  };
  return (
    <LoadingButton
      variant="contained"
      color="error"
      onClick={clickHander}
      loading={loading}
    >
      Delete
    </LoadingButton>
  );
};
