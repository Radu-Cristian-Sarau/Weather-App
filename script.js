const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const currentWeatherItemsElement = document.getElementById('current-weather-items');
const timezoneElement = document.getElementById('time-zone');
const countryElement = document.getElementById('country');
const weatherForecastElement = document.getElementById('weather-forecast');
const currentTempElement = document.getElementById('current-temp');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
import { token } from './config.json';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HourFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeElement.innerHTML = (hoursIn12HourFormat < 10 ? '0' + hoursIn12HourFormat : hoursIn12HourFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;

    dateElement.innerHTML = days[day] + ', ' + date + ' ' + months[month];

}, 1000);

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let {latitude, longitude} = success.coords;
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${token}`).then(res => res.json()).then(data => {
            showWeatherData(data);
        });
    });
}

function showWeatherData(data) {
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    
    timezoneElement.innerHTML = data.timezone;
    countryElement.innerHTML = data.lat + 'N ' + data.lon + 'E';

    currentWeatherItemsElement.innerHTML =
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>
    `;

    let otherDayForcast = '';
    data.daily.forEach((day, index) => {
        if (index == 0) {
            currentTempElement.innerHTML = `
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="Weather Icon" class="w-icon">
                <div class="others">
                    <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                    <div class="temp">Night - ${day.temp.night}&#176; C</div>
                    <div class="temp">Day - ${day.temp.day}&#176; C</div>
                </div>
            `
        } else {
            otherDayForcast += `
                <div class="weather-forecast" id="weather-forecast">
                    <div class="weather-forecast-item">
                        <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon" class="w-icon">
                        <div class="temp">Night - ${day.temp.night}&#176; C</div>
                        <div class="temp">Day - ${day.temp.day}&#176; C</div>
                    </div>
                </div>
            `
        }
    });

    weatherForecastElement.innerHTML = otherDayForcast;
}