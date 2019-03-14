import React, { Component } from "react";

class Game_room extends Component {
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
            Onwer: {this.props.room.owner}
          </div>
          <div id="player" className="room_name">
            Total Players: {this.props.room.current_users}
          </div>
          <div id="player" className="room_name">
            Players : {this.props.room.users}
          </div>
          {/* <button
            onClick={() => this.props.onRoomClick(this.props.room.id)}
            id="create_room_btn"
            className="btn btn-primary btn-sm m-2"
          >
            select room
          </button> */}

          <button
            onClick={() => this.props.onRoomDelete(this.props.room)}
            id="create_room_btn"
            className="btn btn-info btn-sm m-2"
          >
            delete player
          </button>

          <button
            onClick={() => this.props.onIncrement(this.props.room)}
            id="create_room_btn"
            className="btn btn-info btn-sm m-2"
          >
            enter room
          </button>
        </div>
      </div>
    );
  }
  formatCount() {
    const { value } = this.props.room.id;
    return value === 0 ? "Zero" : value;
  }
}

export default Game_room;
