import React, { Component } from "react";
import Emoji from "./emoji.jsx";
import MyCamera from "./myCamera.jsx";
import { Redirect } from "react-router-dom";

class EmojiBar extends Component {


  render() {
    let timer = this.props.timer;
    let ws = this.props.ws;
    return (
      <div>
        <button onClick={() => this.props.leaveRoom()}>back</button>

        <MyCamera ws={ws} timer={timer} />
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      currentEmoji: this.props.emojiList[
        Math.floor(Math.random() * this.props.emojiList.length)
      ]
    });
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.timer.timeleft !== prevProps.timer.timeleft &&
      this.props.timer.timeleft % 4 === 0
    ) {
      this.setState({
        currentEmoji: this.props.emojiList[
          Math.floor(Math.random() * this.props.emojiList.length)
        ]
      });
    }
  }
}

export default EmojiBar;
