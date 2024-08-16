import isEmail from "validator/lib/isEmail.js";
import User from "./model/user.model.js";
import dotenv from "dotenv";
dotenv.config();

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
    const userCreate = User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
    res.status(201).json(userCreate);
  } catch (err) {
    console.log(err);
  }
};

//user login
const loginSend = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const userLogin = User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    console.log(err);
    res.status(404).json({ err });
  }
};

const loginGet = (req, res) => {
  res.sendfile(__dirname, "./public", "/login");
};
const signupGet = (req, res) => {
  res.sendfile(__dirname, "./public", "/signup");
};
export default { signupSend, loginSend, loginGet, signupGet };
