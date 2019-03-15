import React, { Component } from "react";

class GameBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: ""
    };
  }

  render() {
    return (
      <React.Fragment>
        <div id="play_ground_id" className="play_ground_css">
          <div className="my_score_and_opponent">
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

            <div id="show_opponent_id" className="show_opponent_css" />
          </div>
          <div id="win_lose_id" className="win_lose_css" />

          <div id="running_img_id" className="running_img_css">
            <div id="display_img_id" className="display_img_css">
              <img
                id="img01"
                className="moving_img_css"
                src="./media/emojis/angry.png"
              />
              <img
                id="img02"
                className="moving_img_css"
                src="./media/emojis/crying.png"
              />
              <img
                id="img03"
                className="moving_img_css"
                src="./media/emojis/happy.png"
              />
            </div>
            <button>Click Me</button>
            <button id="snap">Snap Photo</button>
          </div>

          <video id="video" autoplay />
        </div>
      </React.Fragment>
    );
  }
}

export default GameBoard;
