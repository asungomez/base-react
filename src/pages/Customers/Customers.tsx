import { CircularProgress, ListItemButton, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { CustomerItem } from "../../components/CustomerItem/CustomerItem";
import { CustomersList } from "./Customers.style";
import { Customer, getCustomers } from "../../services/customers";

export const CustomersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (loading) {
      getCustomers().then((customers) => {
        setLoading(false);
        setCustomers(customers);
      });
    }
  }, [loading, setLoading]);

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Customers
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <CustomersList>
          {customers.map((customer) => (
            <ListItemButton key={customer.id}>
              <CustomerItem customer={customer} />
            </ListItemButton>
          ))}
        </CustomersList>
      )}
    </>
  );
};
