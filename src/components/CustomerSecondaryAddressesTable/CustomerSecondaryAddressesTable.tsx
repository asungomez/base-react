import { FC } from "react";
import { CustomerSecondaryAddress } from "../../services/customers";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { DeleteCustomerSecondaryAddress } from "../DeleteCustomerSecondaryAddress/DeleteCustomerSecondaryAddress";

type CustomerSecondaryAddressesTableProps = {
  addresses: CustomerSecondaryAddress[];
  customerId: string;
};

export const CustomerSecondaryAddressesTable: FC<
  CustomerSecondaryAddressesTableProps
> = ({ addresses, customerId }) => {
  const columns: GridColDef<CustomerSecondaryAddress>[] = [
    {
      field: "street",
      headerName: "Street",
    },
    {
      field: "number",
      headerName: "Number",
    },
    {
      field: "postcode",
      headerName: "Postal code",
    },
    {
      field: "city",
      headerName: "City",
    },
    {
      field: "id",
      headerName: "Delete",
      renderCell: ({ value: addressId }) => (
        <DeleteCustomerSecondaryAddress
          customerId={customerId}
          addressId={addressId}
        />
      ),
    },
  ];
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid columns={columns} rows={addresses} />
    </Box>
  );
};
