// main.js

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector("overlay");

  function removeOverly() {
    playAudio();
    // Start the fade-out effect
    overlay.style.transition = "opacity 0.5s ease-out"; // Set the duration and easing of the fade-out
    overlay.style.opacity = "0"; // Start the fade-out by setting opacity to 0

    // After the transition ends, remove the overlay from the DOM
    setTimeout(() => {
      overlay.remove();
    }, 500); // Timeout duration matches the transition duration
  }

  // Attach the removeOverly function to the click event
  overlay.addEventListener("click", removeOverly);
});
