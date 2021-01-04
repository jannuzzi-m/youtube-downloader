const { API_KEY } = require("./api");
const { json } = require("./fakeData");

const DOM = {
  gifs: {
    gifElement: document.getElementById("gif"),
    gifDownloading: "https://media.giphy.com/media/LHZyixOnHwDDy/giphy.gif",
    gifDownloadDone: (gifCatDownloadDone =
      "https://media.giphy.com/media/jQWUkD7a4AWfkraBJa/giphy.gif"),
  },
  modals: {
    downloadOptionsModal: document.getElementById("download-modal"),
    downloadingModal: document.getElementById("loading-modal"),
  },
  buttons: {
    downloadOptions: document.getElementById("btnDownloadOptions"),
    backFromDetails: document.getElementById("btnVoltar"),
    search: document.getElementById("searchBtn"),
    backFromDownloadOptions: document.getElementById("cancelDownloadVideoBtn"),
    downloadVideo: document.getElementById("downloadVideo"),
  },
  texts: {
    downloadLine: document.getElementById("downloadin-h1"),
  },
  divs: {
    detailsPage: document.getElementById("details"),
    searchPage: document.getElementById("list"),
    searchByUrl: document.getElementById("searchByUrl"),
  },
  tableContent: {
    tableBody: document.getElementById("tc"),
    downloadTableBody: document.getElementById("download-tablebody"),
  },
  forms: {
    searchInput: document.getElementById("searchInput"),
    searchByUrlInput: document.getElementById("searchByUrlInput"),
    searchBuUrlButton: document.getElementById("search-by-url-button"),
  },
  media: {
    youtubeVideoPlayer: document.getElementById("vp"),
  },
  tabsElements: {
    searchPageButton: document.getElementById("search-page-button"),
    searchByUrlButton: document.getElementById("search-by-url-tab-button"),
    tabsToggle: document.getElementById('toggleDownloads')
  },
};

const get = (keyword) => {
  // let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&type=video&q=${keyword}`;
  // DOM.tableContent.tableBody.innerHTML = "";
  // fetch(url)
  //     .then(response => response.json())
  //     .then(json =>  showInfo(json))
  showInfo(json);
};

let getDownloads = () => {
  fetch("http://localhost:5001/api/videos")
    .then((response) => response.json())
    .then((info) => createDownloadsTable(info));
};

let showDetails = (info) => {
  DOM.tabsElements.tabsToggle.style.display = 'none';
  DOM.media.youtubeVideoPlayer.src = setUrl(info.id.videoId);
  DOM.divs.searchPage.style.display = "none";
  DOM.divs.detailsPage.style.display = "block";
  DOM.buttons.downloadOptions.addEventListener("click", () => download(info));
};

let backToList = () => {
  DOM.tabsElements.tabsToggle.style.display = 'block';
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

let download = (info) => {
  DOM.modals.downloadOptionsModal.style.display = "flex";
  DOM.buttons.downloadVideo.addEventListener("click", () =>
    downloadVideo(info)
  );
};

let downloadVideo = (info, byUrl = false) => {
  let data;
  console.log(info);
  closeDownloadModal();
  openLoadingModal();

  if (byUrl) {
    data = {
      VideoId: info.split("v=")[1],
      Title: "ByUrl",
    };
    console.log(data);
  } else {
    data = {
      VideoId: info.id.videoId,
      Title: info.snippet.title,
    };
  }

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
      closeLoadingModal();
      downloadFile(json);
    });
};

// https://www.youtube.com/watch?v=dhzixD5EFUc
let downloadAudio = () => {
  return null;
};

let closeDownloadModal = () => {
  DOM.modals.downloadOptionsModal.style.display = "none";
};

let openLoadingModal = () => {
  DOM.texts.downloadLine.innerHTML = "Processing...";
  DOM.gifs.gifElement.src = DOM.gifs.gifDownloading;
  DOM.modals.downloadingModal.style.display = "flex";
};
let closeLoadingModal = () => {
  DOM.texts.downloadLine.innerHTML = "Done";

  DOM.gifs.gifElement.src = DOM.gifs.gifDownloadDone;
  setTimeout(() => (DOM.modals.downloadingModal.style.display = "none"), 2000);
};

let createDownloadsTable = (info) => {
  info.map((video, index) => {
    let tableRow = document.createElement("tr");

    let videoId = document.createTextNode(index + 1);
    let videoIdTh = document.createElement("th");
    videoIdTh.appendChild(videoId);

    let videoTitle = document.createTextNode(video.title);
    let videoTitleTd = document.createElement("td");
    videoTitleTd.appendChild(videoTitle);

    let downloadButtonText = document.createTextNode("Download");
    let downloadButton = document.createElement("button");
    let downloadButtonRow = document.createElement("td");
    downloadButton.appendChild(downloadButtonText);
    downloadButtonRow.classList.add("btn");
    downloadButtonRow.classList.add("btn-success");
    downloadButtonRow.appendChild(downloadButton);

    tableRow.appendChild(videoIdTh);
    tableRow.appendChild(videoTitleTd);
    tableRow.appendChild(downloadButtonRow);

    DOM.tableContent.downloadTableBody.appendChild(tableRow);
  });
};

let downloadFile = (json) => {
  fetch(`https://localhost:5001/${json.videoPath}`)
    .then((response) => response.blob())
    .then((blob) => blobToFile(blob, json.videoPath.split("/")[1]));
};

let blobToFile = (blob, fileName) => {
  let body = document.getElementsByTagName("body")[0];
  let a = document.createElement("a");
  a.style.display = "none";
  body.appendChild(a);

  let url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(blob);
  body.removeChild(a);
};

let toggleToSearchByUrl = () => {
  DOM.tabsElements.searchPageButton.classList.remove("active");
  DOM.tabsElements.searchByUrlButton.classList.add("active");
  DOM.divs.searchPage.style.display = "none";
  DOM.divs.searchByUrl.style.display = "block";
};

let toggleToSearch = () => {
  DOM.tabsElements.searchPageButton.classList.add("active");
  DOM.tabsElements.searchByUrlButton.classList.remove("active");
  DOM.divs.searchByUrl.style.display = "none";
  DOM.divs.searchPage.style.display = "block";
};

DOM.buttons.search.addEventListener("click", () =>
  get(DOM.forms.searchInput.value)
);
DOM.buttons.backFromDownloadOptions.addEventListener("click", () =>
  closeDownloadModal()
);
DOM.buttons.backFromDetails.addEventListener("click", backToList);
DOM.tabsElements.searchByUrlButton.addEventListener("click", () =>
  toggleToSearchByUrl()
);
DOM.tabsElements.searchPageButton.addEventListener("click", () =>
  toggleToSearch()
);
DOM.forms.searchBuUrlButton.addEventListener("click", () =>
  downloadVideo(DOM.forms.searchByUrlInput.value, true)
);
getDownloads();
