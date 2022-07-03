const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 50,
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.virtual("date").get(function () {
  return new Date(this.createdAt).toLocaleString();
});

postSchema.virtual("url", function () {
  return `/posts/${this._id}`;
});

module.exports = mongoose.model("Post", postSchema);
