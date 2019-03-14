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
    api
      .get("/user/", null)
      .then(res => {
        if (res.status === 200) {
          this.setState({ isLogin: true });
        } else {
          this.setState({ isLogin: false });
        }
      })
      .catch(err => {
        console.log(err);
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
          <Route path="/rooms">
            <GameRooms isLogin={this.state.isLogin} />
          </Route>

          <Route path="/?" component={RegisterForm}>
            {console.log(this.props.location)}
          </Route>
        </Switch>
      </div>
    );
  }
}
export default App;
