const APIKey = '38a2892af44caef061d6b52965585b1c';
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
const visual = document.getElementById('vis_data');
const canvas = document.querySelector('.canvas');
const chart = document.getElementById('chart');
const ddmmyy = document.getElementById('ddmmyy');
const left_graph = document.getElementById('left-graph');
const right_graph = document.getElementById('right-graph');
const choice = document.getElementById('choice');
const chart_div = document.querySelector('.chart_div');
const exit = document.getElementById('exit');
var Cnt;
const deg = 10;
const detail = ["Temperature (°C)","Wind Speed (Km/h)", "Humidity (%)", "Wind Direction (Degrees)", "Pressure (hPa)"];
var other, k;
var flag = true, lat, lon, prev, next;
var day = 0;
var check = false;
var data = {};
var act_data = [];

function powerx(e, x_mat) {
    let sum = 0;
    for (let i = 0; i < x_mat._data.length; i++) {
        sum += Math.pow(x_mat._data[i], e);
    }
    return sum;
}

function array_null(SMA){
    SMA.unshift(null);
    SMA.push(null);
    SMA.push(null);
    return SMA;
}

function cal(x) {
    if (x < data.length) {
        return "0" + x;
    }
    else {
        return x;
    }
}

function powery(e, y_mat) {
    let sum = 0;
    for (let i = 0; i < y_mat._data.length; i++) {
        sum += Math.pow(y_mat._data[i], e);
    }
    return sum;
}

function XxY(e, x_mat, y_mat) {
    let sum = 0;
    for (let i = 0; i < x_mat._data.length; i++) {
        sum += y_mat._data[i] * Math.pow(x_mat._data[i], e);
    }
    return sum;
}

function C_F(celsius) {
    F = 1;
    F = (celsius * 9 / 5) + 32;
    return F;
}

function detCnt(check) {
    if (check) {
        return 1;
    }
    else {
        return 0;
    }
}

function pass(div_class, count, weatherDetails1, weatherDetails2) {
    if (count <= 2) {
        weatherDetails1.appendChild(div_class);
    }
    else {
        weatherDetails2.appendChild(div_class);
    }
}

function data_update(data){
    let q = 0;
    for (let i = 0; i < 5; i++) {
        act_data[i] = [];
        for (let j = 0; j < data.length; j++) {
            switch (q) {
                case 0: act_data[i][j] = data[j].temp; break;
                case 1: act_data[i][j] = data[j].wind_speed; break;
                case 2: act_data[i][j] = data[j].humidity; break;
                case 3: act_data[i][j] = data[j].wind_direction; break;
                case 4: act_data[i][j] = data[j].pressure; break;
                default: ;
            }
        }
        q += 1;
    }
    return act_data;
}

function date_function(da) {
    var dd = da.slice(8, 10);
    var mm = da.slice(5, 7);
    var yyyy = da.slice(0, 4);
    return dd + "/" + mm + "/" + yyyy;
}

function Day(da) {
    var k = da.slice(0, 2);
    return parseInt(k);
}

function update_data(json){
    let data = [];
    for (let i = 0; i < json.list.length; i++) {
        data[i] = {
            "date": json.list[i].dt_txt,
            "time": parseInt(json.list[i].dt_txt.slice(11, 13)),
            "temp": parseInt(json.list[i].main.temp),
            "pressure": parseInt(json.list[i].main.pressure),
            "humidity": parseInt(json.list[i].main.humidity),
            "wind_direction": parseInt(json.list[i].wind.deg),
            "wind_speed": parseInt(json.list[i].wind.speed),
        }
    }
    return data;
}

function label(x_label,data){
    let x_act = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].time == 0) {
            x_act[i] = x_label[i];
        }
        else {
            x_act[i] = (data[i].time) + ':00';
        }
    }
    return x_act;
}

function button_enable(button){ 
    button.disabled = false;
    button.style.color = 'grey';
    button.style.cursor = 'pointer';
}

