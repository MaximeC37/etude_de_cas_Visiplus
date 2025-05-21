const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = Schema({
  name: String,
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "user"],
      message: "{VALUE} inconnue",
    },
  },
  age: Number,
});

userSchema.pre("save", async function () {
  this.email = this.email.toLowerCase();
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = model("User", userSchema);
