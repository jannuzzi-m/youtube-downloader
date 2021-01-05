const fs = require('fs');

let apiKey;
let ipAdress;


let settingUp = () => {
  fs.readFile('./config.json', 'utf8', (err, response) => {
    if(err){
      console.log(err);
      return
    }
    let parsedJson = JSON.parse(response);
    if(parsedJson.APIKey == "" || parsedJson.IpAdress =="")
    {
      apiKeyModal.style.display = "flex";
    }
    apiKey = parsedJson.APIKey;
    ipAdress = parsedJson.IpAdress;
    
    
  })
  
}

settingUp();

const submmitApiKey = document.getElementById('submmit-api-key');
const apiKeyInput = document.getElementById('apiKeyInput');
const apiKeyModal = document.getElementById('api_key-modal');
const apiAdress = document.getElementById('ip-adress');

const openSettingsModal = document.getElementById('open-settings');

submmitApiKey.addEventListener('click', ()=>{
  setConfig(apiKeyInput.value, apiAdress.value)
  apiKeyModal.style.display = 'none';

})

let setConfig = (apikey, ipAdress) =>{
  if(apiKey != "")
  {
    return
  }
  let newConfig = {
    IpAdress: ipAdress,
    APIKey: apikey
  } 

  let newConfigStringfy = JSON.stringify(newConfig);
  fs.writeFile('./config.json', newConfigStringfy, err => console.log(err))


  apiKey = apiKeyInput.value;
  ipAdress = apiAdress.value;
}

openSettingsModal.addEventListener('click', () => openSettings());

let openSettings = () => {

  apiKeyInput.value = apiKey;
  apiAdress.value = ipAdress;




  apiKeyModal.style.display = 'flex';
}

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
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${apiKey}&type=video&q=${keyword}`;
  DOM.tableContent.tableBody.innerHTML = "";
  try{

    fetch(url)
        .then(response => response.json())
        .then(json =>  showInfo(json))
    // showInfo(json);
  }catch(err){
    console.log(err);
  }
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
  if(items == undefined)
    return
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
  try{
    
    fetch(`https://${ipAdress}:5001/api/Videos`, {
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
        closeLoadingModal();
        downloadFile(json);
      });
  }catch(err){
    console.log(err);
  }
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



let downloadFile = (json) => {
  fetch(`https://${ipAdress}:5001/${json.videoPath}`)
    .then((response) => response.blob())
    .then(blob => {
      blobToFile(blob, json.videoPath.split("/")[1], json.id)
    }
    );
};

let blobToFile = (blob, fileName, id) => {
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

  // fetch(`https://${ipAdress}:5001/videos/${id}`, {
  //   method: "DELETE"
  // })
  // .then(response => console.log(response))
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


