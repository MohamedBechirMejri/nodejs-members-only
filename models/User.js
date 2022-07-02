const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 15,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    membership: {
      type: String,
      required: true,
      enum: ["free", "premium", "admin"],
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("name", function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual("url", function () {
  return `/users/${this._id}`;
});
