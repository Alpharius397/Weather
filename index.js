const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails1 = document.querySelector('.weather-details1');
const weatherDetails2 = document.querySelector('.weather-details2');
const error404 = document.querySelector('.not-found');
const re = document.getElementById('re');
const refresh = document.getElementById('refresh');
const left = document.getElementById('left');
const right = document.getElementById('right');
var other,k;
var flag = true,lat,lon,prev,next;
var day = 0; /** Data is segmented for each day in 3 hours segment(0,3,6,9,12,15,18,21). Max valuable day =  */


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

function date(da){
    var dd = da.slice(8,10);
    var mm = da.slice(5,7);
    var yyyy = da.slice(0,4);

    return dd+"/"+mm+"/"+yyyy;
}

function Day(da){
    var k = da.slice(0,2);
     return parseInt(k);
}

left.addEventListener('click', () => {
    const APIKey = '38a2892af44caef061d6b52965585b1c';
    const city = document.querySelector('.search-box input').value.toUpperCase();
    const wispbox = document.getElementById('wind_speed').checked;
    const visibox = document.getElementById('visi').checked;
    const widibox= document.getElementById('wind_direction').checked;
    const preboxx = document.getElementById('pre').checked;

        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if(json.cod === '404'){
          
            }

            lat = json[0].lat;
            lon = json[0].lon;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
        .then(response => response.json())
        .then(json => {
     
    
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails1.style.display = 'none';
                weatherDetails2.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                other = document.getElementById('del');
                other.style.display = 'none';
                other = document.getElementById('del');
                other.style.display = 'none';
                other = document.querySelector('.other-info');
                other.style.display = 'none';
                other = document.querySelector('.other-info1');
                other.style.display = 'none';
                return;
            }

            if(day>0){    
                right.disabled = false;
                right.style.color = 'grey';
                prev = Day(date(json.list[day].dt_txt));
                next = Day(date(json.list[day].dt_txt));
                
                k=0;
                while(prev==next && day>0){
                    prev = Day(date(json.list[day].dt_txt));
                    next = Day(date(json.list[day-1].dt_txt));
                    day=day-1;
                }

                k = day;
                prev = Day(date(json.list[k].dt_txt));
                next = Day(date(json.list[k-1].dt_txt));

                while(prev==next && k>0){
                    prev = Day(date(json.list[k].dt_txt));
                    next = Day(date(json.list[k-1].dt_txt));
                    k=k-1;
                }

                if(k==0){
                    day = k;
                }

                if(day==0){
                    left.disabled = true;
                    left.style.color = 'white';
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
  

            temperature.innerHTML = `${parseInt(json.list[day].main.temp)}<span>°C</span> <h9 style="color:white">_</h9>/ ${C_F(parseInt(json.list[day].main.temp))}<span>°F</span>`;
            description.innerHTML = `${json.list[day].weather[0].description}`;
            ddmmyy.innerHTML = `${date(json.list[day].dt_txt)}`;

        try{
            if(widibox){
                wind_direction.innerHTML = `${json.list[day].wind.deg}°`;
            }
            else{
                wind_direction.innerHTML = `-`;
            }
        }

        catch(TypeError){

        }

        try{
            if(wispbox){
                wind.innerHTML = `${parseInt(json.list[day].wind.speed)} Km/h`;
            }
            else{
                wind.innerHTML = `-`;
            }
        }

        catch(TypeError){

        }

        try{
            if(visibox){
                visi.innerHTML = `${parseInt(json.list[day].visibility)} Km`;
            }
            else{
                visi.innerHTML = `-`;
            }
        }
        catch(TypeError){

        }

        try{
            if(preboxx){
                pres.innerHTML = `${parseInt(json.list[day].main.pressure)} hPa`;
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

        }; });


});
});

