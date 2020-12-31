
const URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=${API_KEY}&type=video&q=minecraft`;

const searchhUrl = 'https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1';

const listPage = document.getElementById('list');
const detailsPage = document.getElementById('details');
const video = document.getElementById('vp');




const table = document.getElementById("tc");
const inputField = document.getElementById("searchInput");
const inputBtn = document.getElementById("searchBtn");
const backBtn = document.getElementById("btnVoltar");


const get = () => {
  // fetch(URL)
  //     .then(response => response.json())
  //     .then(json =>  showInfo(json))
  showInfo(json);
};

let showInfo = (json) => {
  let items = json.items;
  items.map((item, index) => {
    let tbody = document.getElementById("tc");

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

    btn.addEventListener('click',() => showDetails(item))

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

let json = {
  items: [
    {
      id: {
        videoId: "IpfE8B9H9cI",
      },
      snippet: {
        thumbnails: {
          default: {
            url:
              "https://i.ytimg.com/an_webp/IpfE8B9H9cI/mqdefault_6s.webp?du=3000&sqp=CKCos_8F&rs=AOn4CLCfttf76i_ixc1TOjDuWisYgtRYnA",
          },
        },
        title: "Big Data // Dicionário do Programador",
        channelTitle: "Código Fonte TV",
      },
    },
    {
      id: {
        videoId: 't4lrpXiN41I',
      },
      snippet: {
        thumbnails: {
          default: {
            url:
              "https://i.ytimg.com/an_webp/t4lrpXiN41I/mqdefault_6s.webp?du=3000&sqp=CKzosv8F&rs=AOn4CLCP3nD7U0T9yNLgbvND6JIfGZAoMQ",
          },
        },
        title: "Noriega, o presidente traficante",
        channelTitle: "Nerdologia",
      },
    },
    {
      id: {
        videoId: 'lOVeFSwPagY',
      },
      snippet: {
        thumbnails: {
          default: {
            url:
              "https://i.ytimg.com/an_webp/lOVeFSwPagY/mqdefault_6s.webp?du=3000&sqp=CJqJs_8F&rs=AOn4CLD2Ib4Qep4184BeWOnhKrpbn8JiLg",
          },
        },
        title: "O que aconteceria se você tocasse em uranio?",
        channelTitle: "Ciência todo dia",
      },
    },
    {
      id: {
        videoId: 'jIcFFPOzCuw',
      },
      snippet: {
        thumbnails: {
          default: {
            url:
              "https://i.ytimg.com/an_webp/jIcFFPOzCuw/mqdefault_6s.webp?du=3000&sqp=CIyvs_8F&rs=AOn4CLAy_9D_csm8kFtVExhEFu7xq1MVmw",
          },
        },
        title: 'QUANTO você PAGA de ENERGIA na carga do CELULAR? Nós testamos!',
        channelTitle: "Manual do Mundo",
      },
    },
    {
      id: {
        videoId: 'aIvljqOaQJ0',
      },
      snippet: {
        thumbnails: {
          default: {
            url:
              "https://i.ytimg.com/an_webp/aIvljqOaQJ0/mqdefault_6s_480x270.webp?du=3000&sqp=CKids_8F&rs=AOn4CLAw9w18cKRkzsNi8TJyiLYvvhrGFw",
          },
        },
        title: "Beta vs Luck - BattleBots",
        channelTitle: "ABC",
      },
    },
  ],
};


let showDetails = (info) => {

    video.src = setUrl(info.id.videoId);

    listPage.style.display = 'none';
    detailsPage.style.display = 'block';
    


}

let backToList = () =>{
  detailsPage.style.display = 'none';
  listPage.style.display = 'block';
  video.src = '';
}

backBtn.addEventListener('click', backToList)

let setUrl = (id) =>{
    let searchhUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
    return searchhUrl;
}


get();
