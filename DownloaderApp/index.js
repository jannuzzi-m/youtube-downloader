const { API_KEY } = require("./api");

const { json } = require("./fakeData");

const listPage = document.getElementById("list");
const detailsPage = document.getElementById("details");
const video = document.getElementById("vp");

const btnDownload = document.getElementById("btnDownload");
const tbody = document.getElementById("tc");
const inputField = document.getElementById("searchInput");
const inputBtn = document.getElementById("searchBtn");
const backBtn = document.getElementById("btnVoltar");

const downloadModal = document.getElementById("download-modal");
const loadingModal = document.getElementById("loading-modal")

const downloadVideoBtn = document.getElementById("downloadTabBtn");
const cancelDownloadVideoBtn = document.getElementById("cancelDownloadVideoBtn");

const gifCatDownloading = "https://media.giphy.com/media/LHZyixOnHwDDy/giphy.gif"
const gifCatDownloadDone = "https://media.giphy.com/media/jQWUkD7a4AWfkraBJa/giphy.gif"

const gif = document.getElementById('gif')
const downloadLine = document.getElementById('downloading-line');

const get = (keyword) => {
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&type=video&q=${keyword}`;
  tbody.innerHTML = "";
  fetch(url)
      .then(response => response.json())
      .then(json =>  showInfo(json))
  // showInfo(json);
};

let showDetails = (info) => {
  video.src = setUrl(info.id.videoId);
  listPage.style.display = "none";
  detailsPage.style.display = "block";
  btnDownload.addEventListener("click", () => download(info));
};

let backToList = () => {
  detailsPage.style.display = "none";
  listPage.style.display = "block";
  // video.src = "";
};

let showInfo = (json) => {
  let items = json.items;
  items.map((item, index) => {
    let th = document.createElement("tr");

    let id = document.createTextNode(index + 1);
    let img = document.createElement("img");
    img.style.width = "100px";
    img.src = item.snippet.thumbnails.default.url;
    let title = document.createTextNode(item.snippet.title);
    let canal = document.createTextNode(item.snippet.channelTitle);
    let btn = document.createElement("button");
    btn.classList.add("btn");
    btn.classList.add("btn-success");

    btn.addEventListener("click", () => showDetails(item));

    let btnDownload = document.createTextNode("Detalhes");
    btn.appendChild(btnDownload);

    let idData = document.createElement("th");
    idData.appendChild(id);

    let imageData = document.createElement("td");
    imageData.appendChild(img);

    let titleData = document.createElement("td");
    titleData.appendChild(title);

    let canalData = document.createElement("td");
    canalData.appendChild(canal);

    let downlaodData = document.createElement("td");
    downlaodData.appendChild(btn);

    // th.appendChild(linha);
    th.appendChild(idData);
    th.appendChild(imageData);
    th.appendChild(titleData);
    th.appendChild(canalData);
    th.appendChild(downlaodData);

    tbody.appendChild(th);
  });
};

let setUrl = (id) => {
  let searchhUrl = `https://www.youtube.com/embed/${id}?autoplay=0`;
  return searchhUrl;
};
backBtn.addEventListener("click", backToList);

let download = (info) => {
  downloadModal.style.display = "flex";
  downloadVideoBtn.addEventListener("click", () => downloadVideo(info));
};

let downloadVideo = (info) => {
  closeDownloadModal();
  openLoadingModal()
  let data = {
    VideoId: info.id.videoId,
    Title: info.snippet.title,
  };

  fetch("https://localhost:5001/api/Videos", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      closeLoadingModal()
    });
};

let downloadAudio = () => {
  return null;
};

let closeDownloadModal = () => {
  downloadModal.style.display = "none";
};

let openLoadingModal = () => {
  downloadLine.innerHTML = "Downloading";
  gif.src = gifCatDownloading;
  loadingModal.style.display = 'flex';
}
let closeLoadingModal = () => {
  downloadLine.innerHTML = "Done";

  gif.src = gifCatDownloadDone;
  setTimeout(() => loadingModal.style.display = 'none', 2000);

  
  
}

inputBtn.addEventListener("click", () => get(inputField.value));

cancelDownloadVideoBtn.addEventListener("click", () => closeDownloadModal());
