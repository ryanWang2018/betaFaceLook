import React, { Component } from "react";
import LoginForm from "./loginForm";
import { Link, Route, Switch } from "react-router-dom";
import RegisterForm from "./register.jsx";
class LoginPage extends Component {
  checkLoginForm = () => {
    console.log("set the loginPage to true");
    this.props.onLoginPage(true);
  };
  render() {
    return (
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-4 offset-md-4">
            <img src="/media/smile.png" alt="logo" />
          </div>
          <LoginForm
            className="col-md-4 offset-md-4"
            onLoginForm={this.checkLoginForm}
          />
        </div>
      </div>
    );
  }
}

export default LoginPage;
