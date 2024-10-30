
    const jwtToken = localStorage.getItem("jwtToken");
    const customerId = localStorage.getItem("customerId");

    const BASE_PATH = "http://localhost:8080/"
    const BASE_IMAGE_PATH = "/Users/macbook/Documents/GitHub/rentacar/"

    let rentItems = [];
   
    async function fetchBrands(){
        console.log("fetchBrands fonksiyonu çalıştı.");
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
            brandSelect.appendChild(new Option("Bir Marka Seçin", ""));
    
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

        async function fetchRentedCars() {
            try {
                const response = await fetch(`${BASE_PATH}rental/customer/${customerId}`, { // Aktif kiralamaları getir
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwtToken
                    }
                });
                
                if (!response.ok) {
                    throw new Error("Failed to fetch rented cars, response status: " + response.status);
                }
                
                rentedCars = await response.json(); 
            } catch (error) {
                console.error("Error fetching rented cars: ", error);
            }
        }
    
    function addToRent(car){
         // Araç kiralanabilirlik kontrolü
    if (car.isRented) {
        showModal("The car you selected is already rented.");
        return;
    }

        const carCountInRent = rentItems.filter(item => item.id === car.id).length;
        console.log("carCountInRent : "+ carCountInRent);
    
        if (car.carAvailableStock > 0 && carCountInRent < car.carAvailableStock) {
            
             // Modal'dan kiralama bilgilerini al
        const quantity = document.getElementById("rentalQuantity").value; // Miktarı al
        const dailyPrice = car.dailyPrice; // Günlük fiyatı al
        const totalPrice = dailyPrice * quantity; // Toplam fiyatı hesapla

        // Kiralama detayları ile birlikte aracı myRentals'a ekle
        myRentals.push({
            modelName: car.modelName, 
            brandName: car.brandName,
            quantity: quantity,
            dailyPrice: dailyPrice,
            totalPrice: totalPrice,
            startRentalDate: document.getElementById("startRentalDate").value,
            endRentalDate: document.getElementById("endRentalDate").value,
            pickupAddress: document.getElementById("pickupAddress").value,
            returnAddress: document.getElementById("returnAddress").value
        });

            
            rentItems.push(car);
            console.log("Current rentItems:", rentItems);


            updateRentalButtonVisibility();
            confirmRental(car);
            if (rentItems.length > 0) {
               
            }

            myRentals.push(car);
            console.log("Car added to rentals:", car);
            updateRent();
            
           
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

        if (!rent) {
            console.error("Rent element not found!");
            return; // Eğer rent elementi yoksa fonksiyondan çık
        }

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
        console.log("Rental Button Display Style:", rentalButton ? rentalButton.style.display : "Button not found");
        if (!rentalButton) {
            console.error("Rental button not found!");
            return; 
        }
         // Butonun durumunu konsola yazdır
    console.log("Rental Button Before Update:", rentalButton);
    console.log("Button Display Style Before Update:", rentalButton.style.display);
    
        
        if (rentItems.length > 0) {
            console.log("updateRentalButtonVisibility çağrıldı.");
            console.log("Rent Items Length:", rentItems.length);

            rentalButton.style.display = "block";
        } else {
            rentalButton.style.display = "none";
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
                startRentalDate: new Date(startRentalDate).toLocaleString(),
                endRentalDate: new Date(endRentalDate).toLocaleString, 
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
   
// Kullanıcının ismini alacak bir örnek fonksiyon
function getCurrentUserName() {
    // Burada kullanıcı bilgilerini almak için gerekli kodu yazabilirsiniz
    // Örnek olarak sabit bir değer döndürebiliriz
    return "Kullanıcı Adı"; // Gerçek kullanıcı adını buradan alabilirsiniz
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
            changeMonth: true,
            changeYear: true,
            showAnim: "slideDown",
            minDate: 0,
            onSelect: function(selectedDate) {
                // Bitiş tarihi için minimum tarihi başlangıç tarihi olarak ayarla
                $("#endRentalDate").datepicker("option", "minDate", selectedDate);
            }
            
        });
        
        $("#endRentalDate").datepicker({
            dateFormat: "dd-mm-yy",
            changeMonth: true,
            changeYear: true,
            showAnim: "slideDown",
            minDate: 0 
            
        });
        const dailyPrice = car.dailyPrice;

        document.getElementById("calculatePriceButton").onclick = function() {
            calculateModalPrice(dailyPrice);

       

        
        document.getElementById("confirmRentalButton").onclick = function() {
            const quantity = document.getElementById("rentalQuantity").value;
            if (quantity > 0) {
                // Modal kapandıktan sonra aracı ekleyin
                car.quantity = quantity; // Aracın miktarını ayarla
               rentNow(car);
                closeModal(); // Modali kapat
            } else {
                alert("Lütfen geçerli bir miktar girin.");
            }
        };
         // Dışarı tıklama ile modalı kapatma olayı
        window.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
        }
    };
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


// Araç ID'sine göre aracı bulmak için bir yardımcı fonksiyon
function getCarById(carId) {
    //  araçları içeren bir dizi
    return cars.find(car => car.id === carId);
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

        // Olay dinleyicisini kaldır
    window.onclick = null;
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
    
    function calculateRentalDays(startRentalDate, endRentalDate) {
        const start = new Date(startRentalDate);
        const end = new Date(endRentalDate);
        const timeDifference = end - start; // Zaman farkı milisaniye cinsinden
        const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Gün sayısını hesapla
        return dayDifference >= 0 ? dayDifference : 0; // Eğer negatifse sıfır döndür
    }
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

        function rentNow(car) {
            const rentalQuantity = parseInt(document.getElementById("rentalQuantity").value);
            const startRentalDate = document.getElementById("startRentalDate").value;
            const endRentalDate = document.getElementById("endRentalDate").value;
            const pickupAddress = document.getElementById("pickupAddress").value;
            const returnAddress = document.getElementById("returnAddress").value;
            const totalRentalPertiodDays = document.getElementById("totalRentalPertiodDays");
            
        
            const rentalDays = calculateRentalDays(startRentalDate, endRentalDate);
        
            if (rentalDays <= 0) {
                alert("Please select a valid rental period.");
                return;
            }
        
            const rentalInfo = {
                carId: car.id,
                dailyPrice: car.dailyPrice,
                quantity: rentalQuantity,
                startRentalDate: new Date(startRentalDate).toISOString(), // ISO formatında
                endRentalDate: new Date(endRentalDate).toISOString(),
                rentalPeriod: totalRentalPertiodDays,
                pickupAddress: pickupAddress,
                returnAddress: returnAddress
            };
            console.log("Rental Info:", rentalInfo); 
            console.log("customerId : ", customerId)
           
            const requestBody = {
                customerId: (customerId.toString()), 
                rentalList: [rentalInfo]
            };
        
            
            fetch(BASE_PATH + "rental", {
    
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwtToken
                },
                body: JSON.stringify(requestBody),

            }) .then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        return response.json().then(errorData => {
                            if (errorData.message && errorData.message.includes("already rented")) {
                                // Eğer araba başka bir kullanıcı tarafından kiralanmışsa
                                alert("Seçtiğiniz araba başka bir kullanıcı tarafından kiralanmıştır.");
                                throw new Error("Araba kiralanmış durumda.");
                            }
                            throw new Error("Kiralama hatası: " + errorData.message);
                        });
                    }
                    throw new Error("Rental request failed: " + response.status);
                }
                return response.json();
            }).then(data => {
                console.log(data);
                myRentals.push(rentalInfo);
                updateMyRentals();
                closeModal();
            }).catch(error => {
                console.error("Error in rentNow function: ", error);
                closeModal();
            });
        }
        
        // Kiralama detaylarını gösteren fonksiyon
