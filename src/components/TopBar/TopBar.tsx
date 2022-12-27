import {
  AppBar,
  Avatar,
  Box,
  Container,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Logo } from "./TopBar.style";

export const TopBar: FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const closeUserMenu = () => {
    setAnchorElUser(null);
  };

  const toUsers = () => navigate("/users");
  const toProfile = () => {
    closeUserMenu();
    navigate("/users/me");
  };
  const logOut = () => {
    closeUserMenu();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Bar disableGutters>
          <Logo variant="h6" noWrap onClick={toUsers}>
            AUTH
          </Logo>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={openUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Fake User">FU</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={closeUserMenu}
            >
              <MenuItem onClick={toProfile}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>

              <MenuItem onClick={logOut}>
                <Typography textAlign="center">Log out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Bar>
      </Container>
    </AppBar>
  );
};
