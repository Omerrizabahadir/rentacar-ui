const BASE_PATH = "http://localhost:8080/"
const BASE_IMAGE_PATH = "/Users/macbook/Documents/GitHub/rentacar/"
const jwtToken = localStorage.getItem('jwtToken');

var currentCarId = 0;
var brands = [];

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


     // Boş alan kontrolü
     if (!carBrandId || !modelName || !dailyPrice || !carAvailableStock) {
        alert('Lütfen tüm gerekli alanları doldurun!');
        return;
    }

    if (fileInput.files.length === 0) {
        alert('Lütfen bir resim yükleyin!');
        return;
    }

    const formData = new FormData();
    console.log([...formData]); 


    formData.append("file", fileInput.files[0]); 
    formData.append("brandId", carBrandId); 
    formData.append("modelName", modelName); 
    formData.append("color", color); 
    formData.append("carStatus", carStatus); 
    formData.append("active", active); 
    formData.append("isRented", isRented); 
    formData.append("carAvailableStock", carAvailableStock); 
    formData.append("gearBox", gearBox); 
    formData.append("mileage", mileage); 
    formData.append("dailyPrice", dailyPrice); 

    const carData = {
        
        brandId: carBrandId,
        modelName: modelName,
        color: color,
        carStatus: carStatus,
        active:active,
        isRented: isRented,
        carAvailableStock: carAvailableStock,
        gearBox: gearBox,
        mileage: mileage,
        dailyPrice: dailyPrice

    };
   /*
    await fetch(BASE_PATH + "car/create", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + jwtToken
        },
        body: formData
    }).then(response => {
        if (!response.ok) {
            showFailAlert('Car add is unsuccessfull');
            throw new Error("Car add request failed code status : " + response.status)
        }
       return response.json()

    }).then(data => {
        hideCarModal('addCarModal');
        clearModalValues();
        showSuccessAlert('Car added successfully')
        getAllCar();
       
    }).catch(error => {
        console.error('Error:', error);
        showFailAlert('Car add is unsuccessfull ');
    });
}
*/
try {
    const response = await fetch(BASE_PATH + "car/create", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + jwtToken
        },
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Car add request failed: " + errorText);
    }

    const data = await response.json();
    hideCarModal('addCarModal');
    clearModalValues();
    showSuccessAlert('Car added successfully');
    getAllCar();
} catch (error) {
    console.error('Error:', error);
    showFailAlert('Car add is unsuccessfull.');
}
}
async function getAllCar() {
    try{
        const response = await fetch(BASE_PATH + "car/all", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            },
            mode: 'cors' // CORS modunu belirtin
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
            <button class="btn btn-danger" onclick="showDeleteCarModal(${car.id})">Delete</button>
            </td>
            `;
    });
}
async function getBrands() {
    console.log("jwt : " + jwtToken);
    try {
    const response = await fetch(BASE_PATH + "brand", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        },
         mode: 'cors' // CORS modunu belirtin
    });
    if (!response.ok) {
        console.error("response status :" + response.status)
        throw new Error("Failed to get brands, response status : " + response.status)
    }
    const data = await response.json();
    console.log(data);
    displayBrandsWithSelectMenu(data);  
    displayBrands(data)  
                          
    }catch(error) {
    console.error("Error fetching brands: ", error);
     if (error.status === 403) { 
    window.location.href = "login.html"
    }
    }
 }
 function displayBrands(brands) {
    const brandSelect = document.getElementById('brandSelect');
    brandSelect.innerHTML = ''; 

 brands.forEach(brand => {
    const option = document.createElement('option'); 
    option.value = brand.id;
    option.text = brand.name;
    brandSelect.appendChild(option);

});
}   

//success alert 'i
function showSuccessAlert(message) {
    let alert = document.getElementById('success-alert');
    alert.style.display = 'block';
    alert.style.opacity = 1;

    let alertMessage = document.getElementById('successAlertMessage');
    alertMessage.textContent = message;
    setTimeout(() => {                         
        let opacity = 1;
        let timer = setInterval(() => {
            if (opacity <= 0.1) {
                clearInterval(timer);
                alert.style.display = 'none';
            }
            alert.style.opacity = opacity;
            opacity -=  0.1;
        }, 50);
    }, 3000);
}

//failed alert'i
function showFailAlert(message) {
    let alert = document.getElementById('fail-alert');
    alert.style.display = 'block';
    alert.style.opacity = 1;

    let alertMessage = document.getElementById('failAlertMessage');
    alertMessage.textContent = message;
    setTimeout(() => {
        let opacity = 1;
        let timer = setInterval(() => {
            if (opacity <= 0.1) {
                clearInterval(timer);
                alert.style.display = 'none';
            }
            alert.style.opacity = opacity;
            opacity -=  0.1;
        }, 50);
    }, 3000);
}
/*
function showDeleteCarModal(carId) {
    currentCarId=carId;
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("confirmDeleteModal"));
    modal.show();
}
*/
function hideCarModal(modalId){
    
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById(modalId))
    modal.hide();
}


//addCar ta ürünü eklerkemesini yapar gibi ekliyoruz ancak bunları boş göndersin diye value ların karşılığı '' boş olacak.addCar modalı açılınca sayfada ürünü ekledikten sonra modalın resmini name'ini,fiyatını... boşaltacak
function clearModalValues(){
    document.getElementById('modelName').value = '';
    document.getElementById('color').value = '';
    document.getElementById('carStatus').value = '';
    document.getElementById('isRented').checked = false;
    document.getElementById('carImage').value = '';
    document.getElementById('carAvailableStock').value = '';
    document.getElementById('dailyPrice').value = '';
    document.getElementById('brandSelect').value = ''; //******** */
    document.getElementById('carActive').checked = true;
    document.getElementById('gearBox').value= '';
    document.getElementById('mileage').value = '';
    document.getElementById('carImage').value = '';
     
}

//---------------------------------DELETE-------------------------------
   /* 
function deleteCar(carId){
    if(!carId){
        console.log("Car id is undefined or invalid")
        return;
    }
    currentCarId = carId;

    //Delete Confirm Modalını gösterme
    const confirmDeleteModal = new bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmDeleteModal'));
    confirmDeleteModal.show();
}

function confirmDeletion() {
    console.log("Confirm deletion called for ID:", currentCarId);  
    
    if (currentCarId === 0) {  
        console.error('No car ID available for deletion.');
        return;      
    }

    fetch(BASE_PATH + "car/" + currentCarId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        }
    }).then(response => {
        console.log("Fetch isteği yapıldı:", response);

        if (!response.ok) {
            throw new Error("Car delete request failed code status: " + response.status);
        }
        showSuccessAlert('Car is successfully deleted!');
        getAllCar();
        hideProductModal('confirmDeleteButton');

    }).catch(error => {
        console.error('Error: ', error);
        showFailAlert('An error occurred while deleting the car');
    }).finally(() => {
        const confirmDeleteModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmDeleteModal'));
        if (confirmDeleteModal) {
            confirmDeleteModal.hide();
        }
    currentCarId = 0;
});
}
*/
function showDeleteCarModal(carId){
    currentCarId=carId
    const deleteCarModal =  bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteCarModal'))
    deleteCarModal.show();
}

function deleteCar(){
   
    //const confirmed = confirm("Are you sure you want to delete car?");
    
   
    if(currentCarId !==0){
        console.error('No car ID available for deletion.');
        return;
    }
        fetch(BASE_PATH + "car/" + currentCarId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
            

        }).then(response => {
            console.log("Fetch isteği yapıldı:", response);
    
            if (!response.ok) {
                throw new Error("Car delete request failed code status: " + response.status);
            }
            const deleteCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteCarModal'))
            showSuccessAlert('Car deleted successfully');
            deleteCarModal.hide();
            getAllCar();

    }).catch(error => {
        console.error('Error : ', error)
        showFailAlert('An error occurred while deleting the car');
    }).finally(() => {
        currentCarId = 0;
    });
}
//showing and filling brands with select menu
function displayBrandsWithSelectMenu(brands){
    const brandSelect = document.getElementById('updateCarBrandSelect');
    brandSelect.innerHTML = '';

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.id;
        option.text = brand.name;
        brandSelect.appendChild(option);
    });
}

/* ------------------------Update-----------------------  */    
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

         // Markayı select menüsünden seç
        const brandSelect = document.getElementById('updateCarBrandSelect');
        brandSelect.value = car.brandId; // Markanın ID'sini seçili yap

        const updateCarModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('updateCarModal'))
        updateCarModal.show();

    }).catch(error => {
        console.error('Error : ',error);
    })
}

function saveUpdateCar(){

    const updateCarId = document.getElementById('updateCarId').value ;
    console.log('updateCarId:', updateCarId); 
    const updateCarBrandId = document.getElementById('updateCarBrandSelect').value;
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
        brandId: updateCarBrandId,
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
    formData.append('brandId', updateCarBrandId);
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
            throw new Error("Car updating request failed status code : " , response.status)
        }
        getAllCar();
        showSuccessAlert('Car updated successfully');
        clearModalValues();
        closeUpdateCarModal();
    }).catch(error => {
        console.error('Error : ', error);
        showFailAlert('An error occurred while updating the car');
    });
}

async function closeUpdateCarModal(){

const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('updateCarModal'))   
modal.hide();
}

document.addEventListener("DOMContentLoaded", async () => {
    // Başlangıçta alertleri gizlemek için
    const successAlert = document.getElementById('success-alert');
    const failAlert = document.getElementById('fail-alert');

    successAlert.style.opacity = 0;
    failAlert.style.opacity = 0;

    // Kapatma butonlarına event listener ekleme
    const closeSuccessAlert = document.querySelector('#success-alert .close');
    closeSuccessAlert.addEventListener('click', function() {
        successAlert.style.opacity = 0; // Gizlemek için opacity'yi sıfır yap
    });

    const closeFailAlert = document.querySelector('#fail-alert .close');
    closeFailAlert.addEventListener('click', function() {
        failAlert.style.opacity = 0; // Gizlemek için opacity'yi sıfır yap
    });

    try {
        await getAllCar();
        await getBrands();
        showSuccessAlert("Araçlar ve markalar başarıyla yüklendi!");
    } catch (error) {
        showFailAlert("Araçlar ve markalar yüklenirken bir hata oluştu.");
    }
});