function button_disable(button){ 
    button.disabled = true;
    button.style.color = 'white';
    button.style.cursor = 'default';
}

function find_coeff(x_mat,y_mat){
    var x_pow = [];
    var y_pow = [];
    var reg;
    var eye = [];

    for (let i = 0; i < deg; i++) {
        x_pow[i] = [];
        for (let j = 0; j < deg; j++) {
            x_pow[i][j] = powerx(j + i, x_mat);
        }
        y_pow[i] = XxY(i, x_mat, y_mat);
    }

    var coeff = math.matrix(x_pow);
    var result = math.matrix(y_pow);

    for (let i = 0; i < deg; i++) {
        eye[i] = [];
        for (let j = 0; j < deg; j++) {
            if (i == j) {
                eye[i][j] = 1;
            }
            else {
                eye[i][j] = 0;
            }
        }
    }

    eye = math.matrix(eye);
    coeff = math.divide(eye, coeff);
    reg = math.multiply(coeff, result);

    return reg;
}

function UI_Weather(json,temperature,description,widibox,wind_direction,wispbox,wind,humibox,hum,preboxx,pres,weatherBox,Cnt,weatherDetails1,weatherDetails2,container){
    
    temperature.innerHTML = `${parseInt(json.list[day].main.temp)}<span>°C</span> <h9 style="color:white;-webkit-user-select: none; /* Safari */
    -ms-user-select: none;user-select: none;">_</h9>/ ${C_F(parseInt(json.list[day].main.temp))}<span>°F</span>`;
    description.innerHTML = `${json.list[day].weather[0].description}`;
    ddmmyy.innerHTML = `${date_function(json.list[day].dt_txt)}`;

    try {
        if (widibox) {
            wind_direction.innerHTML = `${json.list[day].wind.deg}°`;
        }
        else {
            wind_direction.innerHTML = `-`;
        }
    }

    catch (TypeError) {
        console.log("Error (Intended Feature)! Wind Direction class not found");
    }

    try {
        if (wispbox) {
            wind.innerHTML = `${parseInt(json.list[day].wind.speed)} Km/h`;
        }
        else {
            wind.innerHTML = `-`;
        }
    }

    catch (TypeError) {
        console.log("Error (Intended Feature)! Wind Speed class not found");
    }

    try {
        if (humibox) {
            hum.innerHTML = `${parseInt(json.list[day].main.humidity)} %`;
        }
        else {
            hum.innerHTML = `-`;
        }
    }
    catch (TypeError) {
        console.log("Error (Intended Feature)! Humidity class not found");
    }

    try {
        if (preboxx) {
            pres.innerHTML = `${parseInt(json.list[day].main.pressure)} hPa`;
        }
        else {
            pres.innerHTML = `-`;
        }
    }

    catch (TypeError) {
        console.log("Error (Intended Feature)! Pressure class not found");
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

    if (Cnt == 0) {
        weatherDetails1.style.display = 'none';
        weatherDetails2.style.display = 'none';
        weatherDetails1.classList.add('fadeIn');
        weatherDetails2.classList.add('fadeIn');
        container.style.height = '330px';
    }
    else if (Cnt == 1 || Cnt == 2) {
        weatherDetails1.style.display = '';
        weatherDetails2.style.display = 'none';
        weatherDetails1.classList.add('fadeIn');
        weatherDetails2.classList.add('fadeIn');
        container.style.height = '410px';
    }
    else {
        weatherDetails1.style.display = '';
        weatherDetails2.style.display = '';
        weatherDetails1.classList.add('fadeIn');
        weatherDetails2.classList.add('fadeIn');
        container.style.height = '490px';
    }

}

function create_chart(x_act,y_data,SMA,y_pass,details){
    new Chart("chart", {
        type: "line",
        data: {
            labels: x_act,
            datasets: [{
                data: y_data,
                borderColor: "green",
                fill: false,
                label: "Regression Cuve",
                backgroundColor: "green",
            },
            {
                data: SMA,
                borderColor: "red",
                fill: false,
                label: "SMA Data",
                backgroundColor: "red",
            },
            {
                data: y_pass,
                borderColor: "blue",
                fill: false,
                label: "Forecasted Data",
                backgroundColor: "blue",
            }]
        },
        options: {
            legend: { display: true, position: 'top', fontsize: '22px' },
            responsive: true,
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Hour / Day',
                        fontColor: '#911',
                        fontFamily: 'Comic Sans MS',
                        fontSize: 25,
                        fontStyle: 'bold',

                    },
                    ticks: {
                        autoskip: false,
                        beginAtZero: true

                    },
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: details,
                        fontColor: '#191',
                        fontFamily: 'Comic Sans MS',
                        fontSize: 25,
                        fontStyle: 'bold',
                    },

                    ticks: {
                        autoskip: false,
                        beginAtZero: false
                    },
                }]
            }
        }
    });
}

