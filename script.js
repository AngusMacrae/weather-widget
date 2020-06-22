const $pageTitle = document.querySelector('.page-title');
const $cityInput = document.getElementById('city-input');
const $submitBtn = document.getElementById('submit-btn');
const $loadingSpinner = document.querySelector('.loading-spinner');
const $resultsNotFound = document.getElementById('results-not-found');
const $resultsContainer = document.getElementById('results-container');
const $resultsTitle = document.querySelector('.results-title');
const $weatherIcon = document.getElementById('icon-main');
const $description = document.getElementById('description');
const $currentTime = document.getElementById('current-time');
const $sunriseTime = document.getElementById('sunrise-time');
const $sunsetTime = document.getElementById('sunset-time');
const $temperature = document.getElementById('temperature');
const $cloudCover = document.getElementById('cloud-cover');
const $humidity = document.getElementById('humidity');
const $wind = document.getElementById('wind');
const $page = document.querySelector('body');
const $unitsToggle = document.getElementById('units-toggle');

let temperature = 0;
let windSpeed = 0;
let windDirection = 0;
let useImperialUnits = false;

$cityInput.addEventListener('keyup', function (event) {
  // if Enter key is pressed
  if (event.keyCode === 13) {
    event.preventDefault();
    $submitBtn.click();
  }
});

$submitBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const inputCity = $cityInput.value;

  if (inputCity != '') {
    $resultsContainer.classList.remove('visible');
    $resultsNotFound.classList.remove('visible');
    $loadingSpinner.classList.add('visible');
    $submitBtn.classList.add('collapsed');
    $pageTitle.classList.remove('content-showing');
    fetchCityWeather(inputCity);
  }
});

$unitsToggle.addEventListener('change', function () {
  if (this.checked) {
    useImperialUnits = true;
  } else {
    useImperialUnits = false;
  }

  updateResultsUnits();
});

function updateResultsUnits() {
  if (useImperialUnits == true) {
    $temperature.innerHTML = Math.round(((temperature * 9) / 5 + 32) * 10) / 10 + ' &deg;F';
    $wind.innerHTML = windDirection + ' wind @ ' + Math.round(windSpeed * 2.237 * 10) / 10 + ' mph';
  } else {
    $temperature.innerHTML = Math.round(temperature * 10) / 10 + ' &deg;C';
    $wind.innerHTML = windDirection + ' wind @ ' + windSpeed + ' m/s';
  }
}

function fetchCityWeather(targetCity) {
  const weatherURL = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=' + targetCity + '&appid=e7034c9ccb454fc5547fec12cad8b5d4';

  fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayWeather(data);
    })
    .catch(error => {
      console.log('Fetch error ', error);
      $resultsNotFound.classList.add('visible');
      $loadingSpinner.classList.remove('visible');
      $submitBtn.classList.remove('collapsed');
    });
}

function displayWeather(weather) {
  let city = weather.name;
  let country = weather.sys.country;
  let main = weather.weather[0].main;
  let desc = weather.weather[0].description;
  let icon = weather.weather[0].icon;
  let clouds = weather.clouds.all;
  temperature = weather.main.temp - 273.15;
  let humidity = weather.main.humidity;
  windSpeed = weather.wind.speed;
  windDirection = weather.wind.deg;

  let timezoneOffset = weather.timezone; // offset from UTC in s

  let userTime = new Date();
  let remoteTime = toRemoteTime(userTime, timezoneOffset);
  let formattedRemoteTime = unixToHumanTime(remoteTime);

  let sunriseTime = new Date((weather.sys.sunrise + userTime.getTimezoneOffset() * 60 + timezoneOffset) * 1000);
  let formattedSunriseTime = formatHrsMins(sunriseTime);

  let sunsetTime = new Date((weather.sys.sunset + userTime.getTimezoneOffset() * 60 + timezoneOffset) * 1000);
  let formattedSunsetTime = formatHrsMins(sunsetTime);

  // some cities' weather stations do not seem to provide wind direction data
  console.log(windDirection);

  switch (true) {
    case windDirection >= 22.5 && windDirection < 67.5:
      windDirection = 'NE';
      break;
    case windDirection >= 67.5 && windDirection < 112.5:
      windDirection = 'E';
      break;
    case windDirection >= 112.5 && windDirection < 157.5:
      windDirection = 'SE';
      break;
    case windDirection >= 157.5 && windDirection < 202.5:
      windDirection = 'S';
      break;
    case windDirection >= 202.5 && windDirection < 247.5:
      windDirection = 'SW';
      break;
    case windDirection >= 247.5 && windDirection < 292.5:
      windDirection = 'W';
      break;
    case windDirection >= 292.5 && windDirection < 337.5:
      windDirection = 'NW';
      break;
    default:
      windDirection = 'N';
  }

  const imageURL = 'https://source.unsplash.com/1600x900/?' + city + '%20' + main;
  let bgImg = new Image();
  bgImg.src = imageURL;
  bgImg.onload = function () {
    $pageTitle.classList.add('content-showing');
    $loadingSpinner.classList.remove('visible');
    $submitBtn.classList.remove('collapsed');

    $page.style.backgroundImage = 'url(' + bgImg.src + ')';
    $resultsTitle.innerHTML = 'Current weather in ' + city + ', ' + country;
    $weatherIcon.src = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
    $description.innerHTML = desc.charAt(0).toUpperCase() + desc.substr(1);
    $cloudCover.innerHTML = clouds + '% cloud cover';
    $temperature.innerHTML = Math.round(temperature * 10) / 10 + ' &deg;C';
    $humidity.innerHTML = humidity + '% humidity';
    $wind.innerHTML = windDirection + ' wind @ ' + windSpeed + ' m/s';
    $currentTime.innerHTML = 'The local time is ' + formattedRemoteTime;
    $sunriseTime.innerHTML = formattedSunriseTime;
    $sunsetTime.innerHTML = formattedSunsetTime;

    if (useImperialUnits == true) {
      updateResultsUnits();
    }

    $cityInput.blur();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    $resultsContainer.classList.add('visible');
  };
}

function toRemoteTime(localTime, remoteOffset) {
  return localTime.getTime() / 1000 + localTime.getTimezoneOffset() * 60 + remoteOffset;
}

function formatHrsMins(inputDate) {
  return pad(inputDate.getHours(), 2) + ':' + pad(inputDate.getMinutes(), 2);
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
