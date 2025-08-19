const songs = [
  {
    title: "Song One",
    artist: "Artist A",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    image: "https://picsum.photos/200?random=1"
  },
  {
    title: "Song Two",
    artist: "Artist B",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    image: "https://picsum.photos/200?random=2"
  }
];

let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const thumbnail = document.getElementById("thumbnail");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  thumbnail.src = song.image;
  updatePlaylistUI();
}

function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.textContent = "⏸️";
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.textContent = "▶️";
}

function nextSong() {
  if (isShuffle) {
    songIndex = Math.floor(Math.random() * songs.length);
  } else {
    songIndex = (songIndex + 1) % songs.length;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgress() {
  const { duration, currentTime } = audio;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = isNaN(duration) ? "0:00" : formatTime(duration);
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function changeVolume() {
  audio.volume = volumeSlider.value;
}

function updatePlaylistUI() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    if (index === songIndex) li.classList.add("active");
    li.addEventListener("click", () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

// Shuffle & Repeat toggles
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "cyan" : "white";
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? "cyan" : "white";
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    isPlaying ? pauseSong() : playSong();
  } else if (e.code === "ArrowRight") {
    nextSong();
  } else if (e.code === "ArrowLeft") {
    prevSong();
  }
});

audio.addEventListener("ended", () => {
  isRepeat ? playSong() : nextSong();
});

// Event Listeners
playBtn.addEventListener("click", () => isPlaying ? pauseSong() : playSong());
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);
volumeSlider.addEventListener("input", changeVolume);

// Init
loadSong(songs[songIndex]);
volumeSlider.value = 0.5;
audio.volume = 0.5;
