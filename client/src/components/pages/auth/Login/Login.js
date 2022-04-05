import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "./../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { withEnter } from "../../../../utils";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, error] = useAuthState(auth);

  return (
    <div className="view">
      <div className="form">
        <TextField
          label="E-mail Address"
          size="medium"
          name="login-email"
          className="text-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          type="password"
          label="Password"
          className="text-box"
          value={password}
          name="login-password"
          onKeyUp={(e) =>
            withEnter(e, () => logInWithEmailAndPassword(email, password))
          }
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="buttons">
          <Button
            variant="contained"
            size="medium"
            onClick={() => logInWithEmailAndPassword(email, password)}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GoogleIcon />}
            onClick={signInWithGoogle}
          >
            Login with Google
          </Button>

          <div>
            No account? <Link to="/register">Register</Link> now.
          </div>
        </div>

        {loading && <>Loading...</>}
        {error && <>{error.message}...</>}
      </div>
    </div>
  );
}

export default Login;
