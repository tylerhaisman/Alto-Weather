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

        // if(city != document.querySelector(".locationtext").textContent){
        //     document.querySelector(".errormsg").textContent = "Please enter a valid location.";
        // }
    },
    displayWeather: function(data){
        //CURRENT WEATHER
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, temp_min, temp_max } = data.main;
        const { speed, deg } = data.wind;

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
        // document.querySelector(".conditionicon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".conditionicon").src = getImage(icon);
        document.querySelector(".humid").textContent = humidity + "%";
        document.querySelector(".windspeed").textContent = windConv + " MPH";
        document.querySelector(".winddir").textContent = direction;

        document.querySelector(".allsections").classList.remove("loading");
    },
    displayDailyForecast: function(data){

        //DAILY FORECAST WEATHER
        for(let i = 0; i < 4; i++){
            //getting day of the week
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var d = new Date(data.list[(i)*8].dt * 1000);
            var dayIndex = d.getDay();
            if(dayIndex > 6){
                dayIndex = 0;
            }
            var dayName = days[dayIndex];
            document.querySelector(".forecastday" + (i+1)).textContent = dayName;

            var icon = data.list[(i)*8].weather[0].icon;
            // document.querySelector(".dailyforecasticon" + (i+1)).src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            document.querySelector(".dailyforecasticon" + (i+1)).src = getImage(icon);

            var description = data.list[(i)*8].weather[0].description;
            document.querySelector(".dailyforecastcond" + (i+1)).textContent = description;

            var currHi = data.list[(i)*8].main.temp_max;
            for(let j = 1; j < 9; j++){
                if(data.list[((i)*8) + j].main.temp_max > currHi){
                    currHi = data.list[((i)*8) + j].main.temp_max
                }
            }
            var currLo = data.list[(i)*8].main.temp_min;
            for(let j = 1; j < 9; j++){
                if(data.list[((i)*8) + j].main.temp_min < currLo){
                    currLo = data.list[((i)*8) + j].main.temp_min
                }
            }
            var hiandlo = "Hi: " + Number(currHi).toFixed(0) + "°F " + "Lo: " + Number(currLo).toFixed(0) + "°F";
            document.querySelector(".forecasthilo" + (i+1)).textContent = hiandlo;

            var currPOP = data.list[(i)*8].pop;
            for(let j = 1; j < 9; j++){
                if(data.list[((i)*8) + j].pop > currPOP){
                    currPOP = data.list[((i)*8) + j].pop;
                }
            }
            document.querySelector(".dailypop" + (i+1)).textContent = currPOP * 100 + "%";

        }
        
    },
    search: function(){
        this.fetchWeather(document.querySelector(".search-bar").value);
        this.fetchHourlyForecast(document.querySelector(".search-bar").value);
        this.fetchDailyForecast(document.querySelector(".search-bar").value);
    }
};
document.querySelector(".searchbtn").addEventListener("click", function(){
    weather.search();
});
document.querySelector(".search-bar").addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        weather.search();
    }
})

function getImage(key){
    let value;
    if(key == "01d" || key == "01n"){
        value = "conditions/clear.png"
    }
    else if(key == "02d" || key == "02n"){
        value = "conditions/partly.png"
    }
    else if(key == "03d" || key == "03n"){
        value = "conditions/clouds.png"
    }
    else if(key == "04d" || key == "04n"){
        value = "conditions/clouds.png"
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

weather.fetchWeather("Chicago");