function div_update(list,weatherDetails1,weatherDetails2){
    var div_create, count = 0;
    for (let i = 0; i < 4; i++) {
        if (list[i] == true) {
            switch (i) {
                case 0: div_create = document.createElement("div");
                        div_create.class = "wind";
                        div_create.id = "wind";
                        div_create.innerHTML = `<i class="fa-solid fa-wind"></i>
                        <div class="text">
                            <span id = "1"></span>
                            <p>Wind Speed</p>
                        </div>`; 
                        count += 1;
                        pass(div_create, count, weatherDetails1, weatherDetails2); break;

                case 1: div_create = document.createElement("div");
                        div_create.class = "hum";
                        div_create.id = "hum";
                        div_create.innerHTML = `<i class="fa-solid fa-water"></i>
                        <div class="text">
                            <span id = "2"></span>
                            <p>Humidity</p>
                        </div>`; 
                        count += 1;
                        pass(div_create, count, weatherDetails1, weatherDetails2); break;

                case 2: div_create = document.createElement("div");
                        div_create.class = "wind_dir";
                        div_create.id = "wind_dir";
                        div_create.innerHTML = `<i class="fa-brands fa-nfc-directional"></i>
                        <div class="text">
                            <span id = "3"></span>
                            <p>Wind Direction</p>
                        </div>`; 
                        count += 1;
                        pass(div_create, count, weatherDetails1, weatherDetails2); break;

                case 3: div_create = document.createElement("div");
                        div_create.class = "Pres";
                        div_create.id = "Pres";
                        div_create.innerHTML = `<i class="fa-solid fa-gauge"></i>
                        <div class="text">
                          <span id = "4"></span>
                          <p>Pressure</p>
                        </div>`; 
                        count += 1;
                        pass(div_create, count, weatherDetails1, weatherDetails2); break;

                default: console.log('Error (Not Intended Feature)!');
            }
        }
    }
}

function chart_delete(chart,chart_div){
    chart.remove();
    chart_div.innerHTML = `<canvas id = "chart" style="width:100%;max-width: 900px;max-height: 350px;"></canvas>`;
}

function error_404(container,weatherBox,weatherDetails1,weatherDetails2,error404){
    container.style.height = '400px';
    weatherBox.style.display = 'none';
    weatherDetails1.style.display = 'none';
    weatherDetails2.style.display = 'none';
    other = document.getElementById('del');
    other.style.display = 'none';
    other = document.getElementById('del');
    other.style.display = 'none';
    other = document.querySelector('.other-info');
    other.style.display = 'none';
    other = document.querySelector('.other-info1');
    other.style.display = 'none';
    visual.style.display = 'none';
    error404.style.display = '';
    error404.classList.add('fadeIn');
}

