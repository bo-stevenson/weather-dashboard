
let city="";
let searchCity = $("#search-city")
let currentCity = $("#current-city");
let currentTemperature = $("#temp");
let currentHumidty= $("#humidity");
let currentWind=$("#wind");
let currentUvindex= $("#uv-index");
let sCity=[];

//see if previously searched city is in storage
function find(previousCity){
    for (let i=0; i<sCity.length; i++){
        if(previousCity.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
//Set up the API key
let APIKey="436429f5379fb07b83cab3d5aaa49133";
// Display the current weather in box 
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}

function currentWeather(city){
    // Url to get data from api
    let queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey + "&units=imperial";
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
        console.log(response);
        //icon from api
        let weathericon= response.weather[0].icon;
        let iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        // date is taken from  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        let date=new Date(response.dt*1000).toLocaleDateString();
        //show city name, date, and icon 
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");
        
        //temp
        $(currentTemperature).html(response.main.temp +"&#8457");
        // humidity
        $(currentHumidty).html(response.main.humidity+"%");
        //wind
        $(currentWind).html(response.wind.speed+"MPH");
    
        
        //find UV Index by location
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}
    // This function returns the UVIindex response and shows a different badge based on the result 
    function UVIndex(ln,lt){
    
        let uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
        $.ajax({
                url:uvqURL,
                method:"GET"
                }).then(function(response){
                    $(currentUvindex).html(response.value);
                    if (response.value < 3 ){
                        $(currentUvindex).addClass("badge-success")
    
                    }
                    if (response.value >= 5 ){
                        $(currentUvindex).addClass("badge-warning")
    
                    }
    
                    if (response.value > 7 ){
                        $(currentUvindex).addClass("badge-danger")
    
                    }
                });
    }
    
// 5 day forecast for city searched
function forecast(cityid){
    let queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+ APIKey + "&units=imperial" ;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        //for loop setting up the 5 days
        for (i=0;i<5;i++){
            let date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            let iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            let iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            $("#Date"+i).html(date);
            $("#Img"+i).html("<img src="+iconurl+">");
            $("#Temp"+i).html(response.list[((i+1)*8)-1].main.temp +"&#8457");
            $("#Humidity"+i).html(response.list[((i+1)*8)-1].main.humidity + "%");
        }
        
    });
}

//add city to search history list
function addToList(previousCity){
    let listEl= $("<li>"+previousCity.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",previousCity.toUpperCase());
    $(".list-group").append(listEl);
}
// display the past search again when clicked in history list
function pastSearch(event){
    let liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}

//load previous city searched
function loadlastCity(){
    $("ul").empty();
    let sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}
//Clear the search history
function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}
//On clicks
$("#search-button").on("click",displayWeather);
$(document).on("click",pastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);





























