import React, { Component } from "react";
import LoginPage from "./LoginPage";
import RegisterForm from "./register";
import GameRooms from "./GameRooms.jsx";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import api from "./api";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
  }

  componentDidMount() {
    api
      .get("/user", null)
      .then(res => {
        if (res.status === 200) {
          console.log(res);
          this.setState({ isLogin: true });
        } else {
          this.setState({ isLogin: false });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/">
            <LoginPage isLogin={this.state.isLogin} />
          </Route>

          <Route path="/register" component={RegisterForm} />

          <Route path="/rooms">
            <GameRooms isLogin={this.state.isLogin} />
          </Route>
        </Switch>
      </div>
    );
  }
}
export default App;
