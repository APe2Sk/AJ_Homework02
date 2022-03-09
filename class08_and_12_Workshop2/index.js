let inputField = document.getElementById("searchCountry");
let submitButton = document.getElementById("submit");

let url = "https://restcountries.com/v3.1/name/";

async function getData(api, city) {
    try {
        let result = await fetch(`${api}${city}`);
        let data = await result.json();
        console.log(data);
        return data;
    }
    catch (error) {
        alert("You entered invelid city");
    }

}

submitButton.addEventListener("click", async () => {
    if(inputField.value.length < 1) {
        alert("Please enter one or more letters in order to search a country");
        inputField.value = "";
        return;
    }
    showImg();
    let dataFromApi = await getData(url, inputField.value);
    inputField.value = "";

    createTable();
    fillTheTable(dataFromApi);
    createSortButtom(dataFromApi);
})

function createTable() {
    let theadNames = ["Flag", "Name", "Population", "Capital", "Area", "Languages", "Currency names"];
    if(document.getElementById("table")) {
        document.getElementById("table").innerHTML = "";
    }
    let table = document.getElementById("table");
    let thead = document.createElement("thead");
    table.appendChild(thead);
    
    theadNames.forEach(name => {
        let th = document.createElement("th");
        thead.appendChild(th);
        th.textContent = name;
    })
    
}

//Loading IMG
function showImg() {
    if(document.getElementById("loader")) {
        document.getElementById("loader").style.display = 'flex';
        return;
    }
    let imgLoader = document.createElement("img");
    document.getElementById("data").appendChild(imgLoader);
    imgLoader.setAttribute("id", "loader");
    imgLoader.setAttribute("src", `https://upload.wikimedia.org/wikipedia/commons/2/29/Loader.gif`);
}

function extractData(response) {
    let data = response;
    let sumOfArr = [];
    data.forEach(country => {
        let dataArr = [];

        let languages = Object.values(country.languages);
        // console.log(Object.values(country.currencies)[0].name);
        console.log(languages);

        dataArr.push(country.flags.png);
        dataArr.push(country.altSpellings[1]);
        dataArr.push(country.population);
        if(country.capital !== undefined) {
            dataArr.push(country.capital[0]);
        } else {
            dataArr.push("n/a");
        }
        dataArr.push(country.area);
        let langArr = [];
        languages.forEach((language, index) => {
            if(index === languages.length - 1) {
                langArr += `${language}`;    
            }
            else {
                langArr += `${language}, `;   
            }                 
        })
        dataArr.push(langArr);
        dataArr.push((Object.values(country.currencies)[0].name));

        sumOfArr.push(dataArr);
        console.log(sumOfArr);
    })
    return sumOfArr;
}

function fillTheTable(response) {
    let data = response;
    // let dataNames = ["flags", "altSpellings", "population", "capital", "area"];

    document.getElementById("loader").style.display = 'none';
    // console.log(document.getElementById("loader"));

    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    console.log(data);
    let countryArr = extractData(response);

    // Create table
    countryArr.forEach(country => {
        let tr = document.createElement("tr");
        tbody.appendChild(tr);

        let td1 = document.createElement("td");
        tr.appendChild(td1);
        let img = document.createElement("img");
        td1.appendChild(img);
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
        let td7 = document.createElement("td");
        tr.appendChild(td7);

        img.setAttribute("src", `${country[0]}`);
        img.setAttribute("width", `100px`);
        td2.textContent = `${country[1]}`;
        td3.textContent = `${country[2]}`;
        td4.textContent = `${country[3]}`;
        td5.textContent = `${country[4]}`;
        td6.textContent = `${country[5]}`;
        td7.textContent = `${country[6]}`;

    })

    
}

// Old function
// function fillTheTable(response) {
//     let data = response;
//     // let dataNames = ["flags", "altSpellings", "population", "capital", "area"];

//     document.getElementById("loader").style.display = 'none';
//     // console.log(document.getElementById("loader"));

//     let tbody = document.createElement("tbody");
//     table.appendChild(tbody);
//     console.log(data);

//     // Create table
//     data.forEach(country => {
//         let tr = document.createElement("tr");
//         tbody.appendChild(tr);

//         let td1 = document.createElement("td");
//         tr.appendChild(td1);
//         let img = document.createElement("img");
//         td1.appendChild(img);
//         let td2 = document.createElement("td");
//         tr.appendChild(td2);
//         let td3 = document.createElement("td");
//         tr.appendChild(td3);
//         let td4 = document.createElement("td");
//         tr.appendChild(td4);
//         let td5 = document.createElement("td");
//         tr.appendChild(td5);
//         let td6 = document.createElement("td");
//         tr.appendChild(td6);
//         let td7 = document.createElement("td");
//         tr.appendChild(td7);

//         let languages = Object.values(country.languages);
//         // console.log(Object.values(country.currencies)[0].name);
//         console.log(languages);


//         img.setAttribute("src", `${country.flags.png}`);
//         img.setAttribute("width", `100px`);
//         td2.textContent = `${country.altSpellings[1]}`;
//         td3.textContent = `${country.population}`;
//         // check if has data capital
//         if(country.capital !== undefined) {
//             td4.textContent = `${country.capital[0]}`;
//         } else {
//             td4.textContent = `n/a`;
//         }
//         td5.textContent = `${country.area}`;        

//         // fill the data for languages
//         languages.forEach((language, index) => {
//             if(index === languages.length - 1) {
//                 td6.textContent += `${language}`;    
//             }
//             else {
//                 td6.textContent += `${language}, `;   
//             }                 
//         })
//         td7.textContent = `${(Object.values(country.currencies)[0].name)}`;       
//     })
// }

function createSortButtom(data) {    
    console.log(document.getElementsByTagName("th"));
    let button = document.createElement("button");
    document.getElementsByTagName("th")[1].appendChild(button);
    button.textContent = 'Sort';
    button.setAttribute("id", "sort");

    let buttonSort = document.getElementById("sort");
    console.log(buttonSort);

    buttonSort.addEventListener("click", async function() {
        // let dataFromApi = await getData(url, inputField.value);
        console.log(extractData(data));
        sortTableAsc(extractData(data));
    });
}


function sortTableAsc(data) {
    data.sort((curr, next) => {
        if(curr[1] > next[1]) {
            return 1;
        }
        if (next[1] > curr[1]) {
            return -1;
        }
        return 0;
    });

    fillTheTable(data);
}
