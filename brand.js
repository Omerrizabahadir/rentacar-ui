const jwtToken = localStorage.getItem('jwtToken');
const BASE_PATH = "http://localhost:8080/"

function getAllBrand(){

    fetch(BASE_PATH + "brand", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        }
    }).then(response => {
        if(!response.ok){
            throw new Error("Failed to get brands, response status : ", response.status)
        }
        return response.json();
    }).then(brands => {
        displayBrands(brands)
    }).catch(error => {
        console.error('Error : ', error);
    });
}
function displayBrands(brands){
    const brandTableBody = document.getElementById('brandTableBody');
    brandTableBody.innerHTML = "";
    brands.forEach(brand => {
        const row = brandTableBody.insertRow();
        row.innerHTML = `
        <td>${brand.id}</td> 
        <td>${brand.name}</td>
        <td>
            <button class="btn btn-warning" onclick = "updateBrand(${brand.id})">Update</button>
            <button class="btn btn-danger" onclick="deleteBrand(${brand.id})">Delete</button>
        </td>
      `;
    });
}

/*-----------------add brand---------------*/
/*ister onclick="addBrand()"" ile bunu yaparsın veya butona tıklayınca dinleyerek ->addEventListener('DOMContentLoaded') içine yazdım */
/*async function addBrand() {
    const brandName = document.getElementById('brandName').value;

    fetch(BASE_PATH + "brand/create", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        },
        body: JSON.stringify({ name: brandName})
    }).then(response => {
        if(!response.ok){
            throw new Error("An error occurred while adding a brand.")
        }
        return response.json();
    }).then(brand => {
        getAllBrand();
        console.log(brand);
    }).catch (error => {
        console.error("Error : ", error);
    })
}
*/
document.addEventListener('DOMContentLoaded', async () => {
    await getAllBrand();

    document.getElementById('addBrandBtn').addEventListener("click", function () { //addEventListener da onclick="addBrand()" sil ve butonın id 'sini ekle buraya
        const brandName = document.getElementById('brandName').value; 

        fetch(BASE_PATH + "brand/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            },
            body: JSON.stringify({ name: brandName })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("An error occurred while adding a brand.");
            }
            return response.json();
        })
        .then(brand => {
            getAllBrand(); // Yeni markayı listele
            console.log(brand);
        })
        .catch(error => {
            console.error("Error: ", error);
        });
    });
});
