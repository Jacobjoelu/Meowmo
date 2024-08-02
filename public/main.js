"use strict";
//Handle deletion
const button = document.querySelectorAll("#delete-btn").forEach((button) => {
  button.addEventListener("click", async (event) => {
    const noteId = event.target.getAttribute("data-id");

    try {
      const response = await fetch(`api/note/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Note deleted successfully");
        // Optionally, remove the note element from the DOM
        event.target.closest("div").remove();
      } else {
        alert("Failed to delete note");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  });
});

//Render search form
const flip = document.addEventListener("DOMContentLoaded", () => {
  const noteInput = document.querySelector("#add");
  const noteForm = document.querySelector("#note-form");
  const closeButton = noteForm.querySelector("#button");

  // Show the form and hide the input field when the input is clicked
  noteInput.addEventListener("click", function () {
    noteInput.classList.add("hidden");
    noteForm.classList.remove("hidden");
  });

  // Hide the form and show the input field on form submission or when the escape key is pressed
  closeButton.addEventListener("click", function (event) {
    noteInput.classList.remove("hidden");
    noteForm.classList.add("hidden");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      noteInput.classList.remove("hidden");
      noteForm.classList.add("hidden");
    }
  });
});
