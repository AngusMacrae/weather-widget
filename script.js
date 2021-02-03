const $page = document.querySelector('body');
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

function fetchWeather(targetCity) {
  const weatherURL = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=' + targetCity + '&appid=e7034c9ccb454fc5547fec12cad8b5d4';

  return fetch(weatherURL)
    .then(response => response.json())
    .catch(error => {
      console.log('Fetch error - ', error);
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
  // NOTE: some weather stations do not record wind direction
  // TODO: handle these cases better (currently displays N by default)
  windDirection = bearingToCompassPoint(weather.wind.deg);

  const userCurrentDate = new Date();
  const user_cityTimeOffset = userCurrentDate.getTimezoneOffset() * 60 + weather.timezone; // weather.timezone is offset from UTC in s
  let cityCurrentTime = unixToHumanTime(userCurrentDate.getTime() / 1000 + user_cityTimeOffset);
  let sunriseTime = unixToHumanTime(weather.sys.sunrise + user_cityTimeOffset);
  let sunsetTime = unixToHumanTime(weather.sys.sunset + user_cityTimeOffset);

  const imageURL = 'https://source.unsplash.com/1600x900/?' + city + '%20' + weatherKeyword;
  let backgroundImage = new Image();
  backgroundImage.src = imageURL;
  backgroundImage.onload = () => {
    $page.style.backgroundImage = 'url(' + backgroundImage.src + ')';
    $resultsTitle.textContent = 'Current weather in ' + city + ', ' + country;
    $weatherIcon.src = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
    $description.textContent = description.charAt(0).toUpperCase() + description.substr(1);
    $currentTime.textContent = 'The local time is ' + formatAsHrsMins(cityCurrentTime);
    $sunriseTime.textContent = formatAsHrsMins(sunriseTime);
    $sunsetTime.textContent = formatAsHrsMins(sunsetTime);
    $cloudCover.textContent = cloudCover + '% cloud cover';
    $humidity.textContent = humidity + '% humidity';
    displayTempAndWindSpeed($unitsToggle.checked);
    pageState.displayResults();
  };
}

function displayTempAndWindSpeed(useImperialUnits) {
  let tempToDisplay, tempUnit, windSpeedToDisplay, windSpeedUnit;
  if (useImperialUnits) {
    tempToDisplay = (metricTemperature * 9) / 5 + 32;
    tempUnit = '\u00B0F';
    windSpeedToDisplay = metricWindSpeed * 2.237;
    windSpeedUnit = 'mph';
  } else {
    tempToDisplay = metricTemperature;
    tempUnit = '\u00B0C';
    windSpeedToDisplay = metricWindSpeed;
    windSpeedUnit = 'm/s';
  }
  $temperature.textContent = `${tempToDisplay.toFixed(1)} ${tempUnit}`;
  $wind.textContent = `${windSpeedToDisplay.toFixed(1)} ${windSpeedUnit} ${windDirection} wind`;
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

function unixToHumanTime(unixTime) {
  return new Date(unixTime * 1000);
}

function formatAsHrsMins(inputTime) {
  return `${String(inputTime.getHours()).padStart(2, '0')}:${String(inputTime.getMinutes()).padStart(2, '0')}`;
}

$cityInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    $submitBtn.click();
  }
});

$submitBtn.addEventListener('click', function (event) {
  event.preventDefault();
  const inputCity = $cityInput.value;

  if (inputCity != '') {
    pageState.displayWorking();
    fetchWeather(inputCity).then(weatherData => displayWeather(weatherData));
  }
});

$unitsToggle.addEventListener('change', function () {
  displayTempAndWindSpeed(this.checked);
});
