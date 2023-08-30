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
import { LoadingButton } from "@mui/lab";

export const CustomersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      getCustomers().then(({ customers, nextToken }) => {
        setLoading(false);
        setCustomers(customers);
        setNextToken(nextToken);
      });
    }
  }, [loading, setLoading]);

  const onCreate = () => {
    navigate("/customers/create");
  };

  const onCustomerClick = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const loadMoreHandler = () => {
    if (nextToken) {
      setLoadingMore(true);
      getCustomers(nextToken)
        .then(({ customers, nextToken }) => {
          setLoadingMore(false);
          setCustomers((prevCustomers) => [...prevCustomers, ...customers]);
          setNextToken(nextToken);
        })
        .catch(() => {
          setLoadingMore(false);
          setNextToken(undefined);
        });
    }
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
          {nextToken && (
            <LoadingButton
              variant="text"
              onClick={loadMoreHandler}
              loading={loadingMore}
            >
              Load more
            </LoadingButton>
          )}
        </>
      )}
    </>
  );
};
