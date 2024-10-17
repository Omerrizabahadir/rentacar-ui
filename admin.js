    const BASE_PATH = "http://localhost:8080/"
    const BASE_IMAGE_PATH = "/Users/macbook/Documents/GitHub/rentacar/"
    const jwtToken = localStorage.getItem('jwtToken');

    currentId = 0;

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
            
            hideCarModal('addCarModal');
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
                <button class  = "btn btn-danger" onclick="showCarModal(${car.id})"">Delete</button>
                </td>
                `;
        });
    }
    function deleteCar(){

        if(currentId !== 0) {
            console.log("carBrandId : ", currentId);
            
            fetch(BASE_PATH + "car/" + currentId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwtToken
                }
            }).then(response => {
                
                if(!response.ok){
                    throw new Error("Car delete request failed code status : " + response.status)
            }
            hideCarModal('deleteCarModal')
            getAllCars();
            
        }).catch(error => {
            console.error('Error : ', error);
        });
    }
}
    function showCarModal(carId){
        currentId = carId
        const deleteCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteCarModal'))
        deleteCarModal.show();
    }
    function hideCarModal(modalId){
        
        const addCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('addCarModal'));
        addCarModal.hide(); 
        
        const deleteCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById(modalId));
        deleteCarModal.hide();
    }
    function updateCar(carId){
        fetch(BASE_PATH + "car/" + carId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        }).then(response => {
            if(!response.ok) {
                throw new Error("Car add request failed code.status : " + response.response.status)
            } 
            return response.json();
        }).then(car => {
            document.getElementById('updateCarId').value = car.id;
            document.getElementById('updateModelName').value = car.modelName;
            document.getElementById('updateColor').value = car.color;
            document.getElementById('updateCarStatus').value = car.carStatus;
            document.getElementById('updateCarActive').checked = car.active;
            document.getElementById('updateIsRented').checked = car.isRented;
            document.getElementById('updateGearBox').value = car.gearBox;
            document.getElementById('updateMileage').value = car.mileage;
            document.getElementById('updateDailyPrice').value = car.dailyPrice;

            const updateCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('updateCarModal'))
            updateCarModal.show();

        }).catch(error => {
            console.error('Error : ',error);
        })
    }

    function saveUpdateCar(){
            const updateCarId = document.getElementById('updateCarId').value ;
            console.log('updateCarId:', updateCarId); 
            const updateBrandId = document.getElementById('updateBrandId').value;
            const updateModelName = document.getElementById('updateModelName').value;
            const updateColor = document.getElementById('updateColor').value;
            const updateCarStatus = document.getElementById('updateCarStatus').value;
            const updateCarActive = document.getElementById('updateCarActive').checked;
            const updateIsRented = document.getElementById('updateIsRented').checked;
            const updateCarAvailableStock = document.getElementById('updateCarAvailableStock').value;
            const updateGearBox = document.getElementById('updateGearBox').value;
            const updateMileage = document.getElementById('updateMileage').value;
            const updateDailyPrice = document.getElementById('updateDailyPrice').value;

            const updateCarImage = document.getElementById('updateCarImage');

             // modelName kontrolü
    if (!updateModelName) {
        alert('Model adı boş olamaz!');
        return; // İşlemi durdur
    }
            const carData = {
                id: updateCarId,
                brandId: updateBrandId,
                modelName: updateModelName,
                color: updateColor,
                carStatus: updateCarStatus,
                active: updateCarActive,
                isRented: updateIsRented,
                carAvailableStock: updateCarAvailableStock,
                gearBox: updateGearBox,
                mileage: updateMileage,
                dailyPrice: updateDailyPrice
            };
            console.log('carData:', carData);

            /*  ->eğer backend de update isteğini @ModelAtribute ile yaparsan formData'ya append leri alttaki gibi tek tek at.new Blob kullanmamalısın!!!!
                ->eğer backend de update isteği @RequestPart ise  şunu kullan:
                const formData = new FormData();                                                                      //formData nesnesi oluştur
                formData.append('file', feditedSelectedImage = updateProductImage.files[0]);                          //file'ı ilk dosya olarak otomatik ekleyecek.feditedSelectedImage değişkenine updateProductImage input elementinden alınan ilk dosyayı atıyorsunuz. Yani, feditedSelectedImage ve updateProductImage.files[0] aynı dosyayı referans eder.
                formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));    //Blob nesnesi, veri (bu örnekte JSON) ile birlikte bir veri kümesi oluşturur. Blob ile veri göndermek, genellikle FormData içinde JSON verisi göndermek için kullanılır.  yani productData sını bir json veri kümesine dönüştürüp product nesnesinin içine ekleyecek

            */
            const formData = new FormData();
            formData.append('file', updateCarImage.files[0]); // Dosya yüklemesi
            formData.append('id', updateCarId);
            formData.append('brandId', updateBrandId);
            formData.append('modelName', updateModelName);
            formData.append('color', updateColor);
            formData.append('carStatus', updateCarStatus);
            formData.append('active', updateCarActive);
            formData.append('isRented', updateIsRented);
            formData.append('carAvailableStock', updateCarAvailableStock);
            formData.append('gearBox', updateGearBox);
            formData.append('mileage', updateMileage);
            formData.append('dailyPrice', updateDailyPrice);

            fetch(BASE_PATH + "car/update", {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': 'Bearer ' + jwtToken
                }
            }).then(response => {
                if(!response.ok){
                    throw new Error("")
                }
                getAllCars();
            }).catch(error => {
                console.error('Error : ', error);
            });
           hideCarModal('updateCarModal');
    }
 
     document.addEventListener("DOMContentLoaded", async ()=> {
        await getAllCars();

       
     })