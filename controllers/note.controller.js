import path from "path";
import { fileURLToPath } from "url";
import NoteModel from "../model/note.model.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const projectRoot = path.join(__dirname, "..");

const getNotes = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.log("No user found in request, please login");
      return res.status(200).redirect("/");
    }
    // Fetch notes with proper user validation
    const notes = await NoteModel.find({
      user: req.user._id,
    }).lean();
    console.log("User ID:", req.user._id);

    res.status(200).render("index", { notes: notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(200).render("index", {
      notes: [],
      error: "Error fetching notes",
    });
  }
};

// Create a new note
const makeNote = async (req, res) => {
  if (!req.user) {
    console.log("No authenticated user found");
    return res.status(401).redirect("/login");
  }

  console.log("Received request body:", req.body);
  try {
    const userId = req.user._id;
    const newNote = {
      ...req.body,
      user: userId,
    };
    const makeNote = await NoteModel.create(newNote);
    console.log(`Note created successfully:`, makeNote._id);

    // Check if note is empty
    if (!newNote.title && !newNote.content) {
      console.log("Empty note detected, deleting...");
      await NoteModel.findByIdAndDelete(newNote._id);
      console.log("Empty note deleted");
      return res.redirect("/");
    }
    res.status(201).redirect("/");
  } catch (error) {
    console.error("Error in makeNote:", error);

    // Send appropriate error response
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid note data",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Error creating note",
      error: error.message,
    });
  }
};

// Read a single note by ID
const singleNote = async (req, res) => {
  try {
    const note = await NoteModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    console.log(`${_id},${user}`);
    if (!note) {
      return res.status(404).send("Note not found");
    }
    res.status(200).send(note);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a note by ID
const patchNote = async (req, res) => {
  try {
    const note = await NoteModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) {
      return res.status(404).send("Note not found");
    }
    res.status(200).redirect("/");
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a note by ID
const deleteNote = async (req, res) => {
  try {
    if (!req.params.id) {
      console.log("No ID provided in delete request");
      return res.status(400).json({ message: "No note ID provided" });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }
    const note = await NoteModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    // const note = await NoteModel.findOneAndDelete({
    //   _id: req.params.id,
    //   user: req.user._id,
    // });
    if (!note) {
      console.log(`Note not found for ID: ${req.params.id}`);
      return res.status(404).send("Note not found");
    }
    await note.deleteOne();
    console.log(`Note deleted successfully: ${req.params.id}`);
    res.status(200).redirect("/");
  } catch (error) {
    console.log({ message: "Error deleting note", error: error.message });
    res
      .status(500)
      .json({ message: "Error deleting note", error: error.message });
  }
};

export default { getNotes, makeNote, singleNote, patchNote, deleteNote };
