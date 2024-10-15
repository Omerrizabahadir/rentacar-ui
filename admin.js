    const BASE_PATH = "http://localhost:8080/"
    const BASE_IMAGE_PATH = "/Users/macbook/Documents/GitHub/rentacar/"
    const jwtToken = localStorage.getItem('jwtToken');

    

    async function addCar(){

        const carBrandId = document.getElementById('brandSelect').value;
        const fileInput = document.getElementById('carImage');
        const modelName = document.getElementById('modelName').value;
        const dailyPrice = document.getElementById('dailyPrice').value;
        const carAvailableStock = document.getElementById('carAvailableStock').value;
        const gearBox = document.getElementById('gearBox').value;
        const color = document.getElementById('color').value;
        const carStatus = document.getElementById('carStatus').value;
        const active = document.getElementById('carActive').checked;
        const isRented = document.getElementById('isRented').checked;
        const mileage = document.getElementById('mileage').value;

        const formData = new FormData();
        console.log("formData", formData)
        formData.append("file", fileInput.files[0]); // Yüklemek istediğiniz dosya
        formData.append("brandId", carBrandId); // Brand ID
        formData.append("modelName", modelName); // Model adı
        formData.append("color", color); // Renk
        formData.append("carStatus", carStatus); // Araç durumu
        formData.append("active", active); // Aktif mi
        formData.append("isRented", isRented); // Kiralandı mı
        formData.append("carAvailableStock", carAvailableStock); // Mevcut stok
        formData.append("gearBox", gearBox); // Vites türü
        formData.append("mileage", mileage); // Kilometre
        formData.append("dailyPrice", dailyPrice); // Günlük fiyat

        await fetch(BASE_PATH + "car/create", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + jwtToken
            },
            body: formData
        }).then(response => {
            if (!response.ok) {
                throw new Error("Car add request failed code status : " + response.status)
            }
           return response.json()

        }).then(data => {
            console.log(data)
            const modal = bootstrap.Modal.getInstance(document.getElementById('addCarModal'));
            modal.hide();
            getAllCars();

        }).catch(error => {
            console.error('Error:', error);
        });
    }
    async function getAllCars() {
        try{
            const response = await fetch(BASE_PATH + "car/all", {
                method: 'GET',
                headers: {
                    'Content-Type': 'aplication/json',
                    'Authorization': 'Bearer ' + jwtToken
                }
            });
            if(!response.ok){
                throw new Error("Failed to get cars, response status : " + response.status)
            }
            const carList = await response.json();
            console.log("carList : ", carList)
            await renderCarTable(carList);
        }catch(error){
            console.log("error : ", error)
        }
    }

    async function renderCarTable(carList) {
        const carTableBody = document.getElementById('carTableBody');
        carTableBody.innerHTML =  "";

        carList.forEach(car => {
           const row = carTableBody.insertRow();
           row.innerHTML = `
                <td>${car.brandId}</td>
                <td>${car.modelName}</td>
                <td>${car.color}</td>
                <td>${car.carStatus}</td>
                <td>${car.active ? "true" : "false"}</td>
                <td>${car.isRented ? "true" : "false"}</td>
                <td>${car.carAvailableStock}</td>
                <td>${car.gearBox}</td>
                <td>${car.mileage}</td>
                <td>${car.dailyPrice}</td>
                <td><img src = "${BASE_IMAGE_PATH}${car.image}" alt = ${car.modelName}" width = "100"></td>
                <td>
                <button class  = "btn btn-warning" onclick = "updateCar(${car.id})">Update</button>
                <button class  = "btn btn-danger" onclick = "deleteCar(${car.id})">Delete</button>
                </td>
                `;
        });
    }
    function deleteCar(carBrandId){

       const confirmed = confirm("Are u sure want to delete this car?");

        if(carBrandId !== 0) {
            console.log("carBrandId : ", carBrandId);
            
            fetch(BASE_PATH + "car/" + carBrandId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwtToken
                }
            }).then(response => {
                
                if(!response.ok){
                    throw new Error("Car delete request failed code status : " + response.status)
            }
            getAllCars();
            
        }).catch(error => {
            console.error('Error : ', error);
        });
    }
}
 
     document.addEventListener("DOMContentLoaded", async ()=> {
        await getAllCars();

       
     })