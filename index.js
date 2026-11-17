setTimeout(() => {
  document.body.classList.remove("not-loaded");
}, 1000);

const music = new Audio("assets/music/TULUS - Jatuh Suka (Official Lyric Video).mp3");
const playButton = document.querySelector("#music-toggle");
const muteButton = document.querySelector("#music-mute");
const volumeSlider = document.querySelector("#music-volume");
const musicStatus = document.querySelector("#music-status");

music.loop = true;
music.preload = "auto";
music.volume = Number(volumeSlider.value);

let lastVolume = music.volume;
let playRequest = null;

function updateControls() {
  const isPlaying = !music.paused;
  const isMuted = music.muted || music.volume === 0;

  playButton.classList.toggle("is-playing", isPlaying);
  playButton.setAttribute("aria-pressed", String(isPlaying));
  playButton.setAttribute("aria-label", isPlaying ? "Jeda musik" : "Putar musik");
  playButton.title = isPlaying ? "Jeda musik" : "Putar musik";

  muteButton.classList.toggle("is-muted", isMuted);
  muteButton.setAttribute("aria-pressed", String(isMuted));
  muteButton.setAttribute("aria-label", isMuted ? "Aktifkan suara" : "Bisukan musik");
  muteButton.title = isMuted ? "Aktifkan suara" : "Bisukan musik";

  volumeSlider.value = String(music.volume);
}

function playMusic() {
  if (!music.paused) return Promise.resolve();
  if (playRequest) return playRequest;

  playRequest = music.play()
    .then(() => {
      musicStatus.textContent = "";
    })
    .catch((error) => {
      if (error.name === "NotAllowedError") {
        musicStatus.textContent = "Autoplay diblokir. Tekan tombol Putar untuk memulai musik.";
      } else {
        musicStatus.textContent = "Musik tidak dapat diputar.";
        console.error("Musik tidak dapat diputar:", error);
      }
    })
    .finally(() => {
      playRequest = null;
      updateControls();
    });

  return playRequest;
}

playButton.addEventListener("click", () => {
  if (music.paused) {
    void playMusic();
  } else {
    music.pause();
  }
});

muteButton.addEventListener("click", () => {
  if (music.muted || music.volume === 0) {
    if (music.volume === 0) music.volume = lastVolume || 0.25;
    music.muted = false;
  } else {
    music.muted = true;
  }
  updateControls();
});

volumeSlider.addEventListener("input", () => {
  const volume = Number(volumeSlider.value);
  music.volume = volume;
  music.muted = volume === 0;
  if (volume > 0) lastVolume = volume;
  updateControls();
});

music.addEventListener("play", updateControls);
music.addEventListener("pause", updateControls);
music.addEventListener("volumechange", updateControls);
music.addEventListener("error", () => {
  musicStatus.textContent = "File musik tidak dapat dimuat.";
  console.error("File musik tidak dapat dimuat:", music.error);
});

function startAfterFirstInteraction() {
  if (music.paused) void playMusic();
  document.removeEventListener("pointerdown", startAfterFirstInteraction);
  document.removeEventListener("keydown", startAfterFirstInteraction);
}

document.addEventListener("pointerdown", startAfterFirstInteraction);
document.addEventListener("keydown", startAfterFirstInteraction);
updateControls();
void playMusic();

const fallingHearts = document.querySelector(".heart-rain");
const sparkleField = document.querySelector(".sparkle-field");
const heartColors = ["#ff82b2", "#ffb2d0", "#e95287", "#ffd0e1"];

for (let index = 0; index < 24; index += 1) {
  const heart = document.createElement("span");
  heart.className = "falling-heart";
  heart.textContent = Math.random() > 0.35 ? "♥" : "♡";
  heart.style.setProperty("--heart-x", `${Math.random() * 100}%`);
  heart.style.setProperty("--heart-size", `${10 + Math.random() * 14}px`);
  heart.style.setProperty("--heart-color", heartColors[index % heartColors.length]);
  heart.style.setProperty("--fall-duration", `${11 + Math.random() * 12}s`);
  heart.style.setProperty("--fall-delay", `${-Math.random() * 22}s`);
  heart.style.setProperty("--heart-drift", `${-48 + Math.random() * 96}px`);
  fallingHearts.append(heart);
}

for (let index = 0; index < 22; index += 1) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.style.setProperty("--sparkle-x", `${Math.random() * 100}%`);
  sparkle.style.setProperty("--sparkle-y", `${Math.random() * 100}%`);
  sparkle.style.setProperty("--sparkle-size", `${2 + Math.random() * 3}px`);
  sparkle.style.setProperty("--sparkle-duration", `${2 + Math.random() * 3}s`);
  sparkle.style.setProperty("--sparkle-delay", `${-Math.random() * 5}s`);
  sparkleField.append(sparkle);
}

