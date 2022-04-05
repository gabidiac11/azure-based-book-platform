import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app/App";
import reportWebVitals from "./reportWebVitals";
import { AppContextProvider } from "./context";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import axios from "axios";
import { BASE_URL } from "./constants";
import "./index.css";

axios.defaults.baseURL = BASE_URL;

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <App />
      </LocalizationProvider>
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
