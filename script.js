let weather = {
    apikey: "23e798cf84ef5ec7e1eb10cd510599ec",
    fetchWeather: function(city){
        //current
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" 
        + city 
        + "&units=imperial&appid=" 
        + this.apikey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));

        //daily
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q=" 
        + city 
        + "&units=imperial&appid=" 
        + this.apikey
        )
        .then((response) => response.json())
        .then((data) => this.displayDailyForecast(data));
    },
    fetchWeatherWCoordinates: function(lat, long){
        //current
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?lat=" 
            + lat 
            + "&lon=" 
            + long
        + "&units=imperial&appid=" 
        + this.apikey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));

        //daily
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?lat=" 
            + lat 
            + "&lon=" 
            + long
        + "&units=imperial&appid=" 
        + this.apikey
        )
        .then((response) => response.json())
        .then((data) => this.displayDailyForecast(data));
    },
    displayWeather: function(data){
        //CURRENT WEATHER
        const { name } = data;
        const { icon, description, id } = data.weather[0];
        const { temp, humidity, temp_min, temp_max } = data.main;
        const { speed, deg } = data.wind;
        const { dt } = data.dt;

        document.querySelector(".locationtext").textContent = " " + name;

        //REMOVING DECIMAL VALUES FROM TEMPS
        var tempConv = temp.toString();
        if(tempConv.includes(".")){
            var index = tempConv.indexOf(".");
            tempConv = tempConv.substring(0, index);
        };
        var hiConv = temp_max.toString();
        if(hiConv.includes(".")){
            var index = hiConv.indexOf(".");
            hiConv = hiConv.substring(0, index);
        };
        var loConv = temp_min.toString();
        if(loConv.includes(".")){
            var index = loConv.indexOf(".");
            loConv = loConv.substring(0, index);
        };

        var windConv = speed.toString();
        if(windConv.includes(".")){
            var index = windConv.indexOf(".");
            windConv = windConv.substring(0, index);
        };

        //GETTING THE CORRECT DIRECTION FROM DEGREES
        var direction;
        if(deg >= 0 && deg <= 22.5){
            direction = "North";
        }
        else if(deg > 22.5 && deg <= 67.5){
            direction = "Northeast";
        }
        else if(deg > 67.5 && deg <= 112.5){
            direction = "East";
        }
        else if(deg > 112.5 && deg <= 157.5){
            direction = "Southeast";
        }
        else if(deg > 157.5 && deg <= 202.5){
            direction = "South";
        }
        else if(deg > 202.5 && deg <= 247.5){
            direction = "Southwest";
        }
        else if(deg > 247.5 && deg <= 292.5){
            direction = "West";
        }
        else if(deg > 292.5 && deg <= 337.5){
            direction = "Northwest";
        }
        else if(deg > 337.5){
            direction = "North";
        }

        //DISPLAYNG ON THE WEBSITE
        document.querySelector(".tempvalue").textContent = tempConv + "°F";
        document.querySelector(".hiandlo").textContent = "Hi: " + hiConv + "°F Lo: " + loConv + "°F";
        document.querySelector(".conditiondesc").textContent = description;
        document.querySelector(".conditionicon").src = getImage(icon, id, getTime(dt));
        // document.querySelector(".tester").textContent = getTime(dt);
        document.querySelector(".humid").textContent = humidity + "%";
        document.querySelector(".windspeed").textContent = windConv + " MPH";
        document.querySelector(".winddir").textContent = direction;

        document.querySelector(".allsections").classList.remove("loading");
        document.querySelector(".loader").classList.remove("loading");
        
    },
    displayDailyForecast: function(data){
        for(let i = 0; i < 6; i++){

            //getting time
            var dt = data.list[i].dt_txt.substring(11, 13);
            if(dt.substring(0, 2) == "11"){
                dt = "11 AM"
            }
            else if(dt.substring(0, 2) == "12"){
                dt = "12 PM"
            }
            else if(dt.substring(0, 2) == "13"){
                dt = "1 PM"
            }
            else if(dt.substring(0, 2) == "14"){
                dt = "2 PM"
            }
            else if(dt.substring(0, 2) == "15"){
                dt = "3 PM"
            }
            else if(dt.substring(0, 2) == "16"){
                dt = "4 PM"
            }
            else if(dt.substring(0, 2) == "17"){
                dt = "5 PM"
            }
            else if(dt.substring(0, 2) == "18"){
                dt = "6 PM"
            }
            else if(dt.substring(0, 2) == "19"){
                dt = "7 PM"
            }
            else if(dt.substring(0, 2) == "20"){
                dt = "8 PM"
            }
            else if(dt.substring(0, 2) == "21"){
                dt = "9 PM"
            }
            else if(dt.substring(0, 2) == "22"){
                dt = "10 PM"
            }
            else if(dt.substring(0, 2) == "23"){
                dt = "11 PM"
            }
            else if(dt.substring(0, 2) == "00"){
                dt = "12 AM"
            }
            else{
                dt = dt.substring(1) + " AM";
            }
            document.querySelector(".forecasttime" + (i+1)).textContent = dt;

            //getting real dt value
            var time = data.list[i].dt;

            //getting icon and id
            var icon = data.list[i].weather[0].icon;
            var id = data.list[i].weather[0].id;
            document.querySelector(".dailyforecasticon" + (i+1)).src = getImage(icon, id, getTime(time));

            //getting description
            var description = data.list[i].weather[0].description;
            document.querySelector(".dailyforecastcond" + (i+1)).textContent = description;

            var temp = data.list[i].main.temp;
            document.querySelector(".hourlytemp" + (i+1)).textContent = temp.toFixed() + "°F";

            var pop = data.list[i].pop;
            pop = pop * 100;
            pop = pop.toFixed();
            document.querySelector(".dailypop" + (i+1)).textContent = pop + "%";
        }
        //using most recent pop for the "current" pop (listed below forecast)
        var pop = data.list[0].pop;
            pop = pop * 100;
            pop = pop.toFixed();
            document.querySelector(".currpop").textContent = pop + "%";
    },
    search: function(){
        this.fetchWeather(document.querySelector(".search-bar").value);
        this.fetchHourlyForecast(document.querySelector(".search-bar").value);
        this.fetchDailyForecast(document.querySelector(".search-bar").value);
    }
};

