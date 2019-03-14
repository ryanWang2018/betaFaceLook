import React, { Component } from "react";
import LoginPage from "./LoginPage";
import RegisterForm from "./register";
import GameRooms from "./GameRooms.jsx";
import LoginForm from "./loginForm";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import api from "./api";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
    api.get("/user/", null).then(res => {
      if (res.status === 200) {
        this.setState({ isLogin: true });
      } else {
        this.setState({ isLogin: false });
      }
    });
  }
  checkLoginPage = value => {
    this.setState({ isLogin: true });
  };

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/">
            <LoginPage onLoginPage={this.checkLoginPage} />
          </Route>
          <Route path="/register" component={RegisterForm} />
          <Route path="/gameRooms">
            <GameRooms isLogin={this.state.isLogin} />
          </Route>
        </Switch>
      </div>
    );
  }
}
export default App;
