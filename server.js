import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import authMiddleware from "./middleware/auth.middleware.js";

//declarations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

//middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));
app.use(cookieparser());

//mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.PWORD}@meowmol.bhstbmo.mongodb.net/?retryWrites=true&w=majority&appName=Meowmol`
  )
  .then(() => console.log(`MongoDB connected succesfully`))
  .catch((err) => console.error(err));

//server routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/login.html"));
});

//for
app.get("/api", authMiddleware, (req, res) => res.render("notes"));

//port
app.listen(port);
console.log(`Server started at ${port}`);
