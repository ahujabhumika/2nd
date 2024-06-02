let currentSong = new Audio();
let songs;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5501/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play()
    }
    currentSong.play();
    play.src = "pause.svg";

    // Update track information
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    // Reset song time
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}

async function main() {
    // Get the list of all the songs
    songs = await getSongs();

    playMusic(songs[0], true)
    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        let li = document.createElement("li");
        li.innerHTML = `<img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replace("%20", "")}</div>
                                <div>SSDN</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>`;
        songUL.appendChild(li);
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(songName);
        });
    });

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });
    // listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

    })
    // Add a eventlistner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%",
            currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    // Add event Listner to previous
    pre.addEventListener("click", () => {
        console.log("pre clicked ");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    // Add event listner to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting value to", e.target.value, "/100");
        currentSong.volume = parseInt(e.target.value) / 100
    })


}

main();