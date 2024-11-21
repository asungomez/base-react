import { Button, CircularProgress, Typography } from "@mui/material";
import { FC } from "react";
import { UsersTable } from "../../components/UsersTable/UsersTable";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { useUsers } from "../../hooks/users/useUsers";

export const UsersPage: FC = () => {
  const { users, loading, error } = useUsers();
  const navigate = useNavigate();
  const toCreateUser = () => navigate("/users/create");

  if (error) {
    return <ErrorMessage code={error} />;
  }
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Users
      </Typography>
      <Button startIcon={<AddIcon />} onClick={toCreateUser}>
        New user
      </Button>
      {loading ? <CircularProgress /> : <UsersTable users={users} />}
    </>
  );
};
