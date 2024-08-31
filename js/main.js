// main.js

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector("overlay");
  const audio = document.getElementById("backgroundAudio");
  const logo = document.getElementById("logo");
  const playStopBtn = document.getElementById("playStop");
  const muteUnmuteBtn = document.getElementById("muteUnmute");

  let audioContext, analyser, source, bufferLength, dataArray;
  let isAudioInitialized = false;

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
    const bass =
      dataArray.slice(0, bufferLength / 8).reduce((a, b) => a + b, 0) /
      (bufferLength / 8);

    // Calculate midrange frequencies (middle 2/8 to 4/8 of the dataArray)
    const midrange =
      dataArray
        .slice(bufferLength / 4, bufferLength / 2)
        .reduce((a, b) => a + b, 0) /
      (bufferLength / 4);

    // Calculate high-end frequencies (last 1/8 of the dataArray)
    const highEnd =
      dataArray.slice((bufferLength * 7) / 8).reduce((a, b) => a + b, 0) /
      (bufferLength / 8);

    // Adjust logo size using the midrange and high-end frequencies
    const newSize = 25 + (bass / 5) * (highEnd / 50); // Adjust the scaling factors as needed

    logo.style.width = newSize + "rem"; // Adjust the logo width based on midrange and high-end frequencies

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
    overlay.style.transition = "opacity 0.5s ease-out"; // Set the duration and easing of the fade-out
    overlay.style.opacity = "0"; // Start the fade-out by setting opacity to 0

    // After the transition ends, remove the overlay from the DOM
    setTimeout(() => {
      overlay.remove();
    }, 500); // Timeout duration matches the transition duration
  }

  // Attach the removeOverlay function to the click event
  overlay.addEventListener("click", removeOverlay);
});
