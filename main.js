
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
  
  resizeImage();
  window.addEventListener("resize", resizeImage());
});


function resizeImage() {
  
  var width = document.documentElement.clientWidth / 2;
  var height = document.documentElement.clientHeight / 2;
  
  var imgSize = Math.max(Math.min(width, height, 300), 50);
  console.log(imgSize);
  
  craneImageEl.width = imgSize;
  craneImageEl.height = imgSize;
  
}