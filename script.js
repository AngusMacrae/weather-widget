let title = document.querySelector("h1");
let submitBtn = document.getElementById("submit");
let inputField = document.getElementById("input");
let headingDisp = document.getElementById("heading_disp");
let iconImg = document.getElementById("icon-img");
let descDisp = document.getElementById("desc_disp");
let currentTimeDisp = document.getElementById("currentTime_disp");
let cloudsDisp = document.getElementById("clouds_disp");
let tempDisp = document.getElementById("temp_disp");
let humidityDisp = document.getElementById("humidity_disp");
let windDisp = document.getElementById("wind_disp");
let sunriseTimeDisp = document.getElementById("sunrise_disp");
let sunsetTimeDisp = document.getElementById("sunset_disp");
let resCont = document.getElementById("display-box");
let body = document.querySelector("body");
let spinner = document.querySelector(".spinner");
let alertBox = document.getElementById("alert-box");
let miToggle = document.getElementById("mi-toggle");

let units = 0;
let temp = 0;
let windSpeed = 0;
let windDirection = 0;

inputField.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        submitBtn.click();
    }
});

submitBtn.addEventListener("click", function () {

    let city = inputField.value;

    if (city != "") {

        resCont.classList.remove("visible");
        alertBox.classList.remove("visible");
        spinner.classList.add("visible");
        submitBtn.classList.add("collapsed");
        title.classList.remove("showing");
        fetchWeather(city);

    }

});

miToggle.addEventListener("change", function () {

    if (this.checked) {
        units = 1;
    } else {
        units = 0;
    }

    updateResultsUnits();

});

function updateResultsUnits() {

    if (units == 1) {

        tempDisp.innerHTML = (Math.round(((temp * 9 / 5) + 32) * 10)) / 10 + " &deg;F";
        windDisp.innerHTML = windDirection + " wind @ " + (Math.round((windSpeed * 2.237) * 10)) / 10 + " mph";        

    } else {

        tempDisp.innerHTML = (Math.round(temp * 10)) / 10 + " &deg;C";
        windDisp.innerHTML = windDirection + " wind @ " + windSpeed + " m/s";

    }

}

function fetchWeather(targetCity) {

    let url = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=' + targetCity + '&appid=e7034c9ccb454fc5547fec12cad8b5d4';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            console.log(data);
        })
        .catch(error => {
            console.log("Fetch error ", error);
            alertBox.classList.add("visible");
            spinner.classList.remove("visible");
            submitBtn.classList.remove("collapsed");
        });

}

function displayWeather(weather) {

    let city = weather.name;
    let country = weather.sys.country;
    let main = weather.weather[0].main;
    let desc = weather.weather[0].description;
    let icon = weather.weather[0].icon;
    let clouds = weather.clouds.all;
    temp = weather.main.temp - 273.15;
    tempFeels = weather.main.temp.feels_like - 273.15;
    let humidity = weather.main.humidity;
    windSpeed = weather.wind.speed;
    windDirection = weather.wind.deg;

    let timezoneOffset = weather.timezone; // offset s from UTC

    let userTime = new Date();
    let remoteTime = toRemoteTime(userTime, timezoneOffset);
    let formattedRemoteTime = unixToHumanTime(remoteTime);

    let sunriseTime = new Date((weather.sys.sunrise + userTime.getTimezoneOffset() * 60 + timezoneOffset) * 1000);
    let formattedSunriseTime = formatHrsMins(sunriseTime);

    let sunsetTime = new Date((weather.sys.sunset + userTime.getTimezoneOffset() * 60 + timezoneOffset) * 1000);
    let formattedSunsetTime = formatHrsMins(sunsetTime);

    //    let long = weather.coord.lon;
    //    let lat = weather.coord.lat;

    switch (true) {

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

    function showResults() {
        title.classList.add("showing");
        spinner.classList.remove("visible");
        submitBtn.classList.remove("collapsed");

        body.style.backgroundImage = "url(" + bgImg.src + ")";
        headingDisp.innerHTML = "Current weather in " + city + ", " + country;
        iconImg.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        descDisp.innerHTML = desc.charAt(0).toUpperCase() + desc.substr(1);
        cloudsDisp.innerHTML = clouds + "% cloud cover";
        tempDisp.innerHTML = (Math.round(temp * 10)) / 10 + " &deg;C";
        humidityDisp.innerHTML = humidity + "% humidity";
        windDisp.innerHTML = windDirection + " wind @ " + windSpeed + " m/s";
        currentTimeDisp.innerHTML = "The local time is " + formattedRemoteTime;
        sunriseTimeDisp.innerHTML = formattedSunriseTime;
        sunsetTimeDisp.innerHTML = formattedSunsetTime;

        if (units == 1) {
            updateResultsUnits();
        }

        resCont.classList.add("visible");
    }

}

function toRemoteTime(localTime, remoteOffset) {

    return localTime.getTime() / 1000 + localTime.getTimezoneOffset() * 60 + remoteOffset;

}

function formatHrsMins(inputDate) {

    return pad(inputDate.getHours(), 2) + ":" + pad(inputDate.getMinutes(), 2);

}

function unixToHumanTime(unix) {

    let humanDate = new Date(unix * 1000);
    return formatHrsMins(humanDate);

}

function pad(number, length) {

    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}
