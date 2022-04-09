import "./App.css";
import { Login, Register } from "./../pages/auth";
import { Dashboard, BookPage, AddBookPage } from "./../pages";
import { auth } from "../pages/auth/firebase";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Header from "../common/Header/Header";

export const App = () => {
  const [user, isLoading] = useAuthState(auth);

  if (isLoading) {
    return (
      <div className="view">
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  console.log({ user });

  return (
    <div className="main">
      <BrowserRouter>
        {user && <Header/>}
        {!user ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<DefaultRoute />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/book/:id" element={<BookPage />} />
            <Route path="/book/add" element={<AddBookPage />} />
            <Route path="*" element={<DefaultRoute isAuth />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
};

const DefaultRoute = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    props.isAuth && navigate("/dashboard", { replace: true });
    !props.isAuth && navigate("/login", { replace: true });
  }, [props.isAuth]);

  return "";
};

export default App;
