import React, { Component } from "react";
import GameRoom from './gameRoom.jsx';
import api from "./api.js";
import Cookies from "js-cookie";
import LoginPage from "./loginForm.jsx";
import ReactDOM from "react-dom";
import { Redirect } from "react-router";

class GameRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      time: Date.now(),
      exit: false,
      inRoom: ''
    };
  }


  handleAddRoom = () => {
    //add the updated rooms into database
    api
      .post("/room/", null)
      .then(res => {
        //enter created room
        console.log(res);
        this.enterRoom(res.data._id);
      })
      .catch(err => {
        console.log(err);
      });
    // // reset the rooms state.
    // console.log("setting the state to new rooms");
  };

  handlerGetRooms() {
    api
      .get('rooms', null)
      .then(res => {
        let rooms = res.data;
        this.setState({ rooms });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // handlerDelete = room => {
  //   api
  //     .delete("/room/" + room._id + "/")
  //     .then(res => {
  //       let rooms = res.data;
  //       // this.setState({ rooms });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  handlerClick = roomId => {
    console.log("room is clicked", roomId);
  };

  enterRoom = ownerId => {
    api
      .post("/room/" + ownerId + "/enter/")
      .then(res => {
        console.log("enter room ", res.data);
        this.setState({ inRoom: res.data._id });
      })
      .catch(err => {
        console.log(err);
      });
  };
  // called when the object state changes, and get data from server.
  componentDidUpdate(prevProps, prevState) {
    if (this.state.rooms !== prevState.rooms) {
      this.handlerGetRooms();
    }
    this.interval = setInterval(() => this.handlerGetRooms(), 4000);
  }
  // clean up data before something is removed from DOM.
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSignOut = () => {
    //add the updated rooms into database
    api
      .get("/signout/")
      .then(res => {
        console.log(res);
        this.setState({ exit: true });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    if (this.state.exit) return <Redirect to='/' />;

    if (this.state.inRoom) return <Redirect to={"/rooms/" + this.state.inRoom} />;
    return (
      <div>
        <button
          onClick={this.handleSignOut}
          className="btn btn-danger btn-sm m-2"
        >
          sign out
          </button>
        <div className="d-flex flex-wrap">
          {this.state.rooms.map(room => (
            <GameRoom
              key={room.owner}
              onRoomClick={this.handlerClick}
              onRoomDelete={this.handlerDelete}
              onEnter={this.enterRoom}
              room={room}
            >
              <h4>room ##{room.owner}</h4>
            </GameRoom>
          ))}
        </div>
        <button
          onClick={this.handleAddRoom}
          className="btn btn-danger btn-sm m-2"
        >
          create room
          </button>
      </div>
    );


  }
}

export default GameRooms;
