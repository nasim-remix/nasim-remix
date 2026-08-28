/* =========================================
   NASIM REMIX MUSIC PLAYER
========================================= */

const songs = [

    "ریمیکس شماره ۱",
    "ریمیکس شماره ۲",
    "ریمیکس شماره ۳",
    "ریمیکس شماره ۴",
    "ریمیکس شماره ۵",
    "ریمیکس شماره ۶",
    "ریمیکس شماره ۷",
    "ریمیکس شماره ۸",
    "ریمیکس شماره ۹",
    "ریمیکس شماره ۱۰",
    "ریمیکس شماره ۱۱",
    "ریمیکس شماره ۱۲",
    "ریمیکس شماره ۱۳",
    "ریمیکس شماره ۱۴",
    "ریمیکس شماره ۱۵",
    "ریمیکس شماره ۱۶",
    "ریمیکس شماره ۱۷",
    "ریمیکس شماره ۱۸",
    "ریمیکس شماره ۱۹",
    "ریمیکس شماره ۲۰"

];

const audio = document.getElementById("audio");

const musicList = document.getElementById("musicList");

const playerTitle = document.getElementById("playerTitle");

const playerCover = document.getElementById("playerCover");

const playBtn = document.getElementById("play");

const progress = document.getElementById("progress");

const volume = document.getElementById("volume");

const currentTime = document.getElementById("currentTime");

const duration = document.getElementById("duration");

const search = document.getElementById("search");

const previous = document.getElementById("previous");

const next = document.getElementById("next");

const shuffle = document.getElementById("shuffle");

const repeat = document.getElementById("repeat");

const likePlayer = document.getElementById("likePlayer");


let currentIndex = -1;

let isShuffle = false;

let isRepeat = false;

let favorites = JSON.parse(
    localStorage.getItem("nasimFavorites") || "[]"
);


/* =========================================
   ساخت کارت موزیک
========================================= */

function renderSongs(list = songs){

    musicList.innerHTML = "";

    list.forEach((song, index) => {

        const realIndex = songs.indexOf(song);

        const card = document.createElement("div");

        card.className = "music-card";

        card.dataset.index = realIndex;

        const liked = favorites.includes(realIndex);

        card.innerHTML = `

            <div class="cover">
                ${index % 3 === 0 ? "🌅" :
                  index % 3 === 1 ? "🌊" : "🎧"}
            </div>

            <div class="track-info">

                <h3>${song}</h3>

                <p>
                    NASIM REMIX • MP3
                </p>

            </div>

            <button class="card-play">
                ▶
            </button>

            <button class="card-like">
                ${liked ? "♥" : "♡"}
            </button>

        `;


        /* پخش */

        card
            .querySelector(".card-play")
            .addEventListener("click", () => {

                playSong(realIndex);

            });


        /* علاقه مندی */

        card
            .querySelector(".card-like")
            .addEventListener("click", (event) => {

                event.stopPropagation();

                toggleFavorite(realIndex);

            });


        /* کلیک روی کارت */

        card.addEventListener("click", (event) => {

            if(
                !event.target.classList.contains("card-like") &&
                !event.target.classList.contains("card-play")
            ){

                playSong(realIndex);

            }

        });


        musicList.appendChild(card);

    });

    updateCards();

}


/* =========================================
   پخش موزیک
========================================= */

function playSong(index){

    if(index < 0 || index >= songs.length){
        return;
    }

    currentIndex = index;

    audio.src = `music/music${index + 1}.mp3`;

    playerTitle.textContent = songs[index];

    playerCover.textContent =
        index % 3 === 0 ? "🌅" :
        index % 3 === 1 ? "🌊" : "🎧";

    audio.play()
        .then(() => {

            playBtn.textContent = "❚❚";

        })
        .catch(() => {

            playBtn.textContent = "▶";

        });

    updateCards();

    updateLikeButton();

}


/* =========================================
   Play / Pause
========================================= */

playBtn.addEventListener("click", () => {

    if(currentIndex === -1){

        playSong(0);

        return;

    }

    if(audio.paused){

        audio.play();

        playBtn.textContent = "❚❚";

    }else{

        audio.pause();

        playBtn.textContent = "▶";

    }

});


