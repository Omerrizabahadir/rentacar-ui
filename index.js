const jwtToken = localStorage.getItem("jwtToken");
const customerId = localStorage.getItem("customerId");

const BASE_PATH = "http://localhost:8080/"



async function fetchBrands(){
    
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
    const brandSelect = document.getElementById('brandSelect');
    brandSelect.innerHTML = '';

    brands.forEach(brand => {
        const option = document.createElement("option");
        option.value = brand.id;
        option.text = brand.name;
        brandSelect.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", async function () {
   await fetchBrands();
})