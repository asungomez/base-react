import { FC } from "react";
import { CustomerSecondaryAddress } from "../../services/customers";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DeleteCustomerSecondaryAddress } from "../DeleteCustomerSecondaryAddress/DeleteCustomerSecondaryAddress";

type CustomerSecondaryAddressesTableProps = {
  addresses: CustomerSecondaryAddress[];
  customerId: string;
};

export const CustomerSecondaryAddressesTable: FC<
  CustomerSecondaryAddressesTableProps
> = ({ addresses, customerId }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Street</TableCell>
            <TableCell>Number</TableCell>
            <TableCell>Postal code</TableCell>
            <TableCell>City</TableCell>
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
