const defaultInput = document.querySelector("#defaultInput");
const noteTitle = document.querySelector("#noteTitleInput");
const noteContent = document.querySelector("#noteContentInput");
const takeNote = document.querySelector(".takeNote");
const closeBtn = document.querySelector("#closeInputBtn");

defaultInput.addEventListener(
  "click",
  (e) => {
    startNoteTaking();
  },
  false
);
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    event.preventDefault();
    takeNote.submit();
    defaultInput.classList.remove("hidden");
    takeNote.classList.add("hidden");
  }
});
closeBtn.addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    stopNoteTaking();
    resetInputs();
  },
  false
);

// you can delete this
// function saveNote() {
//   let note = {
//     title: noteTitle.value,
//     details: noteContent.value,
//   };

//   // it'll only return note if either or both fields are not empty
//   if (!note.title || !note.details) {
//     return null;
//   }
//   return note;
// }

function resetInputs() {
  noteTitle.value = "";
  noteContent.value = "";
}

function startNoteTaking() {
  defaultInput.classList.add("hidden");
  takeNote.classList.remove("hidden");
  noteContent.focus();
}

function stopNoteTaking() {
  defaultInput.classList.remove("hidden");
  takeNote.classList.add("hidden");
  takeNote.submit(); // you can delete this
}

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

// // Render search form
// document.addEventListener("DOMContentLoaded", () => {
//   const noteInput = document.querySelector("#add");
//   const noteForm = document.querySelector("#note-form");
//   const closeButton = document.querySelector("#button");
//   // Show the form and hide the input field when the input is clicked
//   noteInput.addEventListener("click", function () {
//     console.log("this works");
//     noteInput.classList.add("hidden");
//     noteForm.classList.remove("hidden");
//   });

//   // Hide the form and show the input field when the close button is clicked
//   if (closeButton) {
//     closeButton.addEventListener("click", function (event) {
//       event.preventDefault(); // Prevent form submission
//       noteForm.submit();
//       noteInput.classList.remove("hidden");
//       noteForm.classList.add("hidden");
//     });
//   }
//   // Hide the form and show the input field when the escape key is pressed
//   document.addEventListener("keydown", function (event) {
//     if (event.key === "Escape") {
//       event.preventDefault();
//       noteForm.submit();
//       noteInput.classList.remove("hidden");
//       noteForm.classList.add("hidden");
//     }
//   });
// });
