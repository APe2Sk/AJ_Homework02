let statisticButtom = document.getElementById("statistic");
let hourlyButtom = document.getElementById("hourly");

let searchInput = document.getElementById("inputSearch");
let searchButtom = document.getElementById("searchButtom");

let statisticData = document.getElementById("statisticData");
let hourlyData = document.getElementById("hourlyData");

// povik
async function getData(city) {
    let result = 
    await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=d1641207363eaff198d8e386f23960c8`);
    let data = await result.json();
    return data;

}


// Switch na strana Statitistic
hourlyData.style.display = "none";
statisticData.style.display = "none";


statisticButtom.addEventListener("click", function() {
    hourlyData.style.display = "none";
    statisticData.style.display = "flex";
    statisticData.style.justifyContent = "center";

})

// Switch na strana Hourly
hourlyButtom.addEventListener("click", function() {
    statisticData.style.display = "none";
    hourlyData.style.display = "flex";
    hourlyData.style.justifyContent = "center";
})


// Zimanje na podatoci so KOPCE
searchButtom.addEventListener("click", async function() {
    if (searchInput.value.length < 1) {
        alert("You did not entered any city");
        return;
    }
    console.log(searchInput.value);
    let response = null;

    try {
        response = await getData(searchInput.value);
    }
    catch (error) {
        console.log(error);
    }

    searchInput.value = "";
    
    console.log(response);
    let responseData = await extractData(response);
    printstatistics(responseData);
    printHourly(responseData);
    // i tuka pustame funkcii
})

// Zimanje podatoci so ENTER
searchInput.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      searchButtom.click();
    }
  });


// Get the required data - Statistics
async function extractData(dataFromCall) {
    let data = await dataFromCall;
    let weatherData = data.list;
    // console.log(weatherData);

    let dataForUsage = {};
    // data for Houly tab
    dataForUsage.weatherDescription = weatherData.map(info => info.weather[0]).map(infoDescription => infoDescription.description);
    dataForUsage.timeMeasured = weatherData.map(info => info.dt_txt);
    // niza od maksimalni temperaturi i minimalni za sekoe merenje
    dataForUsage.temperatureMax = weatherData.map(info => info.main).map(temperature => temperature.temp_max);
    dataForUsage.temperatureMin = weatherData.map(info => info.main).map(temperature => temperature.temp_min);
    dataForUsage.humidity = weatherData.map(info => info.main).map(temperature => temperature.humidity);
    dataForUsage.windSpeed = weatherData.map(info => info.wind).map(windDetailedInfo => windDetailedInfo.speed);

    dataForUsage.temperature_Calc = await temperatureCalculations(dataForUsage);
    dataForUsage.humidity_Calc = await humidityCalculations(dataForUsage);

    return dataForUsage;
}

async function temperatureCalculations(object) {
    let temperatureInfo = {};
    
    // data for average temp in the day
    // this below is max temperature in the following days
    temperatureInfo.maxTemperatureOfAllDays = null;
    object.temperatureMax.forEach((maxTemp) => {
        if (temperatureInfo.maxTemperatureOfAllDays < maxTemp) {
            temperatureInfo.maxTemperatureOfAllDays = maxTemp;
        }
    });

    temperatureInfo.minTemperatureOfAllDays =  Math.min(...object.temperatureMin);
    
    let sumMax = object.temperatureMax.reduce((sum, maxNumbers) => sum += maxNumbers, 0);
    let sumMin = object.temperatureMin.reduce((sum, minNumbers) => sum += minNumbers, 0);
    let averageTemp = (sumMax + sumMin) / (object.temperatureMax.length*2);
    temperatureInfo.averageTempRounded = Math.round(averageTemp * 100) / 100;

    // Calculate hottest days
    let indexOfHotestDay = object.temperatureMax.indexOf(temperatureInfo.maxTemperatureOfAllDays);
    temperatureInfo.hottestDay = object.timeMeasured[indexOfHotestDay];

    // Calculate coldest days
    let indexOfColdestDay = object.temperatureMin.indexOf(temperatureInfo.minTemperatureOfAllDays);
    temperatureInfo.coldestDay = object.timeMeasured[indexOfColdestDay];
    return temperatureInfo;
}

async function humidityCalculations(object) {
    let humidityInfo = {};
    
    // data for average temp in the day
    // this below is max temperature in the following days
    humidityInfo.maxHumidityOfAllDays = null;
    object.humidity.forEach((humid) => {
        if (humidityInfo.maxHumidityOfAllDays < humid) {
            humidityInfo.maxHumidityOfAllDays = humid;
        }
    });

    humidityInfo.minHumidityOfAllDays =  Math.min(...object.humidity);
    
    let sum = object.humidity.reduce((sum, humidity) => sum += humidity, 0);
    let averageHumidity = sum / (object.humidity.length);
    humidityInfo.averageHumidityRounded = Math.round(averageHumidity * 1) / 1;
    return humidityInfo;
}


async function printstatistics(data) {

    // Temperature
    let hourlyReceivedData = await data;
    let maxTemp = hourlyReceivedData.temperature_Calc.maxTemperatureOfAllDays;
    let minTemp = hourlyReceivedData.temperature_Calc.minTemperatureOfAllDays;
    let averageTemp = hourlyReceivedData.temperature_Calc.averageTempRounded;
    console.log(hourlyReceivedData);

    let ul = document.createElement("ul");
    let liMax = document.createElement("li");
    let liAve = document.createElement("li");
    let liMin = document.createElement("li");
    
    document.getElementById("averageTempInfo").appendChild(ul);
    ul.appendChild(liMax);
    ul.appendChild(liAve);
    ul.appendChild(liMin);

    liMax.textContent = `Maximum temperature: ${maxTemp} ℃`;
    liAve.textContent = `Average temperature: ${averageTemp} ℃`;
    liMin.textContent = `Minimum temperature: ${minTemp} ℃`;  


    // Humidity
    let maxHumid = hourlyReceivedData.humidity_Calc.maxHumidityOfAllDays;
    let averageHumid = hourlyReceivedData.humidity_Calc.averageHumidityRounded;
    let minHumid = hourlyReceivedData.humidity_Calc.minHumidityOfAllDays;

    let ulH = document.createElement("ul");
    let liMaxH = document.createElement("li");
    let liAveH = document.createElement("li");
    let liMinH = document.createElement("li");
    
    document.getElementById("averageHumidInfo").appendChild(ulH);
    ulH.appendChild(liMaxH);
    ulH.appendChild(liAveH);
    ulH.appendChild(liMinH);

    liMaxH.textContent = `Maximum humidity: ${maxHumid} %`;
    liAveH.textContent = `Average humidity: ${averageHumid} %`;
    liMinH.textContent = `Minimum humidity: ${minHumid} %`;  


    // Coldest and warmest day 
    let dayColdestPrint = hourlyReceivedData.temperature_Calc.coldestDay;
    let dayWarmestPrint = hourlyReceivedData.temperature_Calc.hottestDay;

    let p_coldestDay = document.createElement("p");
    document.getElementById("averageTempInfo").appendChild(p_coldestDay);

    let p_warmestDay = document.createElement("p");
    document.getElementById("averageTempInfo").appendChild(p_warmestDay);

    p_coldestDay.textContent = `The coldest time in the following 5 days will be: ${dayColdestPrint}`;
    p_warmestDay.textContent = `The warmest time in the following 5 days will be: ${dayWarmestPrint}`;

    console.log(dayColdestPrint, dayWarmestPrint);
}


async function printHourly(data) {
    let statisticsReceivedData = await data;
    let dataTable = [];

    //create table
    let table = document.createElement("table");
    document.getElementById("hourlyData").appendChild(table);
    let thead = document.createElement("thead");
    table.appendChild(thead);
    let th1 = document.createElement("th");
    let th2 = document.createElement("th");
    let th3 = document.createElement("th");
    let th4 = document.createElement("th");
    let th5 = document.createElement("th");
    let th6 = document.createElement("th");

    thead.appendChild(th1);
    thead.appendChild(th2);
    thead.appendChild(th3);
    thead.appendChild(th4);
    thead.appendChild(th5);
    thead.appendChild(th6);

    th1.textContent = "Weather";
    th2.textContent = "Description of the weather";
    th3.textContent = "Date and time of the measurements";
    th4.textContent = "Temperature (℃)";
    th5.textContent = "Humidity (%)";
    th6.textContent = "Wind Speed (m/s)";

    let tbody = document.createElement("tbody");
    table.appendChild(tbody);

    let description = statisticsReceivedData.weatherDescription;
    dataTable.push(description);
    let dateAndTime = statisticsReceivedData.timeMeasured;
    dataTable.push(dateAndTime);
    let temperatureMax = statisticsReceivedData.temperatureMax;
    dataTable.push(temperatureMax);    
    let temperatureMin = statisticsReceivedData.temperatureMin;
    dataTable.push(temperatureMin);    
    let humidity = statisticsReceivedData.humidity;
    dataTable.push(humidity);    
    let windSpeed = statisticsReceivedData.windSpeed;
    dataTable.push(windSpeed);    

    for (let i = 0; i < 40; i++) {
        let tr = document.createElement("tr");
        tbody.appendChild(tr);

        let td1 = document.createElement("td");
        tr.appendChild(td1);
        let td2 = document.createElement("td");
        tr.appendChild(td2);
        let td3 = document.createElement("td");
        tr.appendChild(td3);
        let td4 = document.createElement("td");
        tr.appendChild(td4);
        let td5 = document.createElement("td");
        tr.appendChild(td5);
        let td6 = document.createElement("td");
        tr.appendChild(td6);

        td1.textContent = ``;
        td2.textContent = `${description[i]}`;
        td3.textContent = `${dateAndTime[i]}`;
        td4.textContent = `${temperatureMax[i]} ℃ (${temperatureMin[i]} ℃)`;
        td5.textContent = `${humidity[i]} %`;
        td6.textContent = `${windSpeed[i]} m/s`;
    }



    console.log(dataTable);


    console.log(statisticsReceivedData);

}