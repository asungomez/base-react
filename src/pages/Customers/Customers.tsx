import {
  Button,
  CircularProgress,
  ListItemButton,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { CustomerItem } from "../../components/CustomerItem/CustomerItem";
import { CustomersList } from "./Customers.style";
import { Customer, getCustomers } from "../../services/customers";
import { useNavigate } from "react-router-dom";

export const CustomersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      getCustomers().then((customers) => {
        setLoading(false);
        setCustomers(customers);
      });
    }
  }, [loading, setLoading]);

  const onCreate = () => {
    navigate("/customers/create");
  };

  const onCustomerClick = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Customers
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Button onClick={onCreate}>Create new customer</Button>
          <CustomersList>
            {customers.map((customer) => (
              <ListItemButton
                key={customer.id}
                onClick={() => onCustomerClick(customer)}
              >
                <CustomerItem customer={customer} />
              </ListItemButton>
            ))}
          </CustomersList>
        </>
      )}
    </>
  );
};
