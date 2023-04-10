import { Button, CircularProgress, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { UsersTable } from "../../components/UsersTable/UsersTable";
import { getUsers, User } from "../../services/authentication";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { ErrorCode } from "../../services/error";
import { Error } from "../../components/Error/Error";

export const UsersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();

  const toCreateUser = () => navigate("/users/create");

  useEffect(() => {
    if (loading) {
      setError(null);
      getUsers()
        .then((users) => {
          setLoading(false);
          setUsers(users);
        })
        .catch((error) => {
          setError(error);
        });
    }
  }, [loading, setUsers, setLoading]);

  if (error) {
    return <Error code={error} />;
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
