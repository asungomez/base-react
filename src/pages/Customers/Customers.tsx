import {
  Button,
  CircularProgress,
  ListItemButton,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { CustomerItem } from "../../components/CustomerItem/CustomerItem";
import { CustomersList } from "./Customers.style";
import { Customer } from "../../services/customers";
import { useNavigate } from "react-router-dom";
import { useCustomers } from "../../hooks/useCustomers";
import { Error } from "../../components/Error/Error";
import { LoadingButton } from "@mui/lab";
import { SearchBar } from "../../components/SearchBar/SearchBar";

export const CustomersPage: FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const { customers, error, loading, loadMore, moreToLoad, loadingMore } =
    useCustomers(searchInput);

  const onCreate = () => {
    navigate("/customers/create");
  };

  const onCustomerClick = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const searchHandler = (searchInput: string) => {
    setSearchInput(searchInput);
  };

  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Customers
        </Typography>
        <SearchBar onSearch={searchHandler} initialValue={searchInput} />
        <CircularProgress />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Customers
        </Typography>
        <Error code={error} />
      </>
    );
  }

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Customers
      </Typography>
      <>
        <SearchBar onSearch={searchHandler} initialValue={searchInput} />
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
        {moreToLoad && (
          <LoadingButton
            variant="text"
            onClick={loadMore}
            loading={loadingMore}
          >
            Load more
          </LoadingButton>
        )}
      </>
    </>
  );
};
