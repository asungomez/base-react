import { FC } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Error } from "../Error/Error";
import { CustomerAddress } from "../CustomerAddress/CustomerAddress";
import { ErrorCode } from "../../services/error";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { DeleteCustomerMainAddressButton } from "../DeleteCustomerMainAddressButton.tsx/DeleteCustomerMainAddressButton";
import { useCustomerMainAddress } from "../../hooks/customers/main-address/useCustomerMainAddress";

type CustomerMainAddressProps = {
  customerId: string;
};

export const CustomerMainAddress: FC<CustomerMainAddressProps> = ({
  customerId,
}) => {
  const navigate = useNavigate();
  const { customerMainAddress, loading, error } =
    useCustomerMainAddress(customerId);

  const addMainAddressHandler = () =>
    navigate(`/customers/${customerId}/main-address/add`);

  const deleteErrorHandler = (error: ErrorCode) => {
    // setError(error)
  };

  const deleteHandler = () => {
    // setAddress(null)
  };

  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Main address
        </Typography>
        <CircularProgress />
      </>
    );
  }
  if (error) {
    return <Error code={error} />;
  }
  if (!customerMainAddress) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Main address
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addMainAddressHandler}
        >
          Add main address
        </Button>
      </>
    );
  }
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Main address
      </Typography>
      {error && <Error code={error} />}
      <Stack direction="row" spacing={2}>
        <Button variant="contained">Edit</Button>
        <DeleteCustomerMainAddressButton
          customerId={customerId}
          onError={deleteErrorHandler}
          onDelete={deleteHandler}
        />
      </Stack>
      <CustomerAddress address={customerMainAddress} />
    </>
  );
};
