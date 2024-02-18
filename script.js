let currentSong = new Audio();


const time = (seconds)=>{
    const min = Math.floor(seconds/60)
    const remSec = Math.floor(seconds%60);

    const formatMin = String(min).padStart(2, "0");
    const formatSec = String(remSec).padStart(2, '0');

    return `${formatMin}:${formatSec}`;
}


async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  // console.log(response );
  let div = document.createElement("div");
  div.innerHTML = response;
  let link = div.getElementsByTagName("a");
  // console.log(link)
  let songs = [];
  for (let index = 0; index < link.length; index++) {
    const element = link[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track) => {
  currentSong.src = "/songs/" + track;
  currentSong.play();
  mplayButton.src = "pause.svg";
  document.querySelector(".songInfo").innerHTML = track.substring(0,20);
  document.querySelector(".songTime").text = "00:00 / 00:00"
};

async function main() {
  let songs = await getSongs();
  // console.log(songs)
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
                    <img class="invert" src="play.svg" alt="Music Icon" srcset="">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Zia Ul Qamar</div>
                    </div>
                    <div class="playNow">
                        <span>Play Now</span>
                    <img class="invert" src="play.svg" alt="Music Icon" srcset="">
                </div>
        </li>

        `;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (elemernt) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });


  mplayButton.addEventListener("click", ()=>{
    if(currentSong.paused){
        currentSong.play();
        mplayButton.src = "pause.svg";
    }else{
        currentSong.pause();
        mplayButton.src = "play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", ()=>{
    console.log(currentSong.currentTime, currentSong.currentTime);
    document.querySelector(".songTime").innerHTML  = `${time(currentSong.currentTime)}:${time(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";
    // document.querySelector(".circle").style.width = (currentSong.currentTime/currentSong.duration) * 100 + "%";
  })

  document.querySelector(".seekBar").addEventListener("click", e=>{
    console.log(e.offsetX/e.target.getBoundingClientRect().width)*100;
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left = percent  + "%";
    currentSong.currentTime = (currentSong.duration*percent)/100;
   
  })

  document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "0"
    
  })
  document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-120%"
    
  })

}

main();
