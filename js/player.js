// player.js

document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("backgroundAudio");
  const h1 = document.querySelector("h1[main]");

  const playStopBtn = document.getElementById("playStop");
  const muteUnmuteBtn = document.getElementById("muteUnmute");

  let audioContext, analyser, source, bufferLength, dataArray;

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

      adjustFontSize();
    }
  }

  // Adjust the font size of h1 based on low-end frequencies
  function adjustFontSize() {
    analyser.getByteFrequencyData(dataArray);
    const bass =
      dataArray.slice(0, bufferLength / 8).reduce((a, b) => a + b, 0) /
      (bufferLength / 8);
    h1.style.fontSize = 3 + bass / 100 + "rem";
    requestAnimationFrame(adjustFontSize);
  }

  // Play/Stop button event listener
  playStopBtn.addEventListener("click", () => {
    initAudio(); // Initialize audio context if not done already
    if (audio.paused) {
      audio.play().catch((error) => {
        console.log(error);
        console.log("attempting to resume");
        getAudioContext().resume();
      });
      playStopBtn.innerHTML = '<i class="fas fa-pause"></i>';
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

  // Automatically play audio on page load
  initAudio();
  playStopBtn.click();
  // audio.play().catch((error) => console.log(error));
});
