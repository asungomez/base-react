import { FC, useEffect, useState } from "react";
import { CustomerAddress as CustomerAddressType } from "../../services/customers";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Error } from "../Error/Error";
import { CustomerAddress } from "../CustomerAddress/CustomerAddress";
import { ErrorCode } from "../../services/error";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useCustomers } from "../../context/CustomersContext";
import { DeleteCustomerMainAddressButton } from "../DeleteCustomerMainAddressButton.tsx/DeleteCustomerMainAddressButton";

type CustomerMainAddressProps = {
  customerId: string;
};

export const CustomerMainAddress: FC<CustomerMainAddressProps> = ({
  customerId,
}) => {
  const [address, setAddress] = useState<CustomerAddressType | null>(null);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getMainAddress } = useCustomers();

  useEffect(() => {
    if (loading) {
      getMainAddress(customerId)
        .then((address) => {
          setAddress(address);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [loading, customerId, getMainAddress]);

  const addMainAddressHandler = () =>
    navigate(`/customers/${customerId}/main-address/add`);

  const deleteErrorHandler = (error: ErrorCode) => setError(error);

  const deleteHandler = () => setAddress(null);

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
  if (!address) {
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
      <CustomerAddress address={address} />
    </>
  );
};
