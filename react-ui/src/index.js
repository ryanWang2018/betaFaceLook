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

import { useRouterHistory } from "react-router";
import { createHistory } from "history";

const history = useRouterHistory(createHistory)({
  basename: "https://hidden-cliffs-49484.herokuapp.com/api"
});

ReactDOM.render(
  <BrowserRouter history={history}>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
serviceWorker.unregister();
