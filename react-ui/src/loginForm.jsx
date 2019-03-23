import React, { Component } from "react";
import api from "./api.js";
import ReactDOM from "react-dom";
import ErrorMessage from "./errorMessage.jsx";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Redirect } from "react-router";

const url = username => `/users/${username}`;
class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: { content: "", shown: "" },
      username: "",
      password: "",
      remember: false,
      isAuth: false
    };
    this.handleOnChanges = this.handleOnChanges.bind(this);
  }

  handleOnChanges(event) {
    const value =
      event.type === "checkbox" ? event.target.checked : event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    if (!this.state.isAuth) {
      return (
        <div>
          <ErrorMessage
            onChange={this.handleOnError}
            error={this.state.error}
          />
          <div className="text-right">
            <a href="/register/">register</a>
          </div>

          <form onSubmit={this.login}>
            <div className="form-group">
              <label htmlFor="username"> Username </label>
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleOnChanges}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password"> Password </label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleOnChanges}
                required
              />
            </div>
            <label htmlFor="remember">
              <input
                type="checkbox"
                className="checkbox mb-3"
                name="remember"
                checked={this.state.remember}
                onChange={this.handleOnChanges}
              />
              Remember me
            </label>
            <div>
              <button type="submit" className="btn btn-primary">
                Log In
              </button>
            </div>
          </form>
        </div>
      );
    } else {

      // let path = url(this.state.username);
      return <Redirect to='/rooms/' />;
    }
  }

  handleOnError = (err, shown) => {
    let error = { ...this.state.error };
    error.content = err;
    error.shown = "alert alert-primary";
    this.setState({ error });
    this.setState({ password: "", username: "" });
  };

  login = event => {
    event.preventDefault();
    api
      .post("/signin/", {
        username: this.state.username,
        password: this.state.password
      })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.setState({ isAuth: true });
          // this.props.history.push("/");
        }
      })
      .catch(err => {
        if (err.response) {
          this.handleOnError(err.response.data);
        } else {
          this.handleOnError(err.message);
        }
      });
  };
}

export default LoginForm;
