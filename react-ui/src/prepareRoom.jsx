import React, { Component } from "react";
import GameBoard from "./gameBoard.jsx";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
import api from './api.js';

const URL = route => `ws://localhost:3001${route}`;

class PrepareRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerList: [],
            timer: { timeleft: 0 },
            emojiList: [],
            result: "",
            back: false
        };
    }

    render() {
        if (this.state.back) return <Redirect to='/rooms/' />
        let start = this.state.start;

        if (start) {
            return (
                <div>
                    <GameBoard leaveRoom={this.leaveRoom} ws={this.ws} result={this.state.result} scoreList={this.state.playerList} timer={this.state.timer} emojiList={this.state.emojiList}></GameBoard>;
                </div>
            );

        } else {
            return (
                <div>
                    <div>
                        <button onClick={this.leaveRoom} className="btn btn-danger btn-sm m-2">back</button>
                    </div>
                    <div>
                        <button onClick={this.sendReady} className="btn btn-danger btn-sm m-2">ready</button>
                    </div>
                </div>
            );



        }
    }

    leaveRoom = () => {
        let roomId = this.props.match.params.roomId;
        api
            .post("/room/" + roomId + "/leave/")
            .then(res => {
                console.log("leave room ", roomId);
                // console.log("leave room ", res.data);
                // this.setState({ inRoom: res.data._id });
            })
            .catch(err => {
                console.log(err);
            });
        this.setState({ back: true });
    }

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
                case 'stop':
                    console.log("recieve from server stop")
                    this.handleOnStop();
                    break;
                case 'roomState':
                    this.handleOnRoomState(message);
                    break;
                case 'emojis':
                    this.handleOnEmojis(message);
                    break;
                default:
                    this.handleOnError(message);
                    break;
            }
            // console.log("message  from server" + JSON.parse(event.data));
        };
    }

    ws = new WebSocket(URL(this.props.location.pathname));

    sendReady = () => {
        this.ws.send(JSON.stringify({
            type: 'ready',
            from: Cookies.get("username"),
            roomId: "1"
        }));
    }
    handleOnEmojis = (message) => {
        let emojiList = message.emojiList;
        if (emojiList) {
            this.setState({ emojiList });
        }

    }
    handleOnRoomState = (message) => {
        let roomState = message.roomState;
        if (roomState.gameState === "wait") {
            console.log("wait");
        } else if (roomState.gameState === "gamming") {
            let timeleft = roomState.timeleft;
            let players = roomState.players;
            this.handleOnStart(timeleft, players);
            console.log("start");
        } else if (roomState.gameState === "end") {
            let winners = roomState.winners;
            console.log("handle on room state:  " + winners);
            this.handleOnResult(winners);
            console.log("game end");
        }
        this.setState({})
    }

    handleOnResult = (winners) => {

        console.log("handle on result winners: " + winners);
        let result = winners[0].playerId;
        console.log("result : " + result);
        this.setState({ result });
        console.log("after :" + this.state.result);
    }
    // this.setState({ start: "" });
    // let result = (winners.length === 1) ? winners[0] : "draw";
    // if (result !== "draw")
    // switch (result) {
    //     case "win":
    //         console.log("handle result win");
    //         this.setState({ result: "win" });
    //         this.setState({ start: "" });
    //         break;
    //     case "lose":
    //         console.log("handle result lose");
    //         this.setState({ result: "lose" });
    //         this.setState({ start: "" });
    //         break;
    //     case "draw":
    //         console.log("handle result draw");
    //         this.setState({ result: "draw" });
    //         this.setState({ start: "" });
    //         break;
    //     default:
    //         console.log("handle result: unexpected result.")
    //         break;
    // }

    handleOnError = (err) => {
        console.log(err);
    };

    handleOnStart = (timeleft, players) => {
        let timer = { timeleft: timeleft };
        let playerList = players;
        this.setState({ timer });
        this.setState({ playerList });
        this.setState({ start: "start" });
    };
}

export default PrepareRoom;
