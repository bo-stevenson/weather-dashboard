function startPage() {
    let inputEl = document.getElementById("city-input");
    let searchEl = document.getElementById("search-button");
    let clearEl = document.getElementById("clear-history");
    let nameEl = document.getElementById("city-name");
    let currentPicEl = document.getElementById("current-pic");
    let currentTempEl = document.getElementById("temp");
    let currentHumidityEl = document.getElementById("humidity");4
    let currentWindEl = document.getElementById("wind");
    let currentUVEl = document.getElementById("UV-index");
    let historyEl = document.getElementById("history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);
    

    let APIKey = "436429f5379fb07b83cab3d5aaa49133";

}
startPage();