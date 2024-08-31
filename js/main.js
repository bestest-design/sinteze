// main.js

function removeOverly() {
  const overlay = document.querySelector("overlay");
  playAudio();
  overlay.style.transition = "opacity 0.5s ease-out";
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.remove();
  }, 500);
}