//TO IMPLEMENT LATER
// searchBar();
//   function searchBar(){
//     var alldata;
//     fetch("cities/cities.json").then((response) => response.json()).then((data) => getCities(data));
//   }
//   function getCities(data){
//     var cities = [];
//     var countries = [];
//     var lat = [];
//     var lng = [];

//     for(let i = 0; i < data.length; i++){
//         if(data[i].name.includes(document.querySelector(".search-bar").value)){
//         }
//         cities[i] = data[i].name;
//         countries[i] = data[i].country;
//         lat[i] = data[i].lat;
//         lng[i] = data[i].lng;
//     }
//   }

    document.querySelector(".searchbtn").addEventListener("click", function(){
        weather.search();
    });
    document.querySelector(".search-bar").addEventListener("keyup", function(event){
        if(event.key == "Enter"){
            weather.search();
        }
    })

    getLocation();
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else {
    weather.fetchWeather("Chicago");
  }
}
function showPosition(position) {
    weather.fetchWeatherWCoordinates(position.coords.latitude, position.coords.longitude);
}
function errHand(err) {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        weather.fetchWeather("Chicago");

        break;
      case err.POSITION_UNAVAILABLE:
        weather.fetchWeather("Chicago");

        break;
      case err.TIMEOUT:
        weather.fetchWeather("Chicago");

        break;
      case err.UNKNOWN_ERROR:
        weather.fetchWeather("Chicago");

        break;
    }
  }

  function getImage(key, code, time){
    let value;
    if(key == "01d" || key == "01n"){
        if(getDN(time) == "n"){
            value = "conditions/clearn.png"
        }
        else{
            value = "conditions/clear.png"
        }
    }
    else if(key == "02d" || key == "02n"){
        if(getDN(time) == "n"){
            value = "conditions/partlyn.png"
        }
        else{
            value = "conditions/partly.png"
        }
    }
    else if(key == "03d" || key == "03n"){
        if(getDN(time) == "n"){
            value = "conditions/partlyn.png"
        }
        else{
            value = "conditions/partly.png"
        }
    }
    else if(key == "04d" || key == "04n"){
        if(code == "803"){
            if(getDN(time) == "n"){
                value = "conditions/partlyn.png"
            }
            else{
                value = "conditions/partly.png"
            }
        }
        else{
            value = "conditions/clouds.png"
        }
    }
    else if(key == "09d" || key == "09n"){
        value = "conditions/rain.png"
    }
    else if(key == "10d" || key == "10n"){
        value = "conditions/rain.png"
    }
    else if(key == "11d" || key == "11n"){
        value = "conditions/thunder.png"
    }
    else if(key == "13d" || key == "13n"){
        value = "conditions/snow.png"
    }
    else if(key == "50d" || key == "50n"){
        value = "conditions/mist.png"
    }
    return value;
}

