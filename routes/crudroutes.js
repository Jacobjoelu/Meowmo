import express from "express";
import noteModel from "../public/note.model.js";
const router = express.Router();

// Read all notes
router.get("/notes", async (req, res) => {
  try {
    const notes = await noteModel.find();
    const count = await noteModel.countDocuments();
    console.log("Number of documents:", count);
    res.status(200).render("note", { notes: notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).render("error", { message: "Error fetching notes" });
  }
});

// Create a new note
router.post("/makenote", async (req, res) => {
  console.log("Received request body:", req.body);
  try {
    if (req.body.title || req.body.content) {
      const makeNote = await noteModel.create(req.body);
      console.log(`Note created successfully:`, makeNote);
      res.status(201).redirect("/");
    } else {
      console.log("Both title and content are empty");
      res.status(400).json({ message: "Title or content must not be empty" });
    }
  } catch (error) {
    console.error("Error creating note:", error);
    res
      .status(500)
      .json({ message: "Error creating note", error: error.message });
  }
});

// Read a single note by ID
router.get("/note/:id", async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not found");
    }
    res.status(200).send(note);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a note by ID
router.patch("/note/:id", async (req, res) => {
  try {
    const note = await noteModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!note) {
      return res.status(404).send("Note not found");
    }
    res.status(200).redirect("/");
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a note by ID
router.delete("/note/:id", async (req, res) => {
  try {
    const note = await noteModel.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).send("Note not found");
    }
    res.status(200).send("Note deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
