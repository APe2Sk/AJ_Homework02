// Task 1 & 2
let button = document.getElementsByTagName("button")[0];
let table = document.getElementsByTagName("table")[0];
let th1 = document.getElementsByTagName("th")[0];
let th2 = document.getElementsByTagName("th")[1];
let th3 = document.getElementsByTagName("th")[2];
let th4 = document.getElementsByTagName("th")[3];
let thead = document.getElementsByTagName("thead")[0];

table.style.border = "1px solid black";

let urlInput = "https://swapi.dev/api/planets/?page=";

// Pravenje na povik
async function callAPI(url) {    
    try {
        let result = await fetch(url);
        let body =  await result.json(); 
        print(body.results);        
    }
    catch (err) {
        console.log("Error, pleaase try again later.")
    }
}

// Kreiranje na tabeli
let print = (planeti10) => {   

    let tbody = document.createElement("tbody");
    table.appendChild(tbody);

    for (let planet of planeti10) {
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

        td1.textContent = `${planet.name}`;
        td2.textContent = `${planet.population}`;
        td3.textContent = `${planet.climate}`;
        td4.textContent = `${planet.gravity}`;

        td1.style.border = "1px solid black";
        td2.style.border = "1px solid black";
        td3.style.border = "1px solid black";
        td4.style.border = "1px solid black";

    }
}

// Prvo generiranje
button.addEventListener("click", function() {
    callAPI(`${urlInput}1`);
    button.style.display = "none";
    buttonNext10.style.display = "block";
}, 
{once : true}
);

// kreiranje vo HTML na kopce 2 za Next 10 planets i event lisener stavanje
let buttonNext10 = document.createElement("button");
buttonNext10.textContent = "Next 10";
table.after(buttonNext10);
buttonNext10.style.display = "none";

buttonNext10.addEventListener("click", () => {
    document.getElementsByTagName("tbody")[0].remove();
    callAPI(`${urlInput}2`);
    buttonNext10.style.display = "none";
    buttonPrevious10.style.display = "block";
})

// kreiranje vo HTML na kopce 3 za Next 10 planets i event lisener stavanje
let buttonPrevious10 = document.createElement("button");
buttonPrevious10.textContent = "Previous 10";
table.after(buttonPrevious10);
buttonPrevious10.style.display = "none";

buttonPrevious10.addEventListener("click", () => {
    document.getElementsByTagName("tbody")[0].remove();
    callAPI(`${urlInput}1`);
    buttonPrevious10.style.display = "none";
    buttonNext10.style.display = "block";
})