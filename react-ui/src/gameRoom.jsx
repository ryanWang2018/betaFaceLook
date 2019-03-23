import React, { Component } from "react";

class GameRoom extends Component {
  // this is like this.method which binds handlerIncreae to "this"
  // instead of writting bind in constructor
  //   handlerIncrease = () => {
  //     this.setState({ current_users: this.state.current_users + 1 });
  //   };

  render() {
    return (
      <div className="card w-50">
        <div className="card-body">
          {this.props.children}

          <div id="owner_1" className="room_name">
            Onwer: {this.props.room._id}
          </div>

          <div id="player" className="room_name">
            Players : {this.props.room.users}
          </div>

          <button
            onClick={() => this.props.onRoomDelete(this.props.room)}
            id="create_room_btn"
            className="btn btn-info btn-sm m-2"
          >
            delete player
          </button>

          <button
            onClick={() => this.props.onEnter(this.props.room._id)}
            id="create_room_btn"
            className="btn btn-info btn-sm m-2"
          >
            enter room
          </button>
        </div>
      </div>
    );
  }
}

export default GameRoom;
