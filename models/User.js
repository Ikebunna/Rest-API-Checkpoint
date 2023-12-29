const { Schema, model } = require("mongoose");

const userSchema = new Schema({ name: String });

const UserModel = model("User", userSchema);

module.exports = UserModel;
