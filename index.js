// // Homework 1 
// let input = document.getElementsByTagName("input")[0];
// let search = document.getElementsByTagName("button")[0];

// let movies = ['The Matrix', 'The Shawshank Redemption', 'The Godfather', 'The Dark Knight', 'The Lord of the Rings', 'Inception',
//  'James Bond 007', 'Seven', 'Spider-Man', 'Iron man', 'Thor', 'Star Wars', 'Harry Potter', 'Chenobyl', 'The Hangover', 'Horrible Bosses'];

// function findMovie(movie) {
//     return movie.toLowerCase() == input.value.toLowerCase();
// }

// function createText(output) {
//     if (output !== undefined) {
//         let h1 = document.createElement("h1");
//         h1.innerText = "The movie can be rented";
//         h1.style.color = "green";
//         search.after(h1);
//     } else {
//         let h1 = document.createElement("h1");
//         h1.innerText = "The movie can't be rented";
//         h1.style.color = "red";
//         search.after(h1);
//     }
// }

// function checkInput(inputData) {
//     if(inputData.length > 1) {
//         let result = movies.find(movie => findMovie(movie));
//         createText(result);
//     }
//     else {
//         alert("You did not entered a correct movie name!");
//     }
// }

// search.addEventListener("click", function() {
//     checkInput(input.value);
//     input.value = "";
// })



// Homework 2
let title = document.getElementById("title");
let priority = document.getElementById("priority");
let color = document.getElementById("color");
let description = document.getElementById("description");
let add = document.getElementById("add");
let showReminders = document.getElementById("showReminders");
let hide = document.getElementById("hide");

let dataBaseReminders = [];

function tableF() {
    let table = document.createElement("table");
    showReminders.after(table);
    let thead = document.createElement("thead");
    table.appendChild(thead);
    let th1 = document.createElement("th");
    thead.appendChild(th1);
    let th2 = document.createElement("th");
    thead.appendChild(th2);
    let th4 = document.createElement("th");
    thead.appendChild(th4);
    th1.innerText = "Title";
    th2.innerText = "Priority";
    th4.innerText = "Description";
    table.style.border = "1px solid black";

    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    table.style.display = 'none';
}
tableF();

function Reminder(titleInput, priorityInput, colorInput, descriptionInput) {
    this.title = titleInput;
    this.priority = priorityInput;
    this.color = colorInput;
    this.description = descriptionInput;
}

function createTable(objects) {
    let tbodyF = document.getElementsByTagName("tbody")[0];
    tbodyF.innerHTML = "";    

    for(object of objects) {
        let tr = document.createElement("tr");
        tbodyF.appendChild(tr);
        let td1 = document.createElement("td");
        tbodyF.appendChild(td1);
        td1.innerText = `${object.title}`;
        let td2 = document.createElement("td");
        tbodyF.appendChild(td2);
        td2.innerText = `${object.priority}`;
        let td4 = document.createElement("td");
        tbodyF.appendChild(td4);
        td4.innerText = `${object.description}`;

        td1.style.color = `${object.color}`;
        
        td1.style.border = "1px solid black";
        td2.style.border = "1px solid black";
        td4.style.border = "1px solid black";
    }
}

function validateData(titleInput, priorityInput, colorInput) {
    if (titleInput < 1 || priorityInput < 1 || colorInput < 1) {
        return false;
    } else {
        return true;
    }
}

add.addEventListener("click", function() {
    if (validateData(title.value, priority.value, color.value) == true) {
    let newReminder = new Reminder(title.value, priority.value, color.value, description.value);
    dataBaseReminders.push(newReminder);
    createTable(dataBaseReminders);   
    }
    title.value = "";
    priority.value = "";
    color.value = "";
    description.value = "";
})

showReminders.addEventListener("click", function() {
    document.getElementsByTagName("table")[0].style.display = '';
})

hide.addEventListener("click", function() {
    document.getElementsByTagName("table")[0].style.display = 'none';
})