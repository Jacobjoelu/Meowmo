import path from "path";
import { fileURLToPath } from "url";
import User from "../model/user.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      return res.status(400).json({ message: "Email already registered" });
    }
    const userCreate = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json(userCreate._id);
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
    res.status(200).json({ user: userLogin._id });
    console.log(`${userLogin} success`);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message, code: err.code });
  }
};

const loginGet = (req, res) => {
  res.sendfile(__dirname, "./public", "login");
};
const signupGet = (req, res) => {
  res.sendfile(__dirname, "./public", "signup");
};
export default { signupSend, loginSend, loginGet, signupGet };
