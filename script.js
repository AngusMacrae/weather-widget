const title = document.querySelector('.page-title');
const cityInputBox = document.getElementById('city-input');
const submitBtn = document.getElementById('submit-btn');
const spinner = document.querySelector('.loading-spinner');
const resultsNotFound = document.getElementById('results-not-found');
const resultsContainer = document.getElementById('results-container');
const headingDisp = document.querySelector('.results-title');
const weatherIcon = document.getElementById('icon-main');
const descDisp = document.getElementById('description');
const currentTimeDisp = document.getElementById('current-time');
const sunriseTimeDisp = document.getElementById('sunrise-time');
const sunsetTimeDisp = document.getElementById('sunset-time');
const tempDisp = document.getElementById('temperature');
const cloudsDisp = document.getElementById('cloud-cover');
const humidityDisp = document.getElementById('humidity');
const windDisp = document.getElementById('wind');
const page = document.querySelector('body');
const unitsToggle = document.getElementById('units-toggle');

let temp = 0;
let windSpeed = 0;
let windDirection = 0;
let units = 0;

cityInputBox.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    submitBtn.click();
  }
});

submitBtn.addEventListener('click', function (e) {
  e.preventDefault();
  let city = cityInputBox.value;

  if (city != '') {
    resultsContainer.classList.remove('visible');
    resultsNotFound.classList.remove('visible');
    spinner.classList.add('visible');
    submitBtn.classList.add('collapsed');
    title.classList.remove('content-showing');
    fetchWeather(city);
  }
});

unitsToggle.addEventListener('change', function () {
  if (this.checked) {
    units = 1;
  } else {
    units = 0;
  }

  updateResultsUnits();
});

function updateResultsUnits() {
  if (units == 1) {
    tempDisp.innerHTML = Math.round(((temp * 9) / 5 + 32) * 10) / 10 + ' &deg;F';
    windDisp.innerHTML = windDirection + ' wind @ ' + Math.round(windSpeed * 2.237 * 10) / 10 + ' mph';
  } else {
    tempDisp.innerHTML = Math.round(temp * 10) / 10 + ' &deg;C';
    windDisp.innerHTML = windDirection + ' wind @ ' + windSpeed + ' m/s';
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
      console.log('Fetch error ', error);
      resultsNotFound.classList.add('visible');
      spinner.classList.remove('visible');
      submitBtn.classList.remove('collapsed');
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
  //   let tempFeels = weather.main.temp.feels_like - 273.15;
  let humidity = weather.main.humidity;
  windSpeed = weather.wind.speed;
  windDirection = weather.wind.deg;
  //    let long = weather.coord.lon;
  //    let lat = weather.coord.lat;

  let timezoneOffset = weather.timezone; // offset s from UTC

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

  let url = 'https://source.unsplash.com/1600x900/?' + city + '%20' + main;
  let bgImg = new Image();
  bgImg.src = url;
  bgImg.onload = function () {
    title.classList.add('content-showing');
    spinner.classList.remove('visible');
    submitBtn.classList.remove('collapsed');

    page.style.backgroundImage = 'url(' + bgImg.src + ')';
    headingDisp.innerHTML = 'Current weather in ' + city + ', ' + country;
    weatherIcon.src = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
    descDisp.innerHTML = desc.charAt(0).toUpperCase() + desc.substr(1);
    cloudsDisp.innerHTML = clouds + '% cloud cover';
    tempDisp.innerHTML = Math.round(temp * 10) / 10 + ' &deg;C';
    humidityDisp.innerHTML = humidity + '% humidity';
    windDisp.innerHTML = windDirection + ' wind @ ' + windSpeed + ' m/s';
    currentTimeDisp.innerHTML = 'The local time is ' + formattedRemoteTime;
    sunriseTimeDisp.innerHTML = formattedSunriseTime;
    sunsetTimeDisp.innerHTML = formattedSunsetTime;

    if (units == 1) {
      updateResultsUnits();
    }

    cityInputBox.blur();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    resultsContainer.classList.add('visible');
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
