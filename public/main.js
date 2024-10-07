"use strict";

// Handle deletion
document.querySelectorAll(".delete-btn").forEach((button) => {
  button.addEventListener("click", async (event) => {
    const noteId = event.target.getAttribute("data-id");
    console.log(`Deleting note: ${noteId}`);

    try {
      const response = await fetch(`/api/note/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        // Optionally, remove the note element from the DOM
        event.target.closest(".note-item").remove();
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  });
});

// Render search form
document.addEventListener("DOMContentLoaded", () => {
  const noteInput = document.querySelector("#add");
  const noteForm = document.querySelector("#note-form");
  const closeButton = document.querySelector("#button");
  // Show the form and hide the input field when the input is clicked
  noteInput.addEventListener("click", function () {
    console.log("this works");
    noteInput.classList.add("hidden");
    noteForm.classList.remove("hidden");
  });

  // Hide the form and show the input field when the close button is clicked
  if (closeButton) {
    closeButton.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent form submission
      noteForm.submit();
      noteInput.classList.remove("hidden");
      noteForm.classList.add("hidden");
    });
  }
  // Hide the form and show the input field when the escape key is pressed
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      noteForm.submit();
      noteInput.classList.remove("hidden");
      noteForm.classList.add("hidden");
    }
  });
});
