import { FC } from "react";
import { Avatar, ListItemAvatar, ListItemText } from "@mui/material";

import { Customer } from "../../services/customers";
import { CustomerIcon } from "../CustomerIcon/CustomerIcon";

type CustomerItemProps = {
  customer: Customer;
};

export const CustomerItem: FC<CustomerItemProps> = ({ customer }) => {
  return (
    <>
      <ListItemAvatar>
        <Avatar>
          <CustomerIcon type={customer.type} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={customer.name} secondary={customer.email} />
    </>
  );
};
