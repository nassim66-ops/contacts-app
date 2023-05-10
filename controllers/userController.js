const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Register users
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username, !email, !password)) {
    res.status(400);
    throw new Error("All fields are required!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User is already registered!");
  }
  //   Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //   Creating the user:
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log("User:", user);

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data are not valid!");
  }

  res.json({ message: "Register the user" });
});

// Register users
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required!");
  }

  const user = await User.findOne({ email });
  const compare = await bcrypt.compare(password, user.password);

  if (user && compare) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or Password is not valid!");
  }
});

// Register users
//   Private access
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
