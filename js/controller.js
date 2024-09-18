"use strict";

// import * as model from "./model.js";

// Variables for the YouTube API section "My latest uploads"
const API_KEY = "";
const channelID = "";
let videoID = "";
const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUrV0A7I0EuvcrfKXKW8jo2Q&key=${API_KEY}`;

const musicPlaylistFetchURL =
  "https://youtube.googleapis.com/youtube/v3/playlists?part=contentDetails%2Csnippet&channelId=UCrV0A7I0EuvcrfKXKW8jo2Q&maxResults=30&key=[YOUR_API_KEY]";

/* `https://www.googleapis.com/youtube/v3/videos?part=player&id={videoID}&key={API_KEY}` */

const latestUploads = "";

// Variables for the button navigation for the YouTube API section "My Latest Uploads"
const videoBox = document.getElementById("videos__box");
const nextVideoBtn = document.getElementById("videos__nextVideoBtn");
const previousVideoBtn = document.getElementById("videos__previousVideoBtn");
const refreshBtn = document.getElementById("videos__refreshVideoListBtn");

// Variable for potential music playlist feature
const musicPlaylistID = "";

// Variables for the loader
const loader = document.getElementById("loader__box");
const videoLoader = document.getElementById("videos__loader");

// Other variables for selecting DOM elements
const toolsLink = document.getElementById("toolsLink");
const programsSection = document.getElementById("programsSection");
const heroImgID = document.getElementById("heroImgID");

let youtubeVideosPlaylist;
let j = 0;
let previous = 0;
let start = 0;
let end = 3;

const fetchYouTubeData = async function () {
  try {
    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUrV0A7I0EuvcrfKXKW8jo2Q&maxResults=25&key=${API_KEY}`
    );

    const data = await res.json();
    if (!res.ok) {
      console.log(`Error: ${res.status}`);
    }
    youtubeVideosPlaylist = data;
    console.log(youtubeVideosPlaylist);
  } catch (err) {
    loader.style.display = "none";
    console.log(err);
    videoBox.innerHTML = `<h3 class="errorText">Unable to fetch data. Error: ${err.message}</h3>`;
  }
};

fetchYouTubeData(API_KEY);

/* This function fetches the videos again and displays the first four on the webpage. 
The reason why I fetch it twice is because I wanted to allow the user to browse the latest 
videos instead of showing all of them at once. In the subsequent functions, for the buttons, 
they use the data from the youtubeVideosPlaylist variable because the data in the getVideos 
function is only available in that scope; The buttons needs the data to be in the global 
scope.

To be completely honest, I'm commenting this section of the code about 2-3 weeks after I 
made it so I don't remember why I didn't use the data I auto fetched the first time for the 
getVideos function. Maybe I'll rewrite in the next version of the website that I'm building 
in REACT
*/

const getVideos = async function () {
  try {
    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUrV0A7I0EuvcrfKXKW8jo2Q&maxResults=25&key=${API_KEY}`
    );

    const data = await res.json();
    if (!res.ok) {
      console.log(`Error: ${res.status}`);
    }
    loader.style.display = "none";

    for (let i = 0; i < 4; i++) {
      // data.items[i];
      videoBox.innerHTML += `
        <a target="_blank" href="https://www.youtube.com/watch?v=${data.items[i].snippet.resourceId.videoId}" id="video--${i}" class="youtubeVideo">
        <img src="${data.items[i].snippet.thumbnails.maxres.url}"/>
        <h3 id="videos_title">${data.items[i].snippet.title}</h3></a>`;
      j++;
      previous++;
    }

    nextVideoBtn.classList.remove("hidden");
    previousVideoBtn.classList.remove("hidden");
    refreshBtn.classList.remove("hidden");
  } catch (err) {
    loader.style.display = "none";
    console.log(err);
    videoBox.innerHTML = `<h3 class="errorText">Unable to fetch data. Error: ${err.message}</h3>`;
  }
};

function previousVideo() {
  if (previous < 25) {
    let topOfStack = document.getElementById(`video--${start}`);
    let bottomOfStack = document.getElementById(`video--${start + 3}`);

    // console.log(start);
    start++;

    topOfStack.classList.add("hidden");
    bottomOfStack.classList.remove("hidden");

    let tempElement = document.getElementById(`video--${previous}`);

    if (!tempElement) {
      videoBox.innerHTML += `
    <a target="_blank" href="https://www.youtube.com/watch?v=${youtubeVideosPlaylist.items[previous].snippet.resourceId.videoId}" id="video--${previous}" class="youtubeVideo">
    <img src="${youtubeVideosPlaylist.items[previous].snippet.thumbnails.maxres.url}"/>
    <h3 id="videos_title">${youtubeVideosPlaylist.items[previous].snippet.title}</h3></a>`;
    } else {
      tempElement.classList.remove("hidden");
    }
    previous++;

    // end++;

    /*
    console.log("start:");
    console.log(start);
    console.log("previous:");
    console.log(previous);
    */
  }
}

// Hides the first video (topOfStack) and decrements the start and previous variables
function nextVideo() {
  if (start > 0) {
    let bottomOfStack = document.getElementById(`video--${start + 3}`);
    bottomOfStack.classList.add("hidden");

    let topOfStack = document.getElementById(`video--${start - 1}`);

    topOfStack.classList.remove("hidden");
    start--;
    previous--;

    /*
    console.log(topOfStack);
    console.log(bottomOfStack);

    console.log("start:");
    console.log(start);
    console.log("previous:");
    console.log(previous);
    */
  }
}

// Function that hides all elements in the api section, sets the variables back to zero/default values and re-fetches the data
function refreshVideoList() {
  j = 0;
  previous = 0;
  start = 0;
  end = 3;

  videoBox.textContent = "";
  youtubeVideosPlaylist = {};
  previousVideoBtn.classList.add("hidden");
  nextVideoBtn.classList.add("hidden");
  refreshBtn.classList.add("hidden");
  loader.style.display = "flex";

  fetchYouTubeData(API_KEY);

  setTimeout(getVideos, 3000);
}

/// For cursor tracking effect in the hero section

function rotateElement(event, element) {
  // Get the mouse position
  const x = event.clientX;
  const y = event.clientY;

  /*
  const x = event.clientX - 970;
  const y = event.clientY - 100;
  */

  // console.log(x, y);

  // Find the middle
  const middleX = window.innerWidth / 2;
  const middleY = window.innerHeight / 2;

  // console.log(middleX, middleY);

  // Get the offset from the middle (How far away the mouse is from them middle)
  const offsetX = ((x - middleX) / middleX) * 5 - 2;
  const offsetY = ((y - middleY) / middleY) * 5 - 0.7;

  // console.log(offsetX, offsetY);

  element.style.setProperty("--rotateX", -1 * offsetY + "deg");
  element.style.setProperty("--rotateY", offsetX + "deg");
}

getVideos();

previousVideoBtn.addEventListener("click", function () {
  previousVideo();
});

nextVideoBtn.addEventListener("click", function () {
  nextVideo();
});

refreshBtn.addEventListener("click", function () {
  refreshVideoList();
});

document.addEventListener("mousemove", (e) => {
  rotateElement(e, heroImgID);
});
