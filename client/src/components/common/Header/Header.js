import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { auth, logout } from "../../pages/auth/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Alert,
  Avatar,
  Menu,
  MenuItem,
  Snackbar,
  Tooltip,
} from "@mui/material";
import RecorderButton from "./../RecorderButton/RecorderButton";
import axios from "axios";
import { useNavigate } from "react-router";

const settings = ["Logout"];

export default function Header() {
  const [user] = useAuthState(auth);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [snack, setSnack] = useState({
    message: "",
    open: false,
    severity: "error",
  });
  const navigate = useNavigate();

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

  const processVoiceCommand = (text) => {
    if(typeof text !== "string") {
      text = "";
    }
    const textLc = text.toLowerCase();

    if(textLc.indexOf("go to dashboard") > -1) {
      setSnack({
        message: `Command: GO-TO-DASHBOARD (recognised text: '${text}')`,
        open: true,
        severity: "success",
      });
      navigate("/dashboard");
      return;
    }
    
    if(textLc.indexOf("go back") > -1) {
      setSnack({
        message: `Command: GO-BACK (recognised text: '${text}')`,
        open: true,
        severity: "success",
      });
      navigate(-1);
      return;
    }

    if(textLc.indexOf("go forward") > -1) {
      setSnack({
        message: `Command: GO-FORWARD (recognised text: '${text}')`,
        open: true,
        severity: "success",
      });
      navigate(1);
      return;
    }

    if(/log[\s]*out/.test(textLc)) {
      setSnack({
        message: `Command: logout (recognised text: '${text}')`,
        open: true,
        severity: "success",
      });
      setTimeout(() => {
        logout();
      }, 1000);
      return;
    }

    if(/add book/.test(textLc)) {
      setSnack({
        message: `Command: add book (recognised text: '${text}')`,
        open: true,
        severity: "success",
      });
      navigate("/book/add");
      return;
    }

    if(/open book [\d]+/.test(textLc)) {
      const id = Number(textLc.match(/open book ([\d]+)/)[1]);
      setSnack({
        message: `Command: open item (recognised text: '${text}')`,
        open: true,
        severity: "success",
      });
      navigate(`/book/${id}`);
      return;
    }

    setSnack({
      message: `No command for recognised text: '${text}'`,
      open: true,
      severity: "warning",
    });
  };

  const sendAudio = async (blob) => {
    const file = new File([blob], "audioFile.ogg");

    const formData = new FormData();
    formData.append("audioFile", file, "audioFile");

    try {
      const response = await axios.post("audio/text", formData);
      if (response.data.recognised) {
        processVoiceCommand(response.data.text);
      } else {
        setSnack({
          message: "No match",
          open: true,
          severity: "error",
        });
      }
    } catch (err) {
      const message = err?.response?.data?.message
        ? "Server: " + err?.response?.data?.message
        : err?.message;

      setSnack({
        message,
        open: true,
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <RecorderButton sendAudio={sendAudio} />
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
      <Snackbar
        open={snack.open}
        autoHideDuration={12000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
