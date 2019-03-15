import React, { Component } from "react";
import Game_room from "./game_room.jsx";
import api from "./api.js";
import Cookies from "js-cookie";
import { Redirect } from "react-router";
class GameRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      time: Date.now(),
      exit: false
    };
  }

  handleAdd_room = () => {
    //add the updated rooms into database
    api
      .post("/room", { owner: Cookies.get("username"), current_users: 0 })
      .then(res => {
        console.log(res.status);
        let rooms = res.data;
        this.setState({ rooms });
      })
      .catch(err => {
        console.log(err);
      });
    // // reset the rooms state.
    // console.log("setting the state to new rooms");
  };

  handlerGetRooms() {
    api
      .get("/rooms", null)
      .then(res => {
        console.log(res.data);
        let rooms = res.data;
        this.setState({ rooms });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handlerDelete = room => {
    api
      .delete("/room/" + room._id + "/")
      .then(res => {
        let rooms = res.data;
        this.setState({ rooms });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handlerClick = roomId => {
    console.log("room is clicked", roomId);
  };

  handlerIncrement = room => {
    api
      .post("/joinRoom/", room)
      .then(res => {})
      .catch(err => {
        console.log(err);
      });
  };
  // called when the object state changes, and get data from server.
  componentDidMount(prevProps, prevState) {
    this.interval = setInterval(() => this.handlerGetRooms(), 3000);
  }
  // clean up data before something is removed from DOM.
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSign_out = () => {
    //add the updated rooms into database
    api
      .get("/signout/")
      .then(res => {})
      .catch(err => {
        console.log(err);
      });
    this.setState({ exit: true });
  };

  render() {
    if (this.state.exit == true) {
      return <Redirect to="/" />;
    }
    if (this.props.isLogin == true) {
      return (
        <div>
          <button
            onClick={this.handleSign_out}
            id="create_room_btn"
            className="btn btn-danger btn-sm m-2"
          >
            sign out
          </button>
          <div className="d-flex flex-wrap">
            {this.state.rooms.map(room => (
              <Game_room
                key={room._id}
                onRoomClick={this.handlerClick}
                onRoomDelete={this.handlerDelete}
                onIncrement={this.handlerIncrement}
                room={room}
              >
                <h4>room ##{room.id}</h4>
              </Game_room>
            ))}
          </div>
          <button
            onClick={this.handleAdd_room}
            id="create_room_btn"
            className="btn btn-danger btn-sm m-2"
          >
            create room
          </button>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
export default GameRooms;
