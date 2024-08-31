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
    let bass =
      dataArray.slice(0, bufferLength / 8).reduce((a, b) => a + b, 0) /
      (bufferLength / 8);
    bass = bass / 4;

    // Calculate midrange frequencies (middle 2/8 to 4/8 of the dataArray)
    let midrange =
      dataArray
        .slice(bufferLength / 4, bufferLength / 2)
        .reduce((a, b) => a + b, 0) /
      (bufferLength / 4);
    midrange = midrange / 70;

    // Calculate high-end frequencies (last 1/8 of the dataArray)
    let highEnd =
      dataArray.slice((bufferLength * 7) / 8).reduce((a, b) => a + b, 0) /
      (bufferLength / 4);
    highEnd = highEnd / 10;

    console.log(`bass : ${bass}`);
    console.log(`midrange : ${midrange}`);
    console.log(`highEnd : ${highEnd}`);

    // Adjust logo size using the frequencies
    let newSize = !audio.paused
      ? Math.min(80, Math.max(20, bass + highEnd)
      : 20;

    console.log(`newSize : ${newSize}rem`);

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
