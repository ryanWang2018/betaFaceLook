import React from "react";
import ReactDOM from "react-dom";
// import './index.css';
import LoginForm from "./loginForm.jsx";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./LoginPage.jsx";
/* import BrowserRouter from 'react-router-dom' */
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,

  document.getElementById("root")
);
serviceWorker.unregister();
