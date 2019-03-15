import React, { Component } from "react";
import api from "./api.js";
import ErrorMessage from "./errorMessage.jsx";
class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
      error: { content: "", shown: "" }
    };
    this.handleOnChanges = this.handleOnChanges.bind(this);
  }

  handleOnChanges(event) {
    event.preventDefault();

    //
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div>
        <a href="/" className="btn btn-sm btn-dark" role="button">
          Back
        </a>
        <ErrorMessage onChange={this.handleOnError} error={this.state.error} />
        <form
          onSubmit={this.register}
          id="register_form"
          className="complex_form"
        >
          <div className="register_form_elmt">
            <label>
              username:
              <input
                className="register_form_element"
                type="text"
                name="username"
                value={this.state.username}
                id="username"
                placeholder="Username"
                onChange={this.handleOnChanges}
                required
              />
            </label>
          </div>
          <div className="register_form_elmt">
            <label>
              password:
              <input
                className="register_form_element"
                type="password"
                name="password"
                value={this.state.password}
                id="password"
                placeholder="Password"
                onChange={this.handleOnChanges}
                required
              />
            </label>
          </div>
          <div className="register_form_elmt">
            <label>
              E-mail:
              <input
                className="register_form_element"
                type="email"
                name="email"
                value={this.state.email}
                id="email"
                placeholder="E-mail Address"
                onChange={this.handleOnChanges}
                required
              />
            </label>
          </div>
          <div className="register_form_elmt">
            <label>
              First Name:
              <input
                className="register_form_element"
                type="text"
                name="first_name"
                value={this.state.first_name}
                id="first_name"
                placeholder="First Name"
                onChange={this.handleOnChanges}
              />
            </label>
          </div>
          <div className="register_form_elmt">
            <label>
              Last Name:
              <input
                className="register_form_element"
                type="text"
                name="last_name"
                value={this.state.last_name}
                id="last_name"
                placeholder="Last Name"
                onChange={this.handleOnChanges}
              />
            </label>
          </div>

          <button type="submit" id="register_btn" className="btn">
            Register
          </button>
        </form>
      </div>
    );
  }
  register = event => {
    event.preventDefault();
    api
      .post("/register", {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
        first_name: this.state.first_name,
        last_name: this.state.last_name
      })
      .then(res => {
        console.log(res.status);
        if (res.status === 200) {
          this.handleOnSuccess();
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

  handleOnSuccess = () => {
    this.handleOnError("registered successfully!");
  };

  handleOnError = (err, shown) => {
    let error = { ...this.state.error };
    error.content = err;
    error.shown = "alert alert-primary";
    this.setState({ error });
  };
}

export default RegisterForm;
