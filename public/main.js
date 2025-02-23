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

// Get modal and form elements
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const closeModal = document.getElementById("closeModal");

// Handle Edit button clicks
document.querySelectorAll(".edit").forEach((button) => {
  button.addEventListener("click", (e) => {
    const noteId = e.target.getAttribute("data-id");
    const noteTitle = document.getElementById(`title-${noteId}`).textContent;
    const noteContent = document
      .querySelector(`#title-${noteId}`)
      .parentElement.nextElementSibling.textContent;

    // Populate the modal form
    document.getElementById("editNoteId").value = noteId;
    document.getElementById("editTitle").value = noteTitle;
    document.getElementById("editContent").value = noteContent;

    // Show the modal
    editModal.classList.remove("hidden");
  });
});

// Handle Close button click
closeModal.addEventListener("click", () => {
  editModal.classList.add("hidden");
});

// Handle form submission
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(editForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`/note/${data.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      window.location.reload(); // Reload the page to reflect changes
    } else {
      alert("Failed to update the note");
    }
  } catch (error) {
    console.error("Error updating note:", error);
    alert("An error occurred while updating the note");
  }
});


// Handle deletion
document.querySelectorAll(".delete").forEach((button) => {
  button.addEventListener("click", async (event) => {
    const noteId = event.target.getAttribute("data-id");
    const confirmDelete = confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/note/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        window.location.reload();
      }
      console.log(`Deleting note: ${noteId}`);
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
