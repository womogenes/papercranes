
// Really basic JS but needs to be stored in a separate file.
document.addEventListener('DOMContentLoaded', function(event) {
  loadTheme();
  resizeCraneImage();
  window.addEventListener('resize', resizeCraneImage);
});

function resizeCraneImage() {
  const width = document.documentElement.clientWidth / 2;
  const height = document.documentElement.clientHeight / 2;
  const imgSize = Math.max(Math.min(width, height, 300), 50);

  const craneImageEl = getEl('craneImage');
  craneImageEl.width = imgSize;
  craneImageEl.height = imgSize;
}
