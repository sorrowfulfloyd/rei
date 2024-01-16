const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, cast: false },
  email: { type: String, required: true, cast: false },
  password: { type: String, required: true, cast: false },
  // signedIn: { type: Boolean },
  creationDate: {
    type: String,
    default: () => new Date().toLocaleString("tr-TR"),
  },
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
