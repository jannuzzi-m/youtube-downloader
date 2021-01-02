const { API_KEY } = require("./api");
const { json } = require("./fakeData");

const DOM = {
  gifs: {
    gifElement: document.getElementById('gif'),
    gifDownloading: "https://media.giphy.com/media/LHZyixOnHwDDy/giphy.gif",
    gifDownloadDone: gifCatDownloadDone = "https://media.giphy.com/media/jQWUkD7a4AWfkraBJa/giphy.gif"
  },
  modals: {
    downloadOptionsModal: document.getElementById("download-modal"),
    downloadingModal: document.getElementById("loading-modal")
  },
  buttons:{
    downloadOptions: document.getElementById("btnDownloadOptions"),
    backFromDetails: document.getElementById("btnVoltar"),
    search: document.getElementById("searchBtn"),
    backFromDownloadOptions: document.getElementById("cancelDownloadVideoBtn"),
    downloadVideo: document.getElementById("downloadVideo")
  },
  texts: {
    downloadLine: document.getElementById('downloadin-h1')
  },
  divs:{
    detailsPage: document.getElementById("details"),
    searchPage: document.getElementById("list")
  },
  tableContent:{
    tableBody: document.getElementById("tc")
  },
  forms:{
    searchInput: document.getElementById("searchInput"),
  },
  media: {
    youtubeVideoPlayer: document.getElementById("vp")
  }
}

const get = (keyword) => {
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&type=video&q=${keyword}`;
  DOM.tableContent.tableBody.innerHTML = "";
  fetch(url)
      .then(response => response.json())
      .then(json =>  showInfo(json))
  // showInfo(json);
};

let showDetails = (info) => {
  DOM.media.youtubeVideoPlayer.src = setUrl(info.id.videoId);
  DOM.divs.searchPage.style.display = "none";
  DOM.divs.detailsPage.style.display = "block";
  DOM.buttons.downloadOptions.addEventListener("click", () => download(info));
};

let backToList = () => {
  DOM.divs.detailsPage.style.display = "none";
  DOM.divs.searchPage.style.display = "block";
  DOM.media.youtubeVideoPlayer.src = "";
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

    DOM.tableContent.tableBody.appendChild(th);
  });
};

let setUrl = (id) => {
  let searchhUrl = `https://www.youtube.com/embed/${id}?autoplay=0`;
  return searchhUrl;
};
DOM.buttons.backFromDetails.addEventListener("click", backToList);

let download = (info) => {
  DOM.modals.downloadOptionsModal.style.display = "flex";
  DOM.buttons.downloadVideo.addEventListener("click", () => downloadVideo(info));
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
  DOM.modals.downloadOptionsModal.style.display = "none";
};

let openLoadingModal = () => {
  DOM.texts.downloadLine.innerHTML = "Downloading";
  DOM.gifs.gifElement.src = DOM.gifs.gifDownloading;
  DOM.modals.downloadingModal.style.display = 'flex';
}
let closeLoadingModal = () => {
  DOM.texts.downloadLine.innerHTML = "Done";

  DOM.gifs.gifElement.src = DOM.gifs.gifDownloadDone;
  setTimeout(() => DOM.modals.downloadingModal.style.display = 'none', 2000);

  
  
}

DOM.buttons.search.addEventListener("click", () => get(DOM.forms.searchInput.value));

DOM.buttons.backFromDownloadOptions.addEventListener("click", () => closeDownloadModal());
