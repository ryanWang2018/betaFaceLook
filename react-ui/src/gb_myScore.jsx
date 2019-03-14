import React, { Component } from "react";
import api from "./api.js";
import LoginForm from "./loginForm.jsx";
import ReactDOM from "react-dom";

class Gb_myScore extends Component {
  state = {};
  render() {
    return (
      <div id="my_score_id" className="my_score_css">
        <p id="my_score" className="my_score_text_css">
          Your Score:
        </p>

        <p id="opponent_score" className="my_score_text_css">
          Opponent Score:
        </p>
        <hr />
        <p className="my_score_text_css">Total Time: 1:00</p>
      </div>
    );
  }
}

export default Gb_myScore;
