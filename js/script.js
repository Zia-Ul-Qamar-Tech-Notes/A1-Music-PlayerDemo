let currentSong = new Audio();
let songs;
let currPlaylist;
// let folder;

const time = (seconds) => {
  const min = Math.floor(seconds / 60);
  const remSec = Math.floor(seconds % 60);

  const formatMin = String(min).padStart(2, "0");
  const formatSec = String(remSec).padStart(2, "0");

  return `${formatMin}:${formatSec}`;
};

async function getSongs(folder) {
  
  currPlaylist = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let link = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < link.length; index++) {
    const element = link[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
                  <img class="invert" src="img/play.svg" alt="Music Icon" srcset="">
                  <div class="info">
                      <div>${song.replaceAll("%20", " ")}</div>
                      <div>Zia Ul Qamar</div>
                  </div>
                  <div class="playNow">
                      <span>Play Now</span>
                  <img class="invert" src="img/play.svg" alt="Music Icon" srcset="">
              </div>
      </li>

      `;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}

const playMusic = (track) => {
  currentSong.src = `/${currPlaylist}/` + track;

  currentSong.play();
  mplayButton.src = "img/pause.svg";
  document.querySelector(".songInfo").innerHTML = track.substring(0, 30);
  document.querySelector(".songTime").text = "00:00 / 00:00";
};

async function displayAlbum() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let allAnchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(allAnchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-2)[1];
      console.log(folder)
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder=${folder} class="card">
      <div  class="play">
          <svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#000000" stroke-width="1.5" fill="green"/> <!-- Change fill to green -->
              <path d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
      </div>
      <img src="/songs/${folder}/cover.jpg" alt="Cover">
      <h2>${response.title}</h2>
      <p>${response.description}</p>
  </div>`;
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      let songsList = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}

async function main() {
  await getSongs(`songs/naat`);
  displayAlbum();

  mplayButton.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      mplayButton.src = "img/pause.svg";
    } else {
      currentSong.pause();
      mplayButton.src = "img/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${time(
      currentSong.currentTime
    )}:${time(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
    // document.querySelector(".circle").style.width = (currentSong.currentTime/currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index > 0) {
      index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
      playMusic(decodeURI(songs[index - 1]));
    }
  });
  next.addEventListener("click", () => {
    console.log(currentSong.src.split("/").slice(-1)[0])
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic((decodeURI(songs[index + 1])));
    }
  });
}

main();
