let statisticButtom = document.getElementById("statistic");
let hourlyButtom = document.getElementById("hourly");

let searchInput = document.getElementById("inputSearch");
let searchButtom = document.getElementById("searchButtom");

let statisticData = document.getElementById("statisticData");
let hourlyData = document.getElementById("hourlyData");

// povik
async function getData(city) {
    try {
        let result = 
        await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=d1641207363eaff198d8e386f23960c8`);
        let data = await result.json();
        return data;
    }
    catch (e) {
        document.getElementById("errorMessage").innerHTML = e.message;
    }

}


// Switch na strana Statitistic
hourlyData.style.display = "none";
statisticData.style.display = "none";
statisticButtom.style.display = "none";
hourlyButtom.style.display = "none";

// document.getElementById("homeIdImg").addEventListener("click", function(){
//     document.getElementById("cityName").style.display = "none";
//     console.log()
// })

function showHourylyData() {
    statisticData.style.display = "none";
    hourlyData.style.display = "flex"; 
    hourlyData.style.justifyContent = "center";
    document.getElementsByClassName("card")[0].style.display = "none";
    document.getElementsByClassName("card")[1].style.display = "none";
    document.getElementsByClassName("card")[2].style.display = "none";
    document.getElementById("cityName").style.display = "flex";

}

async function statAndHourly(r) {
    let res = await r;
    if (res.message != "city not found") {
        statisticButtom.addEventListener("click", function() {
            hourlyData.style.display = "none";
            statisticData.style.display = "flex";
            statisticData.style.justifyContent = "center";
            document.getElementsByClassName("card")[0].style.display = "none";
            document.getElementsByClassName("card")[1].style.display = "none";
            document.getElementsByClassName("card")[2].style.display = "none";
            document.getElementById("cityName").style.display = "flex";
        })

        // Switch na strana Hourly
        hourlyButtom.addEventListener("click", function() {
            showHourylyData();

        })
    }
}


// Zimanje na podatoci so KOPCE
searchButtom.addEventListener("click", async function() {
    console.log(searchInput.value);
    let response = null;

    response = await getData(searchInput.value);
    if (searchInput.value.length < 1 || response.message == "city not found") {
        document.getElementById("errorMessage").innerHTML = "You did not entered a valid city";
        return;
    }

    document.getElementById("errorMessage").style.display = "none";
    statAndHourly(response);

    searchInput.value = "";
    
    console.log(response);
    let responseData = await extractData(response);
    console.log(responseData);

    printstatistics(responseData);
    createTable(responseData);
    showHourylyData();

    console.log(response.city.name);
    document.getElementById("cityName").textContent = `Weather data for ${response.city.name}`;

    statisticButtom.style.display = "inline-block";
    hourlyButtom.style.display = "inline-block";

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
    let iconCode = weatherData.map(ic => ic.weather[0]).map(code => code.icon);

    dataForUsage.image = await getIcon(iconCode);
    // console.log(dataForUsage.image);
    return dataForUsage;
}

async function getIcon(codes) {
    let images=[];
    for(let i = 0; i < codes.length; i++){
        let codeCalls = await fetch (`http://openweathermap.org/img/w/${codes[i]}.png`);
        images.push(codeCalls.url);
    }
    // console.log(images)
    return images;
}

// Vadenje na podatoci za temperatura i se pusta na ExtractData funkcijata
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

// Vadenje na podatoci za jumidity i se pusta na ExtractData funkcijata
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

    document.getElementById("averageTempInfo").innerHTML = "";
    document.getElementById("averageHumidInfo").innerHTML = "";

    // Temperature
    let hourlyReceivedData = await data;
    let maxTemp = hourlyReceivedData.temperature_Calc.maxTemperatureOfAllDays;
    let minTemp = hourlyReceivedData.temperature_Calc.minTemperatureOfAllDays;
    let averageTemp = hourlyReceivedData.temperature_Calc.averageTempRounded;
    // console.log(hourlyReceivedData);

    let ul = document.createElement("ul");
    ul.setAttribute("class", "removeElement");
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
    ulH.setAttribute("class", "removeElement");
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
    p_coldestDay.setAttribute("class", "removeElement");
    p_warmestDay.textContent = `The warmest time in the following 5 days will be: ${dayWarmestPrint}`;
    p_warmestDay.setAttribute("class", "removeElement");

    // console.log(dayColdestPrint, dayWarmestPrint);
}

function createTable(data) {
    let weatherData = data;
    let weatherTable = document.getElementById("weatherTable");
    if(weatherTable == null){
        weatherTable = document.createElement("table");
        weatherTable.setAttribute("id", "weatherTable");
        weatherTable.setAttribute("class", "table table-bordered table-hover");
        document.getElementById("tableDiv").appendChild(weatherTable);
    }
    else {
        // console.log(weatherTable);
        weatherTable.innerHTML = "";
    }
    
    // console.log(weatherTable);
    let thNamesScreen = ["", "Weather description", "Time measured", "Max temperature (℃)", "Min temperature (℃)", "Humidity (%)", "Wind (m/s)"];
    let thNames = ["image", "weatherDescription", "timeMeasured", "temperatureMax", "temperatureMin", "humidity", "windSpeed"];

    createHead(weatherTable, thNamesScreen);

    createBody(weatherTable, weatherData, thNames);

}

