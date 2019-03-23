import React, { Component } from "react";
import LoginPage from "./loginPage.jsx";
import RegisterForm from "./register.jsx";
import GameRooms from "./gameRooms.jsx";
import LoginForm from "./loginForm.jsx";
import { BrowserRouter, Route, Switch, Link, Redirect } from "react-router-dom";
import api from "./api";
import GameBoard from "./gameBoard.jsx";
import PrepareRoom from "./prepareRoom.jsx";

const checkAuth = () => {
  let res = api
    .get("/user")
    .then(res => {
      console.log(res);
      return true;
    })
    .catch(err => {
      console.log(err);
      return false;
    });
  return res;
};
const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      checkAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/"
          }}
        />
      )
    }
  />
);

class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <Switch>
        <Route exact path="/" component={LoginPage} />

        <Route exact path="/register/" component={RegisterForm} />
        <AuthRoute exact path="/rooms/" component={GameRooms} />
        <AuthRoute exact path="/rooms/:roomId/" component={PrepareRoom} />
      </Switch>
    );
  }
}
export default App;
