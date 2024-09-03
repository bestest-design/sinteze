// main.js

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector("overlay");
  const audio = document.getElementById("backgroundAudio");
  const logo = document.getElementById("logo");
  const playStopBtn = document.getElementById("playStop");
  const muteUnmuteBtn = document.getElementById("muteUnmute");
  const detailsElements = document.querySelectorAll("details");

  let audioContext, analyser, source, bufferLength, dataArray;
  let isAudioInitialized = false;

  // Disable scroll function
  function disableScroll() {
    document.body.style.overflow = "hidden";
  }

  // Re-enable scroll function
  function enableScroll() {
    document.body.style.overflow = "";
  }

  // Check if visited_sinteze cookie is set
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Initialize Audio Context and Analyser
  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      isAudioInitialized = true;
    }
  }

  function adjustLogoSize() {
    analyser.getByteFrequencyData(dataArray);

    // Calculate bass (low-end) frequencies (first 1/8 of the dataArray)
    let bass =
      dataArray.slice(0, bufferLength / 8).reduce((a, b) => a + b, 0) /
      (bufferLength / 8);
    bass = bass / 5;

    // Calculate midrange frequencies (middle 2/8 to 4/8 of the dataArray)
    let midrange =
      dataArray
        .slice(bufferLength / 4, bufferLength / 2)
        .reduce((a, b) => a + b, 0) /
      (bufferLength / 4);
    midrange = midrange / 60;

    // Calculate high-end frequencies (last 1/8 of the dataArray)
    let highEnd =
      dataArray.slice((bufferLength * 7) / 8).reduce((a, b) => a + b, 0) /
      (bufferLength / 4);
    highEnd = highEnd / 10;

    // console.log(`bass : ${bass}`);
    // console.log(`midrange : ${midrange}`);
    // console.log(`highEnd : ${highEnd}`);

    // Adjust logo size using the frequencies
    let newSize = Math.min(80, Math.max(25, bass + highEnd));

    // console.log(`newSize : ${newSize}rem`);

    logo.style.width = newSize + "rem";

    requestAnimationFrame(adjustLogoSize);
  }

  // Play audio function
  function playAudio() {
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
    }

    if (!isAudioInitialized) {
      initAudio();
    }

    audio
      .play()
      .then(() => {
        playStopBtn.innerHTML = '<i class="fas fa-pause"></i>';
        adjustLogoSize();
      })
      .catch((error) => {
        console.log("Error playing audio:", error);
      });
  }

  // Play/Stop button event listener
  playStopBtn.addEventListener("click", () => {
    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
      playStopBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  });

  // Mute/Unmute button event listener
  muteUnmuteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteUnmuteBtn.innerHTML = audio.muted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
  });

  function removeOverlay() {
    playAudio();
    overlay.style.transition = "opacity 0.5s ease-out";
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
      enableScroll(); // Re-enable scroll after removing the overlay
    }, 500);
    document.cookie = "visited_sinteze=true; path=/;"; // Set cookie
  }

  // Attach the removeOverlay function to the click event
  if (overlay) {
    overlay.addEventListener("click", removeOverlay);
  }

  // Ensure only one details element is open at a time
  detailsElements.forEach((details) => {
    details.addEventListener("toggle", function () {
      if (this.open) {
        // Close all other details elements
        detailsElements.forEach((otherDetails) => {
          if (otherDetails !== this) {
            otherDetails.open = false;
          }
        });
      }
    });
  });

  // Disable or enable scroll and manage overlay visibility based on cookie and screen size
  function manageOverlay() {
    if (!overlay) return;

    const hasVisited = getCookie("visited_sinteze");
    const isSmallScreen = window.innerWidth < 1024;

    if (hasVisited || isSmallScreen) {
      overlay.remove();
      enableScroll();
      return;
    }

    disableScroll();
  }

  manageOverlay();
});