function displayRentalDetails(rentalCarInfoList) {
    const rentalDetailsDiv = document.getElementById("rentalDetails");
    rentalDetailsDiv.innerHTML = ''; 
    rentalCarInfoList.forEach(item => {
        const rentalInfo = document.createElement("div");
        rentalInfo.classList.add("alert", "alert-info", "mb-2");
        rentalInfo.innerHTML = `
            <strong>Marka:</strong> ${item.brandName} <br>
            <strong>Model:</strong> ${item.modelName} <br>
            <strong>Toplam Fiyat:</strong> ${item.totalPrice} TL <br>
            <strong>Kiralayan:</strong> ${getCurrentUserName()} <br>
            <strong>Kiralama Süresi:</strong> ${item.totalRentalPeriodDays} gün <br>
            <strong>Pickup Adresi:</strong> ${item.pickupAddress} <br>
            <strong>İade Adresi:</strong> ${item.returnAddress} <br>
        `;
        rentalDetailsDiv.appendChild(rentalInfo);
    });
}
    function clearRent() {
        rentItems = [];
        updateRent();
        updateRentalButtonVisibility();
        const brandSelect = document.getElementById("brandSelect");
        fetchCarByBrand(brandSelect.value);
    }
    let rentedCars = []; // Kiralanmış araçların listesini tutacak dizi 
    function updateEndDate(selectedDate) {
        const startDate = new Date(selectedDate);
        const rentalPeriod = 3; 
        startDate.setDate(startDate.getDate() + rentalPeriod);

        // Bitiş tarihini güncelle
        document.getElementById("endRentalDate").value = startDate.toISOString().split("T")[0];
    }

    // Rental bilgilerini kaydet
function saveRentalData(rental) {
    
    localStorage.setItem('startDate', rental.startDate);
    localStorage.setItem('endDate', rental.endDate);
    localStorage.setItem('pickupAddress', rental.pickupAddress);
    localStorage.setItem('returnAddress', rental.returnAddress);
    localStorage.setItem('totalRentalPeriodDays',totalRentalPeriodDays);
    localStorage.setItem('totalPrice', rental.totalPrice);

}
    
document.addEventListener("DOMContentLoaded", async function () {
    updateRentalButtonVisibility();
    await fetchBrands();
    await fetchRentedCars(); 
   

    const brandSelect = document.getElementById("brandSelect");

    // Marka seçildiğinde araçları yükle
    brandSelect.addEventListener("change", async function() {
        await fetchCarByBrand(this.value);
    });

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
updateRent();
