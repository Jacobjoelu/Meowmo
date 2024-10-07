import express from "express";
import { requireAuth, checkUser } from "../middleware/auth.middleware.js";
import cont from "../controllers/note.controller.js";
const router = express.Router();
router.use(requireAuth);
router.use(checkUser);

// Read all notes
router.get("/notes", cont.getNotes);

// Create a new note
router.post("/makenote", cont.makeNote);

// Read a single note by ID
router.get("/note/:id", cont.singleNote);

// Update a note by ID
router.patch("/note/:id", cont.patchNote);

// Delete a note by ID
router.delete("/note/:id", cont.deleteNote);

export default router;

// async (req, res) => {
//   console.log("Received request body:", req.body);
//   try {
//     if (req.body.title || req.body.content) {
//       const makeNote = await noteModel.create(req.body);
//       console.log(`Note created successfully:`, makeNote);
//       res.status(201).json(makeNote);
//     } else {
//       console.log("Both title and content are empty");
//       res.status(400).json({ message: "Title or content must not be empty" });
//     }
//   } catch (error) {
//     console.error("Error creating note:", error);
//     res
//       .status(500)
//       .json({ message: "Error creating note", error: error.message });
//   }
// });
