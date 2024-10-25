    const jwtToken = localStorage.getItem("jwtToken");
    const customerId = localStorage.getItem("customerId");

    const BASE_PATH = "http://localhost:8080/"
    const BASE_IMAGE_PATH = "/Users/macbook/Documents/GitHub/rentacar/"

    let rentItems = [];

    async function fetchBrands(){
            console.log(jwtToken);
        try{
        const response = await fetch(BASE_PATH + "brand", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        });
        if (!response.ok) {
            console.error("response status :" + response.status)
            throw new Error("Failed to get brands, response status : " + response.status)
        }
        
        const data = await response.json();
        console.log(data);

        displayBrands(data)

        }catch(error){
            console.error("Error fetching brands: ", error);
            if(error.status === 403){
            window.location.href = "login.html"
            }
        }
        }
        function checkIfCarIsRented(carId) {
            return rentedCars.some(car => car.id === carId); // Kiralanmış araçlar arasında kontrol etme
        }
        
        

        async function fetchCarByBrand(brandId){
            const endPointUrl = BASE_PATH + "car/brand/" + brandId;
           
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

                data.forEach(car => {
                    // Her bir araç için isRented durumunu kontrol etme
                    car.isRented = checkIfCarIsRented(car.id);
                });
        

                displayCars(data);
                
            }catch (error) {
                console.error("Error fetching cars : ", error);
                if (error.status == 403) {
                window.location.href = "login.html"
            }
            }
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
            
            const carCard = document.createElement("div");
            carCard.classList.add("col-md-2", "mb-4");

            const card =document.createElement("div");
            card.classList.add("card");
                

            const carImage = document.createElement("img");
            carImage.src = BASE_IMAGE_PATH + car.image
            carImage.alt = car.name;
            carImage.classList.add("card-img-top");
            carImage.style.maxWidth = "175px";
            carImage.style.maxHeight = "175px";

            const cardBody = document.createElement("div");
            cardBody.classList.add("cart-body");
            cardBody.innerHTML = `
        <div class="card-body text-center">
            <h5 class="card-title fw-bold">${car.modelName}</h5> 
            <p class="card-text text-muted">${car.gearBox}</p> 
            <p class="card-text fw-bold fs-5">${car.dailyPrice} TL</p> 
            <p class="card-text"><small class="text-secondary">${car.carStatus}</small></p> 
            <button class="btn btn-success mt-3" onclick='openRentalModal(${JSON.stringify(car)})'>Add To Rental</button> 
        </div>
    `;

            carCard.appendChild(carImage);
            carCard.appendChild(cardBody);
            
            carList.appendChild(carCard);

        });
    }

    function addToRent(car){
         // Araç kiralanabilirlik kontrolü
    if (car.isRented) {
        showModal("Seçtiğiniz araba başkası tarafından kiralanmıştır.");
        return;
    }

        const carCountInRent = rentItems.filter(item => item.id === car.id).length;
        console.log("carCountInRent : "+ carCountInRent);
    
        if (car.carAvailableStock > 0 && carCountInRent < car.carAvailableStock) {
            rentItems.push(car);
            myRentals.push(car);
            console.log("Car added to rentals:", car);
            updateRent();
            updateRentalButtonVisibility();
            
            confirmRental(car);
        } else if (car.carAvailableStock === 0) {
            showModal("This car is out of stock. Please choose another car.");
        } else {
            showModal("There are " + (car.carAvailableStock - carCountInRent) + " car left in stock.");
        }
    }
    function showModal(message= ""){
        const modal = document.getElementById("modal");
        const modalMessage = document.getElementById("modalMessage");
        
        if (message) {
            modalMessage.textContent = message; // Mesaj varsa modal açılır
            modal.style.display = "block";
        } else {
            modal.style.display = "none"; // Mesaj yoksa modal kapanır
        }
    }
   
function openAddressModal() {
    const modal = document.getElementById("addressModal");
    modal.style.display = "block";
}

