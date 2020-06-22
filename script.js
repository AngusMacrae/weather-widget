const $pageTitle = document.querySelector('.page-title');
const $cityInput = document.getElementById('city-input');
const $submitBtn = document.getElementById('submit-btn');
const $workingSpinner = document.querySelector('.working-spinner');
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

let metricTemperature = 0;
let metricWindSpeed = 0;
let windDirection;

const pageState = {
  displayWorking() {
    $resultsContainer.classList.remove('visible');
    $resultsNotFound.classList.remove('visible');
    $workingSpinner.classList.add('visible');
    $submitBtn.classList.add('collapsed');
    $pageTitle.classList.remove('content-showing');
  },
  displayResults() {
    $pageTitle.classList.add('content-showing');
    $workingSpinner.classList.remove('visible');
    $submitBtn.classList.remove('collapsed');
    $cityInput.blur();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    $resultsContainer.classList.add('visible');
  },
  displayNotFound() {
    $resultsNotFound.classList.add('visible');
    $workingSpinner.classList.remove('visible');
    $submitBtn.classList.remove('collapsed');
  },
};

$cityInput.addEventListener('keyup', function (event) {
  // if Enter key is pressed
  if (event.keyCode === 13) {
    event.preventDefault();
    $submitBtn.click();
  }
});

$submitBtn.addEventListener('click', function (event) {
  event.preventDefault();
  const inputCity = $cityInput.value;

  if (inputCity != '') {
    pageState.displayWorking();
    fetchCityWeather(inputCity).then(weatherData => displayWeather(weatherData));
  }
});

$unitsToggle.addEventListener('change', function () {
  displayTempAndWindSpeed(this.checked);
});

function displayTempAndWindSpeed(useImperialUnits) {
  let displayedTemp, tempUnit, displayedWindSpeed, windSpeedUnit;
  if (useImperialUnits == false) {
    displayedTemp = metricTemperature;
    tempUnit = '\u00B0C';
    displayedWindSpeed = metricWindSpeed;
    windSpeedUnit = 'm/s';
  } else {
    displayedTemp = (metricTemperature * 9) / 5 + 32;
    tempUnit = '\u00B0F';
    displayedWindSpeed = metricWindSpeed * 2.237;
    windSpeedUnit = 'mph';
  }
  $temperature.textContent = `${displayedTemp.toFixed(1)} ${tempUnit}`;
  $wind.textContent = `${windDirection} wind @ ${displayedWindSpeed.toFixed(1)} ${windSpeedUnit}`;
}

function fetchCityWeather(targetCity) {
  const weatherURL = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=' + targetCity + '&appid=e7034c9ccb454fc5547fec12cad8b5d4';

  return fetch(weatherURL)
    .then(response => response.json())
    .catch(error => {
      console.log('Fetch error ', error);
      pageState.displayNotFound();
    });
}

function displayWeather(weather) {
  let city = weather.name;
  let country = weather.sys.country;
  let weatherKeyword = weather.weather[0].main;
  let description = weather.weather[0].description;
  let icon = weather.weather[0].icon;
  let cloudCover = weather.clouds.all;
  let humidity = weather.main.humidity;

  metricTemperature = weather.main.temp - 273.15;
  metricWindSpeed = weather.wind.speed;
  // some cities' weather stations do not seem to provide wind direction data
  windDirection = bearingToCompassPoint(weather.wind.deg);

  let timezoneOffset = weather.timezone; // offset from UTC in s

  let userTime = new Date();
  let remoteTime = toRemoteTime(userTime, timezoneOffset);
  let formattedRemoteTime = unixToHumanTime(remoteTime);

  let sunriseTime = new Date((weather.sys.sunrise + userTime.getTimezoneOffset() * 60 + timezoneOffset) * 1000);
  let formattedSunriseTime = formatHrsMins(sunriseTime);

  let sunsetTime = new Date((weather.sys.sunset + userTime.getTimezoneOffset() * 60 + timezoneOffset) * 1000);
  let formattedSunsetTime = formatHrsMins(sunsetTime);

  const imageURL = 'https://source.unsplash.com/1600x900/?' + city + '%20' + weatherKeyword;
  let backgroundImage = new Image();
  backgroundImage.src = imageURL;
  backgroundImage.onload = () => {
    $page.style.backgroundImage = 'url(' + backgroundImage.src + ')';
    $resultsTitle.textContent = 'Current weather in ' + city + ', ' + country;
    $weatherIcon.src = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
    $description.textContent = description.charAt(0).toUpperCase() + description.substr(1);
    $currentTime.textContent = 'The local time is ' + formattedRemoteTime;
    $sunriseTime.textContent = formattedSunriseTime;
    $sunsetTime.textContent = formattedSunsetTime;
    $cloudCover.textContent = cloudCover + '% cloud cover';
    $humidity.textContent = humidity + '% humidity';
    displayTempAndWindSpeed($unitsToggle.checked);
    pageState.displayResults();
  };
}

function bearingToCompassPoint(bearing) {
  switch (true) {
    case bearing >= 22.5 && bearing < 67.5:
      return 'NE';
    case bearing >= 67.5 && bearing < 112.5:
      return 'E';
    case bearing >= 112.5 && bearing < 157.5:
      return 'SE';
    case bearing >= 157.5 && bearing < 202.5:
      return 'S';
    case bearing >= 202.5 && bearing < 247.5:
      return 'SW';
    case bearing >= 247.5 && bearing < 292.5:
      return 'W';
    case bearing >= 292.5 && bearing < 337.5:
      return 'NW';
    default:
      return 'N';
  }
}

function toRemoteTime(localTime, remoteOffset) {
  return localTime.getTime() / 1000 + localTime.getTimezoneOffset() * 60 + remoteOffset;
}

function formatHrsMins(inputDate) {
  return padInitialZeros(inputDate.getHours(), 2) + ':' + padInitialZeros(inputDate.getMinutes(), 2);
}

function unixToHumanTime(unix) {
  let humanDate = new Date(unix * 1000);
  return formatHrsMins(humanDate);
}

function padInitialZeros(number, targetLength) {
  number = '' + number; // convert to string
  while (number.length < targetLength) {
    number = '0' + number;
  }

  return number;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1);
  });
}
