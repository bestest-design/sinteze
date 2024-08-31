// Audio handling
const audio = new Audio("assets/sinteze.ogg");
audio.loop = true;
audio.play();

const h1 = document.querySelector("h1[main]");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function adjustFontSize() {
  analyser.getByteFrequencyData(dataArray);
  const bass =
    dataArray.slice(0, bufferLength / 8).reduce((a, b) => a + b, 0) /
    (bufferLength / 8);
  h1.style.fontSize = 3 + bass / 100 + "rem";
  requestAnimationFrame(adjustFontSize);
}

adjustFontSize();

// Play/Stop and Mute/Unmute buttons
const playStopBtn = document.getElementById("playStop");
const muteUnmuteBtn = document.getElementById("muteUnmute");

playStopBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playStopBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    audio.pause();
    playStopBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
});

muteUnmuteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteUnmuteBtn.innerHTML = audio.muted
    ? '<i class="fas fa-volume-mute"></i>'
    : '<i class="fas fa-volume-up"></i>';
});