//DARK MODE
const checkbox = $("#acheckbox");

checkbox.change(function(event) {
    var checkbox = event.target;
    if (checkbox.checked) {
        document.querySelector(".dmlmtxt").textContent = "Dark Mode";

        document.body.style.background = "#252525";
        
        document.querySelector("footer").style.color = "#fff";
        document.querySelector(".currentlocation p1").style.color = "#fff";
        document.querySelector(".currentlocation p3").style.color = "#fff";
        document.querySelector("header p1").style.color = "#fff";
        document.querySelector(".boxaround").style.boxShadow = "0 0 20px #0a0a0a";
        document.querySelector(".copyrightsymbol").src = "images/copyrightw.png";
        document.querySelector('meta[name="theme-color"]').setAttribute('content',  '#252525');

        // document.querySelector(".precip").src = "images/precipw.png";
    } else {
        document.querySelector(".dmlmtxt").textContent = "Light Mode";

        document.body.style.background = "#fff";

        document.querySelector("footer").style.color = "#252525";
        document.querySelector(".currentlocation p1").style.color = "#252525";
        document.querySelector(".currentlocation p3").style.color = "#252525";
        document.querySelector("header p1").style.color = "#252525";
        document.querySelector(".boxaround").style.boxShadow = "0 0 20px #cfcfcf";
        document.querySelector(".copyrightsymbol").src = "images/copyrightb.png";
        document.querySelector('meta[name="theme-color"]').setAttribute('content',  '#fff');

        // document.querySelector(".precip").src = "images/precipb.png";
    }
});

function getTime(dt){
    //converting time

    var a = new Date(dt * 1000);
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = hour + ':' + min + ':' + sec ;
  return time;



    // let unix_timestamp = dt;
    // var date = new Date(unix_timestamp * 1000);
    // var hours = date.getHours();
    // var minutes = "0" + date.getMinutes();
    // var seconds = "0" + date.getSeconds();
    // var formattedTime = hours + ":" + minutes.substring(-2) + ":" + seconds.substring(-2);
    // return formattedTime;
}

function getDN(time){
    var dayOrNight;
    if((Number(time.substring(0, 2)) < 6) || (Number(time.substring(0, 2)) > 20)){
        dayOrNight = "n"
    }
    else{
        dayOrNight = "d";
    }
    return dayOrNight;
}


// const checkbox = document.querySelector(".checkbox")

// checkbox.addEventListener('change', (event) => {
//   if (event.currentTarget.checked) {
//     document.querySelector(".dmlmtxt").textContent = "Dark Mode";
//   } else {
//     document.querySelector(".dmlmtxt").textContent = "Light Mode";
//   }
// })