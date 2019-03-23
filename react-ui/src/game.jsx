import React, { Component } from "react";
import api from "./api.js";
import LoginForm from "./loginForm.jsx";
import ReactDOM from "react-dom";
import Scores from "./scores.jsx";
import Result from "./result.jsx";
import MyCamera from "./myCamera.jsx";
import EmojiBar from "./emojiBar.jsx";
import Animate from "react-move/Animate";
import Emoji from "./emoji.jsx";
import Cookies from "js-cookie";

const URL = "ws://localhost:3001";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleOnInput = this.handleOnInput.bind(this);
  }

  render() {
    const result = this.props.result;
    return (
      <div className="container">
        <button onClick={this.sendStart}> send start</button>
        <button onClick={this.sendStop}> send stop</button>
        <button onClick={this.sendUpdate}> send update</button>
        <button>{this.state.start}</button>
        <div className="row">
          <Scores start={this.state.start} onStop={this.handleOnStop} onUpdate={this.handleOnUpdate}></Scores>
        </div>
        <Result result={result} onStop={this.handleOnStop} className="row"></Result>
        <div >
          <EmojiBar start={this.state.start} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}></EmojiBar>
        </div>
        {/* <MyCamera start={start} onStop={this.handleOnStop} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}></MyCamera> */}
      </div>
    );
  }

  ws = new WebSocket(URL)

  componentDidMount() {
    this.ws.onopen = (event) => {
      console.log("connected to server");
    };
    this.ws.onerror = (event) => {
      console.log("connection error ");
    };
    this.ws.onmessage = (event) => {
      let message = JSON.parse(event.data);

      switch (message.type) {
        case 'update':
          this.handleOnUpdate(message);
          break;
        case 'stop':
          console.log("recieve from server stop")
          this.handleOnStop();
          break;
        case 'start':
          this.handleOnStart();
          break;
        case 'result':
          this.handleOnResult(message);
        default://error
          this.handleOnError(message);
          ;
      }
      // console.log("message  from server" + JSON.parse(event.data));
    };
    this.ws.onclose = (event) => {
      console.log(event);
    };
  }

  handleOnInput(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  }

  //send message to server-----------------
  sendStart = () => {
    this.ws.send(JSON.stringify({
      type: 'start',
      from: Cookies.get("username")
    }));
  }

  sendUpdate = () => {
    this.ws.send(JSON.stringify({
      type: 'update',
      from: Cookies.get("username"),
      action: "+1"
    }))
  };

  sendStop = () => {
    this.ws.send(JSON.stringify({
      type: 'stop',
      from: Cookies.get("username")
    }))
  };

  // handling message from server-----------------------
  handleOnStart = () => {
    console.log("handle on start");
    this.setState({ start: "start" });
    this.handleOnStartEmojiBar();
    this.handleOnStartScores();
    this.handleOnStartCamera();

  }
  handleOnUpdate = (message) => {
    let targetUser = message.targetUser;
    console.log(targetUser);
    //update scores

  }

  handleOnResult = (message) => {
    switch (message.result) {
      case "win":
        console.log("handle result win");
        this.setState({ result: "win" });
        break;
      case "lose":
        console.log("handle result lose");
        this.setState({ result: "lose" });
        break;
      case "draw":
        console.log("handle result draw");
        this.setState({ result: "draw" });
        break;
      default:
        console.log("handle result: unexpected result.")
        break;
    }
  }
  // need to ask server stop to receive the data 
  handleOnStop = () => {
    // let start = { ...this.state.start }
    this.setState({ start: "" })

    this.ws.close();
  }

  handleOnError = () => {

  }
  // -----------------------------------

  handleOnStartScores = (scores) => {

  }

  handleOnStartEmojiBar = () => {
    const emojiBar = { ...this.state.emojiBar };
    emojiBar.start = "start";
    this.setState({ emojiBar });
  }

  handleOnStartCamera = (camera) => {

  }
}

export default Game;
