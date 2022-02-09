
async function getData() {
    try {
        let response = await fetch ("https://raw.githubusercontent.com/sedc-codecademy/skwd9-04-ajs/main/Samples/students_v2.json");
        let data = await response.json();

        return data;
    }
   catch {
       alert("Error. Please try again later");
   }
}

async function getGrade(students) {
    let arrays = await students;
    let above3 = arrays.filter(student => student.averageGrade > 3);
    console.log(above3);
}

// Printing the students with average grade above 3
getGrade(getData());

async function femaleAverageGrade(students) {
    let arrays = await students;
    let above5Female = arrays.filter(student => student.averageGrade === 5)
    .filter(student => student.gender==="Female");
    
    let sorting = [...above5Female];
    sorting.sort((curr, next) => next.age - curr.age);

    console.log(sorting);
}

// All females with averagegrade above 5 and are sorted in descending order
femaleAverageGrade(getData());



async function maleSkopjeLegal(students) {
    let arrays = await students;
    let maleSkopje = arrays.filter(student => student.age > 18)
    .filter(student => student.gender ==="Male")
    .filter(student => student.city ==="Skopje")
    .map(student => student.firstName);

    console.log(maleSkopje);
}


//  All male student full names who live in Skopje and are over 18 years old
maleSkopjeLegal(getData());


async function averageGradeOver24Age(students) {
    let arrays = await students;
    let female24 = arrays.filter(student => student.age > 24)
    .filter(student => student.gender ==="Female");
    console.log(female24);

    let averagegradeFemale = female24.reduce((sum, ocena) => sum += ocena.averageGrade, 0);
    let averageResult = averagegradeFemale / female24.length;
    
    console.log(averageResult);
}

//The average grades of all female students over the age of 24
averageGradeOver24Age(getData());


async function nameWithB(students) {
    let arrays = await students;
    let above5Male = arrays.filter(student => student.averageGrade > 2)
    .filter(student => student.gender==="Male")
    .map(student => student.firstName);

    let names = [];
    above5Male.forEach(name => {
        if(name[0] === "B") {
            names.push(name);
        }
    });
    console.log(names);
}


// All male students with a name starting with B and average grade over 2
nameWithB(getData());