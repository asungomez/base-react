import { FC, useState } from "react";
import { TaxData } from "../../services/customers";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { DeleteCustomerTaxDataButton } from "../DeleteCustomerTaxDataButton/DeleteCustomerTaxDataButton";
import { Error } from "../Error/Error";
import { ErrorCode } from "../../services/error";
import { useNavigate } from "react-router-dom";

type CustomerTaxDataProps = {
  taxData: TaxData;
  customerId: string;
};

export const CustomerTaxData: FC<CustomerTaxDataProps> = ({
  taxData,
  customerId,
}) => {
  const [error, setError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();

  const errorHandler = (code: ErrorCode) => setError(code);
  const editHandler = () => navigate(`/customers/${customerId}/tax-data/edit`);

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Tax data
      </Typography>
      {error && <Error code={error} />}
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={editHandler}>
          Edit
        </Button>
        <DeleteCustomerTaxDataButton
          customerId={customerId}
          onError={errorHandler}
        />
      </Stack>
      <List>
        <ListItem>
          <ListItemText primary="Tax ID" secondary={taxData.taxId} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Company name"
            secondary={taxData.companyName}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Company address"
            secondary={taxData.companyAddress}
          />
        </ListItem>
      </List>
    </>
  );
};
