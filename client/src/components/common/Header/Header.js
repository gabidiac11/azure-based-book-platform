import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { auth, logout } from "../../pages/auth/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import RecorderButton from "./../RecorderButton/RecorderButton";

const settings = ["Logout"];

export default function Header() {
  const [user] = useAuthState(auth);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);

    switch (setting) {
      case "Logout":
        logout();
        break;
    }
  };

  const sendAudio = async ([buffer, blob]) => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 4000);
    });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <RecorderButton sendAudio={sendAudio}  />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={handleOpenUserMenu}
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  style={{ lineHeight: "50px", paddingRight: "10px" }}
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  {user?.displayName || user?.email}
                </Typography>
                <IconButton sx={{ p: 0 }}>
                  {!user?.photoURL && <AccountCircle htmlColor="white" />}
                  {user?.photoURL && (
                    <Avatar alt={user?.displayName} src={user?.photoURL} />
                  )}
                </IconButton>
              </div>
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
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