const romanticQuotes = [
  "Di antara banyak nama yang pernah singgah, Icha adalah nama yang ingin selalu kusebut dalam doa.",
  "Jika hujan punya cerita, mungkin namamu adalah alasan mengapa aku suka menatap langit.",
  "Icha, kamu tidak harus menjadi sempurna untuk menjadi seseorang yang begitu istimewa.",
  "Ada banyak hal indah di dunia, tetapi senyummu selalu punya cara tersendiri untuk membuat hariku lebih baik."
];
const openSpecialButton = document.querySelector("#open-special");
const messageOverlay = document.querySelector("#message-overlay");
const messageCard = messageOverlay.querySelector(".message-card");
const closeSpecialButton = document.querySelector("#close-special");
const nextQuoteButton = document.querySelector("#next-quote");
const copyQuoteButton = document.querySelector("#copy-quote");
const finalRevealButton = document.querySelector("#final-reveal-button");
const quoteText = document.querySelector("#romantic-quote");
const copyStatus = document.querySelector("#copy-status");
let quoteIndex = 0;
let closeMessageTimer = null;
let finalRevealStarted = false;

function openSpecialMessage() {
  window.clearTimeout(closeMessageTimer);
  messageOverlay.hidden = false;
  window.requestAnimationFrame(() => {
    messageOverlay.classList.add("is-open");
    closeSpecialButton.focus();
  });
}

function closeSpecialMessage() {
  if (finalRevealStarted) return;

  messageOverlay.classList.remove("is-open");
  closeMessageTimer = window.setTimeout(() => {
    if (!messageOverlay.classList.contains("is-open")) {
      messageOverlay.hidden = true;
      openSpecialButton.focus();
    }
  }, 320);
}

function showNextQuote() {
  if (quoteIndex >= romanticQuotes.length - 1) return;

  quoteIndex += 1;
  nextQuoteButton.disabled = true;
  quoteText.classList.add("is-changing");
  copyStatus.textContent = "";

  window.setTimeout(() => {
    quoteText.textContent = romanticQuotes[quoteIndex];
    quoteText.classList.remove("is-changing");
    nextQuoteButton.disabled = false;

    if (quoteIndex === romanticQuotes.length - 1) {
      nextQuoteButton.hidden = true;
      finalRevealButton.hidden = false;
    }
  }, 220);
}

function startFinalReveal() {
  if (finalRevealStarted) return;

  finalRevealStarted = true;
  finalRevealButton.disabled = true;
  document.body.classList.add("final-fade-out");

  window.setTimeout(() => {
    messageOverlay.hidden = true;
    messageOverlay.classList.remove("is-open");
    messageOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("final-fade-out");
    document.body.classList.add("final-reveal");
    playButton.focus();
  }, 850);
}

function copyTextFallback(text) {
  const temporaryInput = document.createElement("textarea");
  temporaryInput.value = text;
  temporaryInput.setAttribute("readonly", "");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.opacity = "0";
  document.body.append(temporaryInput);

  let didCopy = false;
  try {
    temporaryInput.select();
    didCopy = document.execCommand("copy");
  } finally {
    temporaryInput.remove();
  }
  if (!didCopy) throw new Error("Perintah salin tidak berhasil.");
}

async function copyCurrentQuote() {
  const text = quoteText.textContent;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      copyTextFallback(text);
    }
    copyStatus.textContent = "Kata-kata untuk Icha berhasil disalin.";
  } catch (error) {
    copyStatus.textContent = "Belum berhasil disalin. Silakan pilih dan salin teksnya.";
    console.error("Kata-kata tidak dapat disalin:", error);
  }
}

openSpecialButton.addEventListener("click", openSpecialMessage);
closeSpecialButton.addEventListener("click", closeSpecialMessage);
nextQuoteButton.addEventListener("click", showNextQuote);
copyQuoteButton.addEventListener("click", copyCurrentQuote);
finalRevealButton.addEventListener("click", startFinalReveal);
messageOverlay.addEventListener("click", (event) => {
  if (event.target === messageOverlay) closeSpecialMessage();
});

document.addEventListener("keydown", (event) => {
  if (messageOverlay.hidden || finalRevealStarted) return;

  if (event.key === "Escape") {
    closeSpecialMessage();
    return;
  }

  if (event.key === "Tab") {
    const focusableElements = messageCard.querySelectorAll("button:not([disabled]):not([hidden])");
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});
