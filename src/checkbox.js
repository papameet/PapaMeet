const checkbox = document.getElementById('leave_checkbox');
const leaveButton = document.getElementById('leave');

checkbox.addEventListener('change', (event) => {
  if (event.target.checked) {
    leaveButton.style.display = "none";
  } else {
    leaveButton.style.display = "block";
  }
});
