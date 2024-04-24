import { FC } from "react";
import { CustomerSecondaryAddress } from "../../services/customers";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DeleteCustomerSecondaryAddress } from "../DeleteCustomerSecondaryAddress/DeleteCustomerSecondaryAddress";
import EditIcon from "@mui/icons-material/Edit";

type CustomerSecondaryAddressesTableProps = {
  addresses: CustomerSecondaryAddress[];
  customerId: string;
  onEditClick: (addressId: string) => void;
};

export const CustomerSecondaryAddressesTable: FC<
  CustomerSecondaryAddressesTableProps
> = ({ addresses, customerId, onEditClick }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Street</TableCell>
            <TableCell>Number</TableCell>
            <TableCell>Postal code</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Update</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addresses.map((address) => (
            <TableRow key={address.id}>
              <TableCell>{address.street}</TableCell>
              <TableCell>{address.number}</TableCell>
              <TableCell>{address.postcode}</TableCell>
              <TableCell>{address.city}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => onEditClick(address.id)}
                >
                  <EditIcon />
                </Button>
              </TableCell>
              <TableCell>
                <DeleteCustomerSecondaryAddress
                  customerId={customerId}
                  addressId={address.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
