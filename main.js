
// Really basic JS but needs to be stored in a separate file.

var craneImageEl;
var theme;

document.addEventListener("DOMContentLoaded", function(event) {
  
  craneImageEl = document.getElementById("craneImage");

  // Set the theme.
  theme = JSON.parse(localStorage.getItem("theme"));
  if (theme == null) {
    theme = (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ?
  "Dark" : "Light";
    localStorage.setItem("theme", JSON.stringify(theme));
  }
  applyTheme();
  
  resizeImage();
  window.addEventListener("resize", resizeImage);
});


function resizeImage() {
  var width = document.documentElement.clientWidth / 2;
  var height = document.documentElement.clientHeight / 2;
  
  var imgSize = Math.max(Math.min(width, height, 300), 50);
  
  craneImageEl.width = imgSize;
  craneImageEl.height = imgSize;
}

function applyTheme() {
  // Sets light or dark theme.
  var root = document.documentElement;

  if (theme == "Light") {
    root.style.setProperty("--bg-color", "#ffffff");
    root.style.setProperty("--outline-color", "#000000");
    root.style.setProperty("--text-color", "#000000");
    root.style.setProperty("--fill-color", "#cccccc");

    root.style.setProperty("--btn-bg-on", "#eeeeee");
    root.style.setProperty("--btn-bg-hover", "#f9f9f9");
    root.style.setProperty("--btn-bg-active", "#cccccc");
    root.style.setProperty("--btn-outline-hover", "#222222");
    root.style.setProperty("--btn-outline-active", "#222222");

  } else if (theme == "Dark") {
    root.style.setProperty("--bg-color", "#181818");
    root.style.setProperty("--outline-color", "#dddddd");
    root.style.setProperty("--text-color", "#eeeeee");
    root.style.setProperty("--fill-color", "#555555");

    root.style.setProperty("--btn-bg-on", "#111111");
    root.style.setProperty("--btn-bg-hover", "#222222");
    root.style.setProperty("--btn-bg-active", "#1e1e1e");
    root.style.setProperty("--btn-outline-hover", "#cccccc");
    root.style.setProperty("--btn-outline-active", "#aaaaaa");
  }
}