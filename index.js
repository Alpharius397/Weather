const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails1 = document.querySelector('.weather-details1');
const weatherDetails2 = document.querySelector('.weather-details2');
const error404 = document.querySelector('.not-found');
const re = document.getElementById('re');
const refresh = document.getElementById('refresh');
var other;


function C_F(celsius) {
    F = 1;
    F = (celsius * 9/5) + 32;
    return F;
  }

function detCnt(check){
    if (check){
        return 1;
    }
    else{
        return 0;
    }
}

function pass(div_class,count){
    if(count<=2){
        weatherDetails1.appendChild(div_class);
    }
    else{
        weatherDetails2.appendChild(div_class);
    }
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
    weatherDetails1.innerHTML = ``;
    weatherDetails2.innerHTML = ``;

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
    var count = 0;
    var div_create
    var Cnt = detCnt(visibox) + detCnt(widibox) + detCnt(wispbox) + detCnt(preboxx);
    var list = [wispbox,visibox,widibox,preboxx];

    for(i=0;i<4;i++){
        if(list[i]==true){
            switch(i){
                case 0: div_create = document.createElement("div");
                        div_create.class = "wind";
                        div_create.id = "wind";
                        div_create.innerHTML = `<i class="fa-solid fa-wind"></i>
                        <div class="text">
                            <span id = "1"></span>
                            <p>Wind Speed</p>
                        </div>`; count+=1;
                        pass(div_create,count); break;
                case 1: div_create = document.createElement("div");
                        div_create.class = "vis";
                        div_create.id = "vis";
                        div_create.innerHTML = `<i class="fa-solid fa-eye"></i>
                        <div class="text">
                            <span id = "2"></span>
                            <p>Visibilty</p>
                        </div>`; count+=1;
                        pass(div_create,count); break;

                case 2: div_create = document.createElement("div");
                        div_create.class = "wind_dir";
                        div_create.id = "wind_dir";
                        div_create.innerHTML = `<i class="fa-brands fa-nfc-directional"></i>
                        <div class="text">
                            <span id = "3"></span>
                            <p>Wind Direction</p>
                        </div>`; count+=1;
                        pass(div_create,count); break;

                case 3: div_create = document.createElement("div");
                        div_create.class = "Pres";
                        div_create.id = "Pres";
                        div_create.innerHTML = `<i class="fa-solid fa-gauge"></i>
                        <div class="text">
                          <span id = "4"></span>
                          <p>Pressure</p>
                       </div>`; count+=1;
                        pass(div_create,count); break;

                default: console.log('ll');
            }
        }
    }

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
            const wind_direction = document.getElementById("3");
            const wind = document.getElementById("1");
            const visi = document.getElementById("2");
            const pres = document.getElementById("4");
  

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span> <h9 style="color:white">_</h9>/ ${C_F(parseInt(json.main.temp))}<span>°F</span>`;
            description.innerHTML = `${json.weather[0].description}`;

        try{
            if(widibox){
                wind_direction.innerHTML = `${json.wind.deg}°`;
            }
            else{
                wind_direction.innerHTML = `-`;
            }
        }

        catch(TypeError){

        }

        try{
            if(wispbox){
                wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;
            }
            else{
                wind.innerHTML = `-`;
            }
        }

        catch(TypeError){

        }

        try{
            if(visibox){
                visi.innerHTML = `${parseInt(json.visibility)} Km`;
            }
            else{
                visi.innerHTML = `-`;
            }
        }
        catch(TypeError){

        }

        try{
            if(preboxx){
                pres.innerHTML = `${parseInt(json.main.pressure)} hPa`;
            }
            else{
                pres.innerHTML = `-`;
            }
        }

        catch(TypeError){

        }


            weatherBox.style.display = '';
            other = document.getElementById('del');
            other.style.display = 'none';
            other = document.getElementById('del');
            other.style.display = 'none';
            other = document.querySelector('.other-info');
            other.style.display = 'none';
            other = document.querySelector('.other-info1');
            other.style.display = 'none';
            weatherBox.classList.add('fadeIn');

            
            if(Cnt==0){
                weatherDetails1.style.display = 'none';
                weatherDetails2.style.display = 'none';
                weatherDetails1.classList.add('fadeIn');
                weatherDetails2.classList.add('fadeIn');
                container.style.height = '280px';
            }
            else if(Cnt==1 || Cnt==2){
                weatherDetails1.style.display = '';
                weatherDetails2.style.display = 'none';
                weatherDetails1.classList.add('fadeIn');
                weatherDetails2.classList.add('fadeIn');
                container.style.height = '360px';
            }
            else{
                weatherDetails1.style.display = '';
                weatherDetails2.style.display = '';
                weatherDetails1.classList.add('fadeIn');
                weatherDetails2.classList.add('fadeIn');

                container.style.height = '440px';
            }


        });


});