left.addEventListener('click', () => {
    
    const city = document.querySelector('.search-box input').value.toUpperCase();
    const wispbox = document.getElementById('wind_speed').checked;
    const humibox = document.getElementById('humi').checked;
    const widibox = document.getElementById('wind_direction').checked;
    const preboxx = document.getElementById('pre').checked;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                error_404(list);
                return;
            }

            if (day > 0) {
                button_enable(right);
                prev = Day(date_function(json.list[day].dt_txt));
                next = Day(date_function(json.list[day].dt_txt));

                while(prev == next && day > 0) {
                    prev = Day(date_function(json.list[day].dt_txt));
                    next = Day(date_function(json.list[day - 1].dt_txt));
                    day = day - 1;
                }
                while(data[day].time != 12 && day > 0){
                    day -= 1;
                }
            }

            k = day;
            prev = Day(date_function(json.list[k].dt_txt));
            next = Day(date_function(json.list[k].dt_txt));

            while (prev == next && k > 0) {
                prev = Day(date_function(json.list[k].dt_txt));
                next = Day(date_function(json.list[k - 1].dt_txt));
                k = k - 1;
            }

            if (k == 0) {
                check = true;
                if(data[k].time <= 12){
                    while(data[k].time < 12){
                        k += 1;
                    }
                }
                    day = k;
            }

            if (check) {
                button_disable(left);
                check = false;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const wind_direction = document.getElementById("3");
            const wind = document.getElementById("1");
            const hum = document.getElementById("2");
            const pres = document.getElementById("4");

            UI_Weather(json,temperature,description,widibox,wind_direction,wispbox,wind,humibox,hum,preboxx,pres,weatherBox,Cnt,weatherDetails1,weatherDetails2,container);
        });
});

right.addEventListener('click', () => {

    const city = document.querySelector('.search-box input').value.toUpperCase();
    const wispbox = document.getElementById('wind_speed').checked;
    const humibox = document.getElementById('humi').checked;
    const widibox = document.getElementById('wind_direction').checked;
    const preboxx = document.getElementById('pre').checked;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
        .then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                error_404(container,weatherBox,weatherDetails1,weatherDetails2,error404);
                return;
            }

            if (day < 39) {
                button_enable(left);
                prev = Day(date_function(json.list[day].dt_txt));
                next = Day(date_function(json.list[day].dt_txt));

                while(prev == next && day < 39) {
                    prev = Day(date_function(json.list[day].dt_txt));
                    next = Day(date_function(json.list[day + 1].dt_txt));
                    day += 1;
                }

                while(data[day].time != 12 && day < 39){
                    day = day + 1;
                }
            }

            k = day;
            prev = Day(date_function(json.list[k].dt_txt));
            next = Day(date_function(json.list[k].dt_txt));

            while (prev == next && k < 39) {
                prev = Day(date_function(json.list[k].dt_txt));
                next = Day(date_function(json.list[k + 1].dt_txt));
                k = k + 1;
            }

            if (k == 39) {
                check = true;
                if(data[k].time >= 12){
                    while(data[k].time > 12){
                        k -= 1;
                    }
                }
                    day = k;
            }

            if (check) {
                button_disable(right);
                check = false;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const wind_direction = document.getElementById("3");
            const wind = document.getElementById("1");
            const hum = document.getElementById("2");
            const pres = document.getElementById("4");

            UI_Weather(json,temperature,description,widibox,wind_direction,wispbox,wind,humibox,hum,preboxx,pres,weatherBox,Cnt,weatherDetails1,weatherDetails2,container);
        });
});

