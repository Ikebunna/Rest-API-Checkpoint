const express = require("express");
const connectDB = require("./config/dbConnect");
const UserModel = require("./models/User");
const { config } = require("dotenv");

// specify .env path
config({ path: "./config/.env" });

// create instance of express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON in the req.body
app.use(express.json());

// inititate connection to DB and listen on port
const startApp = async () => {
  try {
    await connectDB(); // establish connection to db
    app.listen(PORT, () => console.log(` listening on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
};

startApp();

// HTTP GET Method to display all users
app.get("/api/v1/users", async (req, res) => {
  try {
    // retrieve all users from databasse using model.find()
    const allUsers = await UserModel.find();
    res.status(200).json({ message: "All Users:", allUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "server error" });
  }
});

// POST Method to create new users
app.post("/api/v1/create", async (req, res) => {
  try {
    const newUsers = req.body;
    await UserModel.insertMany(req.body).then((insertedUsers) =>
      console.log("inserted: ", insertedUsers)
    );
    res.status(200).json({ message: "user(s) added: ", newUsers });
  } catch (error) {
    res.status(404).send(error);
  }
});

// PUT method to update user
app.put("/api/v1/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    // check if user found; return error message if not found
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: `user with id: ${userId} does not exist` });
    }
    res.status(200).json({ message: "update successful" });
  } catch (error) {
    res.status(404).send("failed!");
  }
});

// HTTP DELETE METHOD TO REMOVE USER
app.delete("/api/v1/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userToDelete = await UserModel.findByIdAndDelete(userId);

    // check if user found; return error message if not found
    if (!userToDelete) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "User Deleted", userToDelete });
  } catch (error) {
    res.status(404).json({ message: "error deleting user" });
  }
});
