const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails1 = document.querySelector('.weather-details1');
const weatherDetails2 = document.querySelector('.weather-details2');
const error404 = document.querySelector('.not-found');
const re = document.getElementById('re');
const refresh = document.getElementById('refresh');
var other;
var wispbox = document.getElementById('wind_speed').checked;
var visibox = document.getElementById('visi').checked;
var widibox= document.getElementById('wind_direction').checked;
var preboxx = document.getElementById('pre').checked;

function C_F(celsius) {
    F = 1;
    F = (celsius * 9/5) + 32;
    return F;
  }

refresh.addEventListener('click', () => {
    if(!(re)){
        re.innerHTML = `<p id="del"><br></p>
        <div class="other-info">
         <p>Other weather details:</p>
        </div>
       <p id="del"><br> </p>
        <div class="other-info">
          <form>
            <input type="checkbox" id="wind_speed" value="Wind Speed">
            <label for="wind_speed"> Wind Speed </label>
            <input type="checkbox" id="visi" value="Visibilty">
            <label for="visi"> Visibilty </label>
            <input type="checkbox" id="wind_direction" value="Wind Direction">
            <label for="wind_direction"> Wind Direction </label>
            <input type="checkbox" id="pre" value="Pressure">
            <label for="pre"> Pressure </label>
          </form>
        </div>`;
    }
    other = document.getElementById('del')
    other.style.display = '';
    other = document.querySelector('.other-info');
    other.style.display = '';
    other = document.querySelector('.other-info1');
    other.style.display = '';

            container.style.height = '220px';
            weatherBox.style.display = 'none';
            weatherDetails1.style.display = 'none';
            weatherDetails2.style.display = 'none';
            container.style.display = 'block';

            container.classList.add('fadeIn');
         

    
  }); 

search.addEventListener('click', () => {
    
    const APIKey = '38a2892af44caef061d6b52965585b1c';
    const city = document.querySelector('.search-box input').value.toUpperCase();
    const wispbox = document.getElementById('wind_speed').checked;
    const visibox = document.getElementById('visi').checked;
    const widibox= document.getElementById('wind_direction').checked;
    const preboxx = document.getElementById('pre').checked;
    var del = document.querySelector('.other-info');
    var dele = document.getElementById('del');

   
    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails1.style.display = 'none';
                weatherDetails2.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const wind_direction = document.querySelector('.weather-details2 .wind_dir span');
            const wind = document.querySelector('.weather-details1 .wind span');
            const visi = document.querySelector('.weather-details1 .vis span');
            const pres = document.querySelector('.weather-details2 .Pres span');
  

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span> <h9 style="color:white">_</h9>/ ${C_F(parseInt(json.main.temp))}<span>°F</span>`;
            description.innerHTML = `${json.weather[0].description}`;

            if(widibox){
                wind_direction.innerHTML = `${json.wind.deg}°`;
            }
            else{
                wind_direction.innerHTML = `-`;
            }

            if(wispbox){
                wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;
            }
            else{
                wind.innerHTML = `-`;
            }

            if(visibox){
                visi.innerHTML = `${parseInt(json.visibility)} Km`;
            }
            else{
                visi.innerHTML = `-`;
            }

            if(preboxx){
                pres.innerHTML = `${parseInt(json.main.pressure)} hPa`;
            }
            else{
                pres.innerHTML = `-`;
            }

            weatherBox.style.display = '';
            other = document.getElementById('del');
            other.style.display = 'none';
            other = document.querySelector('.other-info');
            other.style.display = 'none';
            other = document.querySelector('.other-info1');
            other.style.display = 'none';
            weatherDetails1.style.display = '';
            weatherDetails2.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails1.classList.add('fadeIn');
            weatherDetails2.classList.add('fadeIn');
            container.style.height = '460px';


        });


});
