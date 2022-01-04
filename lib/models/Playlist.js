const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, "String user_id is required"],
    },
    name: {
      type: String,
      required: [true, "String name is required"],
    },
    tracks: {
      type: Object,
      required: [true, "Object tracks is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", playlistSchema);
