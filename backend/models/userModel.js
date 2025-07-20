const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: true
    },
    profilePicture: {
      type: String,
      default: "https://example.com/default-profile-picture.png",
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        required: true
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ currentLocation: "2dsphere" });

const User = mongoose.model("User", userSchema);

module.exports = User;
