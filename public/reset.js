document.getElementById("resetForm").addEventListener("submit", (e) => {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  if (password !== confirmPassword) {
    e.preventDefault(); // Prevent form submission
    alert("Passwords do not match. Please try again.");
  }
});
