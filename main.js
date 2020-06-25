
// Really basic JS but needs to be stored in a separate file.
document.addEventListener('DOMContentLoaded', function(event) {
  loadTheme();
  resizeCraneImage();
  window.addEventListener('resize', resizeCraneImage);
});

function resizeCraneImage() {
  let width = document.documentElement.clientWidth / 2;
  let height = document.documentElement.clientHeight / 2;
  let imgSize = Math.max(Math.min(width, height, 300), 50);

  let craneImageEl = document.getElementById('craneImage');
  craneImageEl.width = imgSize;
  craneImageEl.height = imgSize;
}
