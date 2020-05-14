let title = document.querySelector("h1");
let submitBtn = document.getElementById("submit");
let inputField = document.getElementById("input");
let headingDisp = document.getElementById("heading_disp");
let iconImg = document.getElementById("icon-img");
let descDisp = document.getElementById("desc_disp");
let currentTimeDisp = document.getElementById("currentTime_disp");
let cloudsDisp = document.getElementById("clouds_disp");
let tempDisp = document.getElementById("temp_disp");
let tempFeelsDisp = document.getElementById("tempFeels_disp");
let humidityDisp = document.getElementById("humidity_disp");
let windDisp = document.getElementById("wind_disp");
let sunriseTimeDisp = document.getElementById("sunrise_disp");
let sunsetTimeDisp = document.getElementById("sunset_disp");
let resCont = document.getElementById("display-box");
let settingsBtn = document.getElementById("settings-icon");
let settings = document.getElementById("settings");
let body = document.querySelector("body");
let spinner = document.querySelector(".spinner");

inputField.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    submitBtn.click();
  }
});

submitBtn.addEventListener("click", function () {

    let city = inputField.value;

    if (city != "") {
        
        resCont.classList.remove("visible");
        spinner.classList.add("visible");
        title.classList.remove("showing");
        fetchWeather(city);

    }

});

settingsBtn.addEventListener("click", function () {

//    settings.classList.remove("collapsed");

});

function fetchWeather(targetCity) {

    let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + targetCity + '&appid=e7034c9ccb454fc5547fec12cad8b5d4';

    fetch(url)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.log("Fetch error ", error));

}

function displayWeather(weather) {

    // process direction into N, NW etc
    // use timezone and current time to figure out current time and display night/day

    let city = weather.name;
    let country = weather.sys.country;
    let main = weather.weather[0].main;
    let desc = weather.weather[0].description;
    let icon = weather.weather[0].icon;
    let clouds = weather.clouds.all;
    let temp = weather.main.temp - 273.15;
    let tempFeels = weather.main.temp.feels_like - 273.15;
    let humidity = weather.main.humidity;
    let windSpeed = weather.wind.speed;
    let windDirection = weather.wind.deg;
    
    let timezone = weather.timezone;
    let sunriseTime = unixToHumanTime(weather.sys.sunrise - timezone);
    let sunsetTime = unixToHumanTime(weather.sys.sunset - timezone);

    let currentTime = new Date();
    currentTime = unixToHumanTime(currentTime.getTime() - timezone);
    
    let long = weather.coord.lon;
    let lat = weather.coord.lat;
    
    switch(true) {
            
        case windDirection >= 22.5 || windDirection < 67.5:
            windDirection = "NE";
            break;
        case windDirection >= 67.5 || windDirection < 112.5:
            windDirection = "E";
            break;
        case windDirection >= 112.5 || windDirection < 157.5:
            windDirection = "SE";
            break;
        case windDirection >= 157.5 || windDirection < 202.5:
            windDirection = "S";
            break;
        case windDirection >= 202.5 || windDirection < 247.5:
            windDirection = "SW";
            break;
        case windDirection >= 247.5 || windDirection < 292.5:
            windDirection = "W";
            break;
        case windDirection >= 292.5 || windDirection < 337.5:
            windDirection = "NW";
            break;
        default:
            windDirection = "N";
        
    }

    let searchString = city + "%20" + main;
    let url = "https://source.unsplash.com/1600x900/?" + searchString;
    let bgImg = new Image();
    bgImg.onload = showResults;
    bgImg.src = url;
    
    function showResults () {
        title.classList.add("showing");
        spinner.classList.remove("visible");
        
        body.style.backgroundImage = "url(" + bgImg.src + ")";
        headingDisp.innerHTML = "Current weather in " + city + ", " + country;
        iconImg.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
//        mainDisp.innerHTML = main;
        descDisp.innerHTML = desc.charAt(0).toUpperCase() + desc.substr(1);
        cloudsDisp.innerHTML = clouds + "% cloud cover";
        tempDisp.innerHTML = (Math.round(temp*10))/10 + " &deg;C";
//        tempFeelsDisp.innerHTML = "Feels like " +(Math.round(tempFeels*10))/10 + "C";
        humidityDisp.innerHTML = humidity + "% humidity";
        windDisp.innerHTML = windDirection + " wind @ " + windSpeed + " m/s ";
//        windDirectionDisp.innerHTML = windDirection;
        currentTimeDisp.innerHTML = "Local time is " + currentTime;
        sunriseTimeDisp.innerHTML = sunriseTime;
        sunsetTimeDisp.innerHTML = sunsetTime;
        
        resCont.classList.add("visible");
    }

}

function unixToHumanTime(unix) {
    
    let humanDate = new Date(unix * 1000);
    let humanTime = pad(humanDate.getHours(), 2) + ":" + pad(humanDate.getMinutes(), 2);
    return humanTime;
    
}

function pad(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;

}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}
