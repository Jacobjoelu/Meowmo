import mongoose from "mongoose";
import { trim, isEmail } from "validator";
const { Schema, model } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [isEmail, `Please enter valid Email`],
  },
  password: {
    type: String,
    required: [true, "Enter password"],
    minlength: [6, "Password must be atleast 6 characters long"],
  },
});

//hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const User = model(`user`, userSchema);

export default User;
