import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import noteModel from "./public/note.model.js";
import crudroutes from "./routes/crudroutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", crudroutes);
app.use(express.static("public"));
app.use(express.static("routes"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@meowmol.bhstbmo.mongodb.net/`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(`MongoDB connection error: ${err}`));

//Section of code for rendering pages and notes
app.get("/", async (req, res) => {
  try {
    const notes = await noteModel.find();
    res.status(200).render("index", { notes: notes });
  } catch (error) {
    console.error(`${error}`);
  }
});

app.listen(port);
console.log(`Server started on: ${port}`);
