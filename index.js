const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

function C_F(celsius) {
    F = 1;
    F = (celsius * 9/5) + 32;
    return F;
  }
  
search.addEventListener('click', () => {

    const APIKey = '38a2892af44caef061d6b52965585b1c';
    const city = document.querySelector('.search-box input').value.toUpperCase();

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const wind_direction = document.querySelector('.weather-details .wind_dir span');
            const wind = document.querySelector('.weather-details .wind span');
            const k = ' ';

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span> <h9 style="color:white">_</h9>/ ${C_F(parseInt(json.main.temp))}<span>°F</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            wind_direction.innerHTML = `${json.wind.deg}°`;
            wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '400px';


        });


});
