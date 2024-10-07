import path from "path";
import { fileURLToPath } from "url";
import User from "../model/user.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JOT, {
    expiresIn: maxAge,
  });
};

//user signup
const signupSend = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).redirect("/login");
    }
    const userCreate = await User.create({ email, password });
    const token = createToken(User._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).redirect("/");
  } catch (err) {
    console.log(err);
  }
};

//user login
const loginSend = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user existS
    const userLogin = await User.login(email, password);
    const token = createToken(userLogin._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).redirect("/");

    console.log(`${userLogin.email} logged in successfully`);
  } catch (err) {
    console.log({ error: err.message, code: err.code });
    res.status(400).json({ error: err.message, code: err.code });
  }
};

const loginGet = (req, res) => {
  res.sendFile(path.join(projectRoot, "public", "login.html"));
};

const signupGet = (req, res) => {
  res.sendFile(path.join(projectRoot, "public", "signup.html"));
};
const logoutGet = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
const resetPSend = async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};
export default {
  signupSend,
  loginSend,
  resetPSend,
  loginGet,
  signupGet,
  logoutGet,
};
