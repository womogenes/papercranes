
// Really basic JS but needs to be stored in a separate file.

var craneImageEl;

document.addEventListener("DOMContentLoaded", function(event) {
  
  craneImageEl = document.getElementById("craneImage");

  // Set the theme.
  var theme = JSON.parse(localStorage.getItem("theme"));
  if (theme == null) {
    theme = (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ?
  "Dark" : "Light";
    localStorage.setItem("theme", JSON.stringify(theme));
  }
  
  document.body.style.background = theme == "Light" ? "#ffffff" : "#181818";
});