refresh.addEventListener('click', () => {

    day = 0;
    button_enable(left);
    button_enable(right);

    if (!(re)) {
        re.innerHTML = `<p id="del"><br></p>
        <div class="other-info">
            <p>Other weather details:</p>
        </div>
        <p id="del"><br> </p>
            <div class="other-info">
                    <form>
                        <input type="checkbox" id="wind_speed" value="Wind Speed">
                        <label for="wind_speed"> Wind Speed </label>
                        <input type="checkbox" id="humi" value="humidity">
                        <label for="humi"> Humidity </label>
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
    visual.style.display = `none`;

    container.style.height = '220px';
    weatherBox.style.display = 'none';
    weatherDetails1.style.display = 'none';
    weatherDetails2.style.display = 'none';
    container.style.display = 'block';
    container.classList.add('fadeIn');
});

search.addEventListener('click', () => {
    
    day = 0;
    button_disable(left);
    button_enable(right);
    visual.style.display = `block`;

    const city = document.querySelector('.search-box input').value.toUpperCase();
    const wispbox = document.getElementById('wind_speed').checked;
    const humibox = document.getElementById('humi').checked;
    const widibox = document.getElementById('wind_direction').checked;
    const preboxx = document.getElementById('pre').checked;
    var del = document.querySelector('.other-info');
    var dele = document.getElementById('del');
    var ddmmyy = document.getElementById('ddmmyy');
    var count = 0;
    var div_create;
    Cnt = detCnt(humibox) + detCnt(widibox) + detCnt(wispbox) + detCnt(preboxx);
    var list = [wispbox, humibox, widibox, preboxx];
    weatherDetails1.innerHTML = ``;
    weatherDetails2.innerHTML = ``;

    div_update(list,weatherDetails1,weatherDetails2);

    if (city === '')
        return;

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`)
    .then(response => response.json())
    .then(json => {
            if (json.cod === '404') {
                flag = false;
                error_404(container,weatherBox,weatherDetails1,weatherDetails2,error404);
            }

            try {
                lat = json[0].lat;
                lon = json[0].lon;
            }

            catch (error) {
                error_404(container,weatherBox,weatherDetails1,weatherDetails2,error404);
                return;
            }

            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
            .then(response => response.json())
            .then(json => {

                    error404.style.display = 'none';
                    error404.classList.remove('fadeIn');
                    const image = document.querySelector('.weather-box img');
                    const temperature = document.querySelector('.weather-box .temperature');
                    const description = document.querySelector('.weather-box .description');
                    const wind_direction = document.getElementById("3");
                    const wind = document.getElementById("1");
                    const hum = document.getElementById("2");
                    const pres = document.getElementById("4");

                    data = update_data(json);
                    console.log(data);

                    let qk = 0;
                    if (qk == 0) {
                        if(data[qk].time <= 12){
                            while(data[qk].time < 12){
                                qk += 1;
                            }
                        }
                            day = qk;
                    }

                    UI_Weather(json,temperature,description,widibox,wind_direction,wispbox,wind,humibox,hum,preboxx,pres,weatherBox,Cnt,weatherDetails1,weatherDetails2,container);

            });
    });
});

