// main.js

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector("overlay");
  function removeOverly() {
    playAudio();
    overlay.style.transition = "opacity 0.5s ease-out";
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }
});