right.addEventListener('click', () => {
        const APIKey = '38a2892af44caef061d6b52965585b1c';
        const city = document.querySelector('.search-box input').value.toUpperCase();
        const wispbox = document.getElementById('wind_speed').checked;
        const visibox = document.getElementById('visi').checked;
        const widibox= document.getElementById('wind_direction').checked;
        const preboxx = document.getElementById('pre').checked;
        
    
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`)
            .then(response => response.json())
            .then(json => {
                if(json.cod === '404'){
               
                }
    
                lat = json[0].lat;
                lon = json[0].lon;
    
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
            .then(response => response.json())
            .then(json => {
         
                
                if (json.cod === '404') {
                    container.style.height = '400px';
                    weatherBox.style.display = 'none';
                    weatherDetails1.style.display = 'none';
                    weatherDetails2.style.display = 'none';
                    error404.style.display = 'block';
                    error404.classList.add('fadeIn');
                    other = document.getElementById('del');
                    other.style.display = 'none';
                    other = document.getElementById('del');
                    other.style.display = 'none';
                    other = document.querySelector('.other-info');
                    other.style.display = 'none';
                    other = document.querySelector('.other-info1');
                    other.style.display = 'none';
                    return;
                }

            if(day<39){    
                left.disabled = false;
                left.style.color = 'grey';
                prev = Day(date(json.list[day].dt_txt));
                next = Day(date(json.list[day].dt_txt));
           
                while(prev==next && day<39){
                    prev = Day(date(json.list[day].dt_txt));
                    next = Day(date(json.list[day+1].dt_txt));
                    day+=1;
                }
            }
            k = day;
            prev = Day(date(json.list[k].dt_txt));
            next = Day(date(json.list[k+1].dt_txt));

            while(prev==next && k<39){
                prev = Day(date(json.list[k].dt_txt));
                next = Day(date(json.list[k+1].dt_txt));
                k=k+1;
            }

            if(k==39){
                day = k;
            }

            if(day==39){
                right.disabled = true;
                right.style.color = 'white';
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
      
    
                temperature.innerHTML = `${parseInt(json.list[day].main.temp)}<span>°C</span> <h9 style="color:white">_</h9>/ ${C_F(parseInt(json.list[day].main.temp))}<span>°F</span>`;
                description.innerHTML = `${json.list[day].weather[0].description}`;
                ddmmyy.innerHTML = `${date(json.list[day].dt_txt)}`;
    
            try{
                if(widibox){
                    wind_direction.innerHTML = `${json.list[day].wind.deg}°`;
                }
                else{
                    wind_direction.innerHTML = `-`;
                }
            }
    
            catch(TypeError){
    
            }
    
            try{
                if(wispbox){
                    wind.innerHTML = `${parseInt(json.list[day].wind.speed)} Km/h`;
                }
                else{
                    wind.innerHTML = `-`;
                }
            }
    
            catch(TypeError){
    
            }
    
            try{
                if(visibox){
                    visi.innerHTML = `${parseInt(json.list[day].visibility)} Km`;
                }
                else{
                    visi.innerHTML = `-`;
                }
            }
            catch(TypeError){
    
            }
    
            try{
                if(preboxx){
                    pres.innerHTML = `${parseInt(json.list[day].main.pressure)} hPa`;
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
    

    
    
            }); });
        
    
    });



refresh.addEventListener('click', () => {

    day = 0;
        left.style.color = 'grey';
        left.disabled = false;

        right.style.color = 'grey';
        right.disabled = false;

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

    if(day==0){
        left.style.color = 'white';
        left.disabled = true;
    }

    if(day==39){
        right.style.color = 'white';
        right.disabled = true;
    }
    
    const APIKey = '38a2892af44caef061d6b52965585b1c';
    const city = document.querySelector('.search-box input').value.toUpperCase();
    const wispbox = document.getElementById('wind_speed').checked;
    const visibox = document.getElementById('visi').checked;
    const widibox= document.getElementById('wind_direction').checked;
    const preboxx = document.getElementById('pre').checked;
    var del = document.querySelector('.other-info');
    var dele = document.getElementById('del');
    var ddmmyy = document.getElementById('ddmmyy');
    var count = 0;
    var div_create
    var Cnt = detCnt(visibox) + detCnt(widibox) + detCnt(wispbox) + detCnt(preboxx);
    var list = [wispbox,visibox,widibox,preboxx];
    weatherDetails1.innerHTML = ``;
    weatherDetails2.innerHTML = ``;

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

        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if(json.cod === '404'){
                flag = true;
            }

            lat = json[0].lat;
            lon = json[0].lon;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
        .then(response => response.json())
        .then(json => {

            
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails1.style.display = 'none';
                weatherDetails2.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                other = document.getElementById('del');
                other.style.display = 'none';
                other = document.getElementById('del');
                other.style.display = 'none';
                other = document.querySelector('.other-info');
                other.style.display = 'none';
                other = document.querySelector('.other-info1');
                other.style.display = 'none';
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
  

            temperature.innerHTML = `${parseInt(json.list[day].main.temp)}<span>°C</span> <h9 style="color:white">_</h9>/ ${C_F(parseInt(json.list[day].main.temp))}<span>°F</span>`;
            description.innerHTML = `${json.list[day].weather[0].description}`;
            ddmmyy.innerHTML = `${date(json.list[day].dt_txt)}`;

        try{
            if(widibox){
                wind_direction.innerHTML = `${json.list[day].wind.deg}°`;
            }
            else{
                wind_direction.innerHTML = `-`;
            }
        }

        catch(TypeError){

        }

        try{
            if(wispbox){
                wind.innerHTML = `${parseInt(json.list[day].wind.speed)} Km/h`;
            }
            else{
                wind.innerHTML = `-`;
            }
        }

        catch(TypeError){

        }

        try{
            if(visibox){
                visi.innerHTML = `${parseInt(json.list[day].visibility)} Km`;
            }
            else{
                visi.innerHTML = `-`;
            }
        }
        catch(TypeError){

        }

        try{
            if(preboxx){
                pres.innerHTML = `${parseInt(json.list[day].main.pressure)} hPa`;
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

            console.log(day);


        }); 
    });
});




