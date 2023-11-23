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

type CustomerTaxDataProps = {
  taxData: TaxData;
  customerId: string;
  onDelete: () => void;
};

export const CustomerTaxData: FC<CustomerTaxDataProps> = ({
  taxData,
  customerId,
  onDelete,
}) => {
  const [error, setError] = useState<ErrorCode | null>(null);

  const errorHandler = (code: ErrorCode) => setError(code);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Tax data
      </Typography>
      {error && <Error code={error} />}
      <Stack direction="row" spacing={2}>
        <Button variant="contained">Edit</Button>
        <DeleteCustomerTaxDataButton
          customerId={customerId}
          onDelete={onDelete}
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