let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let roomSchema = new Schema({
  _id: Schema.Types.ObjectId,

  owner: {
    type: String,
    required: true
  },
  current_users: {
    type: String,
    required: true
  },
  users: {
    type: Array
  },
  time: {
    type: Date,
    default: Date.now
  },
  versionKey: false
});

module.exports = mongoose.model("Rooms", roomSchema);
