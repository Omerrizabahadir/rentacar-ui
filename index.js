const jwtToken = localStorage.getItem("jwtToken");
const customerId = localStorage.getItem("customerId");

const BASE_PATH = "http://localhost:8080/"
const BASE_IMAGE_PATH = "/Users/macbook/Documents/GitHub/rentacar/"



async function fetchBrands(){
        console.log(jwtToken);
    
       const response = await fetch(BASE_PATH + "brand", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        }
       });
       
       const data = await response.json();
       console.log(data);

       displayBrands(data)
    }

function displayBrands(brands){
    const brandSelect = document.getElementById("brandSelect");
    brandSelect.innerHTML = '';

    brands.forEach(brand => {
        const option = document.createElement("option");
        option.value = brand.id;
        option.text = brand.name;
        brandSelect.appendChild(option);
    });
}

function displayCars(cars){
    const carList = document.getElementById("carList");
    carList.innerHTML = '';
    cars.forEach( car => {
        const carCard = document.getElementById("div");
        carCard.classList.add("col-md-2", "mb-4");

        const carImage = document.createElement("img");
        carImage.src = BASE_IMAGE_PATH + car.image
        carImage.alt = car.name;
        carImage.style.maxWidth = "150px";
        carImage.style.maxHeight = "150px";

        const carBody = document.createElement("div");
        carBody.classList.add("card-body");
        carBody.innerHTML = `
        <h5 class = "card-title">${car.name}</h5>;
        <p class = "card-text">${car.dailyPrice}</p>
        <button class = "btn btn-primary" onclick = 'addToCard(${JSON.stringify(car)})'>Add to Card</button>
        `;
        carCard.appendChild(carImage);
        carCard.appendChild(carBody);

    });
}

async function fetchCarByBrand(brandId){
    const endPointUrl = BASE_PATH + "car/brand/" +brandId;
    try {
        const response = await fetch(endPointUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        });
        if(!response.ok){
            throw new Error("Failed to get cars by brand id, response.status : " + response.status)
        }
        const data = await response.json();
        console.log(data);
        
    }catch (error) {
        console.error("Error fetching cars : ", error);
        
    }
}
    

document.addEventListener("DOMContentLoaded", async function () {
    await fetchBrands();

    const brandSelect = document.getElementById("brandSelect");
    brandSelect.addEventListener("change", async function () {
        await fetchCarByBrand(brandSelect.value);
    });

    if (brandSelect.value) {
        await fetchCarByBrand(brandSelect.value);
    }
});