visual.addEventListener('click', () => {

    container.style.display = 'none';
    canvas.style.display = 'block';
    canvas.style.height = '500px';
    canvas.style.width = '1000px';

    button_disable(left_graph);
    button_enable(right_graph);

    var weather = [];
    var x_label = [];
    var x_data = [];
    var y_data = [];
    var part = 0;
    var x_pass = [];
    var y_pass = [];
    var q = 0;
    var SMA = [];
    var x_act = [];
    var x_pow = [];
    var y_pow = [];
    var eye = [];
    var final = [];

    k = 0;
    choice.innerHTML = `${detail[k]}`;
    console.log(data);

    act_data = data_update(data);
    console.log(act_data);
    
    for (let i = 0; i < data.length-2; i++) {
        SMA[i] = (act_data[k][i + 1] + act_data[k][i + 2] + act_data[k][i]) / 3;
    }

    for (let i = 0; i < data.length-2; i++) {
        weather[i] = SMA[i];
    }

    for (let i = 0; i < data.length-2; i++) {
        if (i == 0) {
            tt = parseInt(data[i].date.slice(11, 13)) / (24);
        }
        x_data[i] = tt;
        x_pass[i] = tt;
        tt += (1 / 8);
    }

    const x_mat = math.matrix(x_pass);
    const y_mat = math.matrix(weather);

    for (let i = 0; i < data.length; i++) {
        date = data[i].date;
        dd = date.slice(8, 10);
        mm = date.slice(5, 7);
        x_label[i] = dd + "/" + mm;
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i].time == 0) {
            x_act[i] = x_label[i];
        }
        else {
            x_act[i] = (data[i].time) + ':00';
        }
    }

    const reg = find_coeff(x_mat,y_mat);
    
    for (let i = 0; i < reg._data.length; i++) {
        final[i] = reg._data[i];
    }

    for (let i = 0; i < data.length; i++) {
        y_pass[i] = 0;
        if(i < data.length-2){ 
            y_data[i] = 0;
            for (let j = 0; j < final.length; j++) {
            y_data[i] += final[j] * (Math.pow(x_data[i], j));
            }
        }
        if (i < data.length) {
            y_pass[i] = act_data[k][i];
        }
    }

    SMA = array_null(SMA);
    y_data = array_null(y_data);

    var details = detail[k];

   create_chart(x_act,y_data,SMA,y_pass,details);
});

left_graph.addEventListener('click', () => {

    chart_delete(chart,chart_div);

    canvas.style.height = '500px';
    canvas.style.width = '1000px';

    var weather = [];
    var x_label = [];
    var x_data = [];
    var y_data = [];
    var part = 0;
    var x_pass = [];
    var y_pass = [];
    var SMA = [];
    var x_act = [];
    var x_pow = [];
    var y_pow = [];
    var eye = [];
    var final = [];

    k -= 1;
    choice.innerHTML = `${detail[k]}`;

    if (k == 0) {
        button_disable(left_graph);
    }

    button_enable(right_graph);

    for (let i = 0; i < data.length-2; i++) {
        SMA[i] = (act_data[k][i + 1] + act_data[k][i + 2] + act_data[k][i]) / 3;
    }

    for (let i = 0; i < data.length-2; i++) {
        weather[i] = SMA[i];
    }

    for (let i = 0; i < data.length-2; i++) {
        if (i == 0) {
            tt = parseInt(data[i].date.slice(11, 13)) / (24);
        }
        x_data[i] = tt;
        x_pass[i] = tt;
        tt += (1 / 8);
    }

    const x_mat = math.matrix(x_pass);
    const y_mat = math.matrix(weather);

    for (let i = 0; i < data.length; i++) {
        date = data[i].date;
        dd = date.slice(8, 10);
        mm = date.slice(5, 7);
        x_label[i] = dd + "/" + mm;
    }
    
    x_act = label(x_label,data);

    const reg = find_coeff(x_mat,y_mat);
    
    for (let i = 0; i < reg._data.length; i++) {
        final[i] = reg._data[i];
    }

    for (let i = 0; i < data.length; i++) {
        y_pass[i] = 0;
        if(i<data.length-2){ 
            y_data[i] = 0;
            for (let j = 0; j < final.length; j++) {
            y_data[i] += final[j] * (Math.pow(x_data[i], j));
            }
        }
        if (i < data.length) {
            y_pass[i] = act_data[k][i];
        }
    }

    SMA = array_null(SMA);
    y_data = array_null(y_data);
    var details = detail[k];
    create_chart(x_act,y_data,SMA,y_pass,details);
});

