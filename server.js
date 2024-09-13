import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes.js";
import authMiddleware from "./middleware/auth.middleware.js";
import noteModel from "./model/note.model.js";
import crudRoutes from "./routes/crud.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
const projectRoot = path.join(__dirname, "..");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());
app.use("/api", crudRoutes);
app.use("/", userRoutes);
app.use(express.static("routes"));
app.use(express.static(path.join(projectRoot, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@meowmol.bhstbmo.mongodb.net/`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(`MongoDB connection error: ${err}`));

//Section of code for rendering pages and notes
// app.get("/", async (req, res) => {
//   try {
//     const notes = await noteModel.find();
//     res.status(200).render("index", { notes: notes });
//   } catch (error) {
//     console.error(`${error}`);
//   }
// });

//server routes
app.get("/", authMiddleware.requireAuth, async (req, res) => {
  try {
    const notes = await noteModel.find();
    res.status(200).render("index", { notes: notes });
  } catch (error) {
    console.error(`${error}`);
  }
});
app.get("*", authMiddleware.checkUser);

app.listen(port);
console.log(`Server started on: ${port}`);
