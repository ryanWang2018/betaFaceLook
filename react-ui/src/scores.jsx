import React, { Component } from "react";
import api from "./api.js";
import Timer from "./timer.jsx";
import Score from "./score.jsx";

class Scores extends Component {
  render() {
    const scoreList = this.props.scoreList; // [{playerId: "", point:""}]
    const timer = this.props.timer; // {timeleft: 0}
    return (
      <div className="d-flex flex-column bd-highlight mb-3">
        {scoreList.map(score => (
          <Score key={score.playerId} score={score} />
        ))}
        <Timer timer={timer} />
      </div>
    );
  }
}

export default Scores;