right_graph.addEventListener('click', () => {
    
    chart_delete(chart,chart_div);

    canvas.style.height = '500px';
    canvas.style.width = '1000px';

    var weather = [];
    var x_label = [];
    var x_data = [];
    var y_data = [];
    var part = 0;
    var x_pass = [];
    var y_pass = [];
    var SMA = [];
    var x_act = [];
    var x_pow = [];
    var y_pow = [];
    var eye = [];
    var final = [];

    k += 1;
    choice.innerHTML = `${detail[k]}`;

    if (k == 4) {
        button_disable(right_graph);
    }

    button_enable(left_graph);

    for (let i = 0; i < data.length-2; i++) {
        SMA[i] = (act_data[k][i + 1] + act_data[k][i + 2] + act_data[k][i]) / 3;
    }

    for (let i = 0; i < data.length-2; i++) {
        weather[i] = SMA[i];
    }

    for (let i = 0; i < data.length-2; i++) {
        if (i == 0) {
            tt = parseInt(data[i].date.slice(11, 13)) / (24);
        }
        x_data[i] = tt;
        x_pass[i] = tt;
        tt += (1 / 8);
    }

    const x_mat = math.matrix(x_pass);
    const y_mat = math.matrix(weather);

    for (let i = 0; i < data.length; i++) {
        date = data[i].date;
        dd = date.slice(8, 10);
        mm = date.slice(5, 7);
        x_label[i] = dd + "/" + mm;
    }
    
    x_act = label(x_label,data);

    const reg = find_coeff(x_mat,y_mat);
    
    for (let i = 0; i < reg._data.length; i++) {
        final[i] = reg._data[i];
    }

    for (let i = 0; i < data.length; i++) {
        y_pass[i] = 0;
        if(i<data.length-2){ 
            y_data[i] = 0;
            for (let j = 0; j < final.length; j++) {
            y_data[i] += final[j] * (Math.pow(x_data[i], j));
            }
        }
        if (i < data.length) {
            y_pass[i] = act_data[k][i];
        }
    }

    SMA = array_null(SMA);
    y_data = array_null(y_data);

    var details = detail[k];

    create_chart(x_act,y_data,SMA,y_pass,details);
});

exit.addEventListener('click', () => {

    container.style.display = 'block';
    canvas.style.display = 'none';
    visual.style.display = `block`;

    chart_delete(chart,chart_div);
   
    const city = document.querySelector('.search-box input').value.toUpperCase();
    const wispbox = document.getElementById('wind_speed').checked;
    const humibox = document.getElementById('humi').checked;
    const widibox = document.getElementById('wind_direction').checked;
    const preboxx = document.getElementById('pre').checked;
    var del = document.querySelector('.other-info');
    var dele = document.getElementById('del');
    var ddmmyy = document.getElementById('ddmmyy');
    var Cnt = detCnt(humibox) + detCnt(widibox) + detCnt(wispbox) + detCnt(preboxx);
    var list = [wispbox, humibox, widibox, preboxx];
    weatherDetails1.innerHTML = ``;
    weatherDetails2.innerHTML = ``;

    div_update(list,weatherDetails1,weatherDetails2);

    if (city === '')
        return;

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`)
    .then(response => response.json())
    .then(json => {
            if (json.cod === '404') {
                flag = false;
                error_404(container,weatherBox,weatherDetails1,weatherDetails2,error404);
            }

            try {
                lat = json[0].lat;
                lon = json[0].lon;
            }

            catch (error) {
                error_404(container,weatherBox,weatherDetails1,weatherDetails2,error404);
                return;
            }


            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
            .then(response => response.json())
            .then(json => {

                    error404.style.display = 'none';
                    error404.classList.remove('fadeIn');
                    const image = document.querySelector('.weather-box img');
                    const temperature = document.querySelector('.weather-box .temperature');
                    const description = document.querySelector('.weather-box .description');
                    const wind_direction = document.getElementById("3");
                    const wind = document.getElementById("1");
                    const hum = document.getElementById("2");
                    const pres = document.getElementById("4");

                    data = update_data(json);

                    UI_Weather(json,temperature,description,widibox,wind_direction,wispbox,wind,humibox,hum,preboxx,pres,weatherBox,Cnt,weatherDetails1,weatherDetails2,container);
                
            });
    });
});
