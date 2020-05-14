let submitBtn = document.getElementById("submit");
let inputField = document.getElementById("input");
let locDisp = document.getElementById("location_disp");
let descDisp = document.getElementById("desc_disp");
let resCont = document.getElementById("results-container");
let iconImg = document.getElementById("icon-img");

submitBtn.addEventListener("click", function () {
    
    let city = inputField.value;
    
    if (city != "") {
        
        let weather = fetchWeather(city);
        
    }
    
});

function fetchWeather(targetCity) {
    
    let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + targetCity +'&appid=e7034c9ccb454fc5547fec12cad8b5d4';
    
    return weatherObj = fetch(url)
    .then(response => response.json())
    .then(data => displayWeather(data));
    
}

function displayWeather(weather) {
    
    // process direction into N, NW etc
    // use timezone and current time to figure out current time and display night/day
    
    let city = weather.name;
    let country = weather.sys.country;
    let long = weather.coord.lon;
    let lat = weather.coord.lat;
    let main = weather.weather[0].main;
    let desc = weather.weather[0].description;
    let icon = weather.weather[0].icon;
    let clouds = weather.clouds.all;
    let temp = weather.main.temp - 273.15;
    let tempFeels = weather.main.temp.feels_like - 273.15;
    let humidity = weather.main.humidity;
    let windSpeed = weather.wind.speed;
    let windDirection = weather.wind.deg;
    let sunriseTime = weather.sys.sunrise;
    let sunsetTime = weather.sys.sunset;
    let timezone = weather.timezone;
    
    locDisp.innerHTML = city + ", " + country;
    descDisp.innerHTML = desc;
    iconImg.src = "http://openweathermap.org/img/wn/" + icon + ".png"
    
    resCont.classList.add("visible");
    
}