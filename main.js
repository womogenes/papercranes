
// Really basic JS but needs to be stored in a separate file.

var craneImageEl;
var theme;

document.addEventListener("DOMContentLoaded", function(event) {
  
  craneImageEl = document.getElementById("craneImage");

  loadTheme();
  
  resizeCraneImage();
  window.addEventListener("resize", resizeCraneImage);
});


function resizeCraneImage() {
  var width = document.documentElement.clientWidth / 2;
  var height = document.documentElement.clientHeight / 2;
  
  var imgSize = Math.max(Math.min(width, height, 300), 50);
  
  craneImageEl.width = imgSize;
  craneImageEl.height = imgSize;
}