function createHead(table, tableColumns) {

    let thead = document.createElement("thead");
    table.appendChild(thead);
    thead.setAttribute("class", "thead-dark")
    tableColumns.forEach(name => {
        let th = document.createElement("th");
        th.setAttribute("scope", "col")
        th.textContent = name;
        thead.appendChild(th);
    })
}

function createBody(table, data, dataColumns) {
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);

    // console.log(dataToPrint["timeMeasured"][0]);

    for(let i = 0; i < data.weatherDescription.length; i++) {
        let tr = document.createElement("tr");
        tbody.appendChild(tr);
        tr.setAttribute("class", "bg-white");

        dataColumns.forEach(y => {
            // y.forEach(s)
            if (y == 'image') {
                let td = document.createElement("td");
                tr.appendChild(td);
                // td.setAttribute("class", "bg-white");
                let img = document.createElement("img");
                td.appendChild(img);
                // console.log(data[y]);
                // console.log(data[y][0]);
                img.setAttribute('src', data[y][i]);
            } else {
                let td = document.createElement("td");
                tr.appendChild(td);
                td.textContent = data[y][i];
            }
        })
    }
}

// manipulation with cards
document.getElementsByClassName("home")[0].addEventListener("click", function () {
    document.getElementsByClassName("card")[0].style.display = "flex";
    document.getElementsByClassName("card")[1].style.display = "flex";
    document.getElementsByClassName("card")[2].style.display = "flex";
    hourlyData.style.display = "none";
    statisticData.style.display = "none";
    document.getElementById("cityName").style.display = "none";
})
document.getElementById("homeID").addEventListener("click", function () {
    document.getElementsByClassName("card")[0].style.display = "flex";
    document.getElementsByClassName("card")[1].style.display = "flex";
    document.getElementsByClassName("card")[2].style.display = "flex";
    hourlyData.style.display = "none";
    statisticData.style.display = "none";
    document.getElementById("cityName").style.display = "none";

})

// putting img on cards
document.getElementById("searchSkopje").addEventListener("click", async function() {
    response = await getData("skopje");
    statAndHourly(response);
    let responseData = await extractData(response);
    printstatistics(responseData);
    createTable(responseData);
    showHourylyData();
    document.getElementById("cityName").textContent = `Weather data for ${response.city.name}`;
    statisticButtom.style.display = "inline-block";
    hourlyButtom.style.display = "inline-block";
})
document.getElementById("searchThessaloniki").addEventListener("click", async function() {
    response = await getData("Thessaloniki");
    statAndHourly(response);
    let responseData = await extractData(response);
    printstatistics(responseData);
    createTable(responseData);
    showHourylyData();
    document.getElementById("cityName").textContent = `Weather data for ${response.city.name}`;
    statisticButtom.style.display = "inline-block";
    hourlyButtom.style.display = "inline-block";
})
document.getElementById("searchSofia").addEventListener("click", async function() {
    response = await getData("Sofia");
    statAndHourly(response);
    let responseData = await extractData(response);
    printstatistics(responseData);
    createTable(responseData);
    showHourylyData();
    document.getElementById("cityName").textContent = `Weather data for ${response.city.name}`;
    statisticButtom.style.display = "inline-block";
    hourlyButtom.style.display = "inline-block";

})


// async function threeCities(oneOfThree) {
//     response = await getData(oneOfThree);
//     statAndHourly(response);
//     let responseData = await extractData(response);
//     printstatistics(responseData);
//     createTable(responseData);
//     showHourylyData();
//     document.getElementById("cityName").textContent = `Weather data for ${response.city.name}`;
//     statisticButtom.style.display = "inline-block";
//     hourlyButtom.style.display = "inline-block";
// }

// document.getElementById("searchSofia").addEventListener("click", async function() {
//     if(homeCities === "Skopje") {
//         threeCities("Skopje")
//     } else if(homeCities === "Thessaloniki") {
//         threeCities("Thessaloniki");
//     } else if(homeCities === "Sofia") {
//         threeCities("Sofia");
//     }
// })


//putting cards images
let cities = ['Skopje', 'Thessaloniki', 'Sofia'];
let idCity = ["imgSkopje", 'imgThessaloniki', 'imgSofia'];
let idStepen = ["stepenSK", "stepenTH", "stepenSO"];

async function iconsOnCities(citityArr, idGrad, idC) {
    for (let i = 0; i < citityArr.length; i++) {


    response = await getData(citityArr[i]);
    let responseData = await extractData(response);
    document.getElementById(idGrad[i]).setAttribute("src", responseData.image[0]);
    document.getElementById(idStepen[i]).textContent = `${responseData.temperatureMax[0]} ℃`;

    }
}
iconsOnCities(cities, idCity, idStepen);