audio.addEventListener("play", () => {

    playBtn.textContent = "❚❚";

    updateCards();

});


audio.addEventListener("pause", () => {

    playBtn.textContent = "▶";

});


/* =========================================
   زمان موزیک
========================================= */

audio.addEventListener("loadedmetadata", () => {

    duration.textContent =
        formatTime(audio.duration);

});


audio.addEventListener("timeupdate", () => {

    if(!audio.duration){
        return;
    }

    const percent =
        (audio.currentTime / audio.duration) * 100;

    progress.value = percent;

    currentTime.textContent =
        formatTime(audio.currentTime);

});


progress.addEventListener("input", () => {

    if(!audio.duration){
        return;
    }

    audio.currentTime =
        (progress.value / 100) * audio.duration;

});


function formatTime(seconds){

    if(!seconds || isNaN(seconds)){
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return `${minutes}:${secs
        .toString()
        .padStart(2,"0")}`;

}


/* =========================================
   بعدی
========================================= */

next.addEventListener("click", () => {

    if(isShuffle){

        let random;

        do{

            random =
                Math.floor(
                    Math.random() * songs.length
                );

        }while(random === currentIndex && songs.length > 1);

        playSong(random);

        return;

    }

    let nextIndex =
        currentIndex + 1;

    if(nextIndex >= songs.length){
        nextIndex = 0;
    }

    playSong(nextIndex);

});


/* =========================================
   قبلی
========================================= */

previous.addEventListener("click", () => {

    let previousIndex =
        currentIndex - 1;

    if(previousIndex < 0){
        previousIndex = songs.length - 1;
    }

    playSong(previousIndex);

});


/* =========================================
   پایان آهنگ
========================================= */

audio.addEventListener("ended", () => {

    if(isRepeat){

        audio.currentTime = 0;

        audio.play();

        return;

    }

    next.click();

});


/* =========================================
   Shuffle
========================================= */

shuffle.addEventListener("click", () => {

    isShuffle = !isShuffle;

    shuffle.style.opacity =
        isShuffle ? "1" : ".5";

});


/* =========================================
   Repeat
========================================= */

repeat.addEventListener("click", () => {

    isRepeat = !isRepeat;

    repeat.style.opacity =
        isRepeat ? "1" : ".5";

});


/* =========================================
   صدا
========================================= */

volume.addEventListener("input", () => {

    audio.volume = volume.value;

});

audio.volume = .8;


/* =========================================
   Favorites
========================================= */

function toggleFavorite(index){

    if(favorites.includes(index)){

        favorites =
            favorites.filter(
                item => item !== index
            );

    }else{

        favorites.push(index);

    }

    localStorage.setItem(
        "nasimFavorites",
        JSON.stringify(favorites)
    );

    renderSongs();

    updateLikeButton();

}


function updateLikeButton(){

    if(currentIndex === -1){

        likePlayer.textContent = "♡";

        return;

    }

    likePlayer.textContent =
        favorites.includes(currentIndex)
            ? "♥"
            : "♡";

}


likePlayer.addEventListener("click", () => {

    if(currentIndex !== -1){

        toggleFavorite(currentIndex);

    }

});


/* =========================================
   کارت فعال
========================================= */

function updateCards(){

    document
        .querySelectorAll(".music-card")
        .forEach(card => {

            const index =
                Number(card.dataset.index);

            const button =
                card.querySelector(".card-play");

            if(index === currentIndex){

                card.classList.add("playing");

                button.textContent =
                    audio.paused ? "▶" : "❚❚";

            }else{

                card.classList.remove("playing");

                button.textContent = "▶";

            }

        });

}


/* =========================================
   Search
========================================= */

search.addEventListener("input", () => {

    const value =
        search.value.trim().toLowerCase();

    const filtered =
        songs.filter(song =>
            song.toLowerCase().includes(value)
        );

    renderSongs(filtered);

});


/* =========================================
   شروع
========================================= */

renderSongs();