function closeAddressModal() {
    const modal = document.getElementById("addressModal");
    modal.style.display = "none";
}

    function updateRent(){
        console.log("Rent Items : ", rentItems);
        const rent = document.getElementById("rent");
        rent.innerHTML = '';

        rentItems.forEach((item, index) => {
            const rentItemElement = document.createElement("li");
            rentItemElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

            const itemNameElement = document.createElement("span");
            rentItemElement.textContent = `${item.modelName} - ${item.dailyPrice} TL`;

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-danger");
            deleteButton.innerHTML = '<i class="bi bi-trash"></i>';

            deleteButton.onclick = function () {
                removeFromRent(index);
            };
            rentItemElement.appendChild(itemNameElement);
            rentItemElement.appendChild(deleteButton);
            rent.appendChild(rentItemElement);

        });
        const rentalCount = document.getElementById("rentalCount");
        rentalCount.textContent = `+ ${rentItems.length}`;
    }

    function removeFromRent(index){
        rentItems.splice(index, 1)[0];
        updateRent();
        updateRentalButtonVisibility();
    }

    function updateRentalButtonVisibility(){
        const rentalButton = document.getElementById("rentalButton");
        console.log("Checking rental button...", rentalButton); 
        if (!rentalButton) {
            console.error("Rental button not found!");
            return; 
        }
        
        if (rentItems.length > 0) {
            rentalButton.style.display = "block";
        } else {
            rentalButton.style.display = "none";
        }
    }

    function rentNow() {
        console.log("rentNow : ", rentItems)
    
        const idCountMap = new Map();
        rentItems.forEach(item => {
            const { id } = item;
    
            //Check if the id exists in the map
            if (idCountMap.has(id)) {
                //if it exists, increment the count
                idCountMap.set(id, idCountMap.get(id) + 1);
            } else {
                //if it doesn't exist, add it to the map
                idCountMap.set(id, 1);
            }
        })
    
        idCountMap.forEach((count, id) => {
            console.log("id : ", id, " count : ", count)
        });
    
        var rentalCarInfoList = [...idCountMap].map(([carId, quantity, startRentalDate, endRentalDate, rentalPeriod, pickupAddress, returnAddress]) => ({ 
            carId, 
            quantity, 
            startRentalDate,
            endRentalDate,
            rentalPeriod,
            pickupAddress,
            returnAddress
         }));
        console.log("rentalCarInfoList : ", rentalCarInfoList)
    
        fetch(BASE_PATH + "rental", {
            method: 'POST',
            body: JSON.stringify({
                customerId,
                rentalList: rentalCarInfoList
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        }).then(response => {
            if (!response.ok) {
                console.error("Rental request failed: ", response);
                throw new Error("Rental request failed code status : " + response.status);
            }
            return response.json();
        }).then(data => {
            console.log(data);
            clearRent();
        }).catch(error => {
            console.error("Error in rentNow function: ", error);
        });
    }   
      
    function confirmRental(car) {
        // Modalı aç
        openRentalModal(car);
    }
    
    let rentalInfos = [];
    function openRentalModal(car) {
        console.log("Selected Car: ", car); 

        const modal = document.getElementById("rentalModal");
        const modalCarInfo = document.getElementById("modalCarInfo");
        
       // Araç bilgilerini modalda göster
    modalCarInfo.innerText = `Araç: ${car.brandId || 'Bilinmiyor'} ${car.modelName}, Günlük Fiyat: ${car.dailyPrice} TL`;

     // Quantity alanını temizle
     document.getElementById("rentalQuantity").value = '';

    modal.style.display = "block";
    
        // Tarih seçicileri başlat
        $("#startRentalDate").datepicker({
            dateFormat: "dd-mm-yy",
            
        });
        
        $("#endRentalDate").datepicker({
            dateFormat: "dd-mm-yy",
            
        });
        const dailyPrice = car.dailyPrice;
        document.getElementById("calculatePriceButton").onclick = function() {
            calculateModalPrice(dailyPrice);

        document.getElementById("calculatePriceButton").onclick = function() {
            calculateTotalPrice(car.dailyPrice);
        };
    
        document.getElementById("confirmRentalButton").onclick = function() {
            submitRental(car);
        };
    }
    
    
    function rentNow() {
        console.log("Selected Rent Items: ", rentItems);
        // İlk aracı al (veya modalda birden fazla araç gösterilecekse uygun şekilde ayarlama)
        const car = rentItems[0];
        openRentalModal(car);
    }
    document.getElementById("modalClose").onclick = function() {
        closeModal();
    };
    
    function updateRentalPeriod() {
        const startDateInput = document.getElementById('startRentalDate').value;
        const endDateInput = document.getElementById('endRentalDate').value;
    
        if (startDateInput && endDateInput) {
            const rentalDays = calculateRentalDays(startDateInput, endDateInput);
            document.getElementById('rentalPeriodDisplay').innerText = rentalDays;
        } else {
            document.getElementById('rentalPeriodDisplay').innerText = 0;
        }
    }
    // Fiyat hesaplama fonksiyonu
    function calculateTotalPrice(dailyPrice) {
        const quantity = document.getElementById("rentalQuantity").value || 0;
        const startDate = $("#startRentalDate").val();
        const endDate = $("#endRentalDate").val();
    
        // Tarihleri kontrol et ve toplam fiyatı hesapla
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const rentalDays = (end - start) / (1000 * 60 * 60 * 24); // Gün sayısını hesapla
            const totalPrice = rentalDays * dailyPrice * quantity;
            
            
            const totalPriceDisplay = document.getElementById("totalPriceDisplay");
            
        } else {
            alert("Lütfen başlangıç ve bitiş tarihlerini girin.");
        }
    }
    function calculateModalPrice() {
        const quantity = document.getElementById("rentalQuantity").value || 0;
        const startDate = $("#startRentalDate").val();
        const endDate = $("#endRentalDate").val();
    
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const rentalDays = (end - start) / (1000 * 60 * 60 * 24); // Gün sayısını hesapla
            const totalPrice = rentalDays * dailyPrice * quantity;
    
            // Modalda fiyatı göster
            const totalPriceDisplay = document.getElementById("modalTotalPriceDisplay");
            totalPriceDisplay.innerText = `Toplam Fiyat: ${totalPrice} TL`;
        } else {
            alert("Lütfen başlangıç ve bitiş tarihlerini girin.");
        }
    }
}

let myRentals = [];
function submitRental(car) {
    const rentalQuantity = parseInt(document.getElementById("rentalQuantity")?.value);
    const startRentalDate = document.getElementById("startRentalDate")?.value;
    const endRentalDate = document.getElementById("endRentalDate")?.value;
    const pickupAddress = document.getElementById("pickupAddress")?.value;
    const returnAddress = document.getElementById("returnAddress")?.value;

    // Girişlerin kontrolü
    if (!startRentalDate || !endRentalDate || !pickupAddress || !returnAddress) {
        showModal("Lütfen tüm alanları doldurun.");
        return;
    }

    // Miktarın kontrolü
    if (isNaN(rentalQuantity) || rentalQuantity <= 0) {
        showModal("Lütfen geçerli bir miktar girin.");
        return;
    }

    const rentalDays = calculateRentalDays(startRentalDate, endRentalDate);

    if (rentalDays <= 0) {
        showModal("Lütfen geçerli bir kiralama süresi seçin.");
        return;
    }

    const rentalInfo = {
        carId: car.id,
        dailyPrice: car.dailyPrice,
        quantity: rentalQuantity,
        startRentalDate: startRentalDate,
        endRentalDate: endRentalDate,
        rentalPeriod: calculateRentalDays(startRentalDate, endRentalDate),
        pickupAddress: pickupAddress,
        returnAddress: returnAddress
    };

    console.log("Gönderilen rentalInfo:", rentalInfo); 

    const requestBody = {
        customerId: parseInt(customerId), 
        rentalList: [
            {
                carId: rentalInfo.carId, 
                quantity: rentalInfo.quantity,
                startRentalDate: new Date(startRentalDate).toISOString(), // ISO 8601 formatına dönüştür
                endRentalDate: new Date(endRentalDate).toISOString(), // ISO 8601 formatına dönüştür
                rentalPeriod: rentalDays, 
                pickupAddress: pickupAddress,
                returnAddress: returnAddress
            }
        ]
    };
    
console.log("Request body: ", JSON.stringify(requestBody)); 

fetch(BASE_PATH + "rental", {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtToken
    }
}).then(response => {
    if (!response.ok) {
        throw new Error("Rental request failed status code: " + response.status);
    }
    return response.json();
}).then(data => {
    console.log(data);
    
    // Kiralama bilgilerini myRentals dizisine ekleme
    myRentals.push(rentalInfo);
    
    // Kiralama listesini güncelleme
    updateMyRentals();

    // Modalı kapatma
    closeModal(); 
}).catch(error => {
    console.error("Error in submitRental function: ", error);
    closeModal();
});
}



// Araç ID'sine göre aracı bulmak için bir yardımcı fonksiyon
function getCarById(carId) {
    //  araçları içeren bir dizi
    return cars.find(car => car.id === carId);
}

    
function updateMyRentals() {
    const myRentalsList = document.getElementById("myRentalsList");
    const rentalCount = document.getElementById("rentalCount");
    const totalPriceDisplay = document.getElementById("totalPriceDisplay");

    myRentalsList.innerHTML = '';
    let totalPrice = 0; // Tüm araçların toplam fiyatını sıfırla

    myRentals.forEach(rental => {
        const rentalItem = document.createElement("li");
        rentalItem.classList.add("list-group-item");

        // Kiralama günlerini hesapla
        const rentalDays = calculateRentalDays(rental.startRentalDate, rental.endRentalDate);
        const rentalPrice = rentalDays * (rental.dailyPrice || 0); // Günlük fiyatı kullanarak hesapla

        rentalItem.innerText = `Araç ID: ${rental.carId}, Miktar: ${rental.quantity}, Başlangıç Tarihi: ${rental.startRentalDate}, Bitiş Tarihi: ${rental.endRentalDate}, Alış Adresi: ${rental.pickupAddress}, Dönüş Adresi: ${rental.returnAddress}, Aracın Toplam Kiralama Bedeli: ${rentalPrice} TL`;
        
        myRentalsList.appendChild(rentalItem);

        // Toplam fiyatı güncelle
        totalPrice += rentalPrice; // Her kiralama fiyatını toplam fiyata ekle
    });

    // Kiralanan araba sayısını güncelle
    rentalCount.innerText = myRentals.length;

    // Tüm kiralanan araçların toplam fiyatını göster
    document.getElementById("overallTotalPriceDisplay").innerText = ` Ödenecek Tutar : ${totalPrice} TL`;
}


    // Modalı kapatma fonksiyonu
    function closeModal() {
        const modal = document.getElementById("rentalModal");
        modal.style.display = "none"; // Modalı kapat
    }

    function updateEndDate() {
        const startRentalDate = document.getElementById("startRentalDate").value;
        const endRentalDateInput = document.getElementById("endRentalDate");
    
        // Başlangıç tarihi seçildiyse bitiş tarihini ayarla
        if (startRentalDate) {
            const startDate = new Date(startRentalDate);
            const rentalPeriod = 3; // Örnek: 3 gün süre
            startDate.setDate(startDate.getDate() + rentalPeriod);
            
            // Bitiş tarihini güncelle
            endRentalDateInput.value = startDate.toISOString().split("T")[0];
        }
    }
    
    function calculateRentalDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDifference = end - start; // Zaman farkı milisaniye cinsinden
        const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Gün sayısını hesapla
        return dayDifference >= 0 ? dayDifference : 0; // Eğer negatifse sıfır döndür
    }
    
    
    function clearRent() {
        rentItems = [];
        updateRent();
        updateRentalButtonVisibility();
        const brandSelect = document.getElementById("brandSelect");
        fetchCarByBrand(brandSelect.value);
    }
    let rentedCars = []; // Kiralanmış araçların listesini tutacak dizi

async function fetchRentedCars() {
    try {
        const response = await fetch(BASE_PATH + "rental/active", { // Aktif kiralamaları getir
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch rented cars, response status: " + response.status);
        }
        
        rentedCars = await response.json(); // Kiralanmış araçları güncelle
    } catch (error) {
        console.error("Error fetching rented cars: ", error);
    }
}
function displayRentedCars(cars) {
    const container = document.getElementById('rented-cars');
    container.innerHTML = ''; // Önceki verileri temizle

    cars.forEach(car => {
        const carElement = document.createElement('div');
        carElement.textContent = `Rental ID: ${car.rentalId}, Customer: ${car.firstName} ${car.lastName}, Car: ${car.name} ${car.modelName}`;
        container.appendChild(carElement);
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    updateRentalButtonVisibility();
    await fetchRentedCars(); // Kiralanmış araçları yükle
    await fetchBrands();

    const brandSelect = document.getElementById("brandSelect");

    // Marka seçildiğinde araçları yükle
    brandSelect.addEventListener("change", async function() {
        await fetchCarByBrand(this.value);
    });

    await fetchCarByBrand(brandSelect.value); 
    updateMyRentals(); // Kullanıcının kiralamaları

    // Tarih seçicileri başlat
    $("#startRentalDate").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function(selectedDate) {
            updateEndDate(selectedDate);
        }
    });

    $("#endRentalDate").datepicker({
        dateFormat: "yy-mm-dd"
    });
});

// Kiralanmış araçları yükleme
async function fetchRentedCars() {
    try {
        const response = await fetch(`${BASE_PATH}rental/customer/${customerId}`, { 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch rented cars, response status: " + response.status);
        }

        const rentedCars = await response.json(); 
        console.log(rentedCars); 
        
    } catch (error) {
        console.error("Error fetching rented cars: ", error);
    }
}

function updateEndDate(selectedDate) {
    const startDate = new Date(selectedDate);
    const rentalPeriod = 3; 
    startDate.setDate(startDate.getDate() + rentalPeriod);

    // Bitiş tarihini güncelle
    document.getElementById("endRentalDate").value = startDate.toISOString().split("T")[0];
}
    
