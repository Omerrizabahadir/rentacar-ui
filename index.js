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
            
            window.location.href = "login.html"
        
        }
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

                displayCars(data);
                
            }catch (error) {
                console.error("Error fetching cars : ", error);
                
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

            const carImage = document.createElement("img");
            carImage.src = BASE_IMAGE_PATH + car.image
            carImage.alt = car.name;
            carImage.style.maxWidth = "175px";
            carImage.style.maxHeight = "175px";

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            cardBody.innerHTML = `
        <div class="card-body text-center">
            <h5 class="card-title fw-bold">${car.modelName}</h5> 
            <p class="card-text text-muted">${car.gearBox}</p> 
            <p class="card-text fw-bold fs-5">${car.dailyPrice} TL</p> 
            <p class="card-text"><small class="text-secondary">${car.carStatus}</small></p> 
            <button class="btn btn-success mt-3" onclick='addToRent(${JSON.stringify(car)})'>Add To Rental</button> 
        </div>
    `;

            carCard.appendChild(carImage);
            carCard.appendChild(cardBody);
            
            carList.appendChild(carCard);

        });
    }

    function addToRent(car){
        
        const carCountInRent = rentItems.filter(item => item.id === car.id).length;
        console.log("carCountInRent : "+ carCountInRent);
    
        if (car.carAvailableStock > 0 && carCountInRent < car.carAvailableStock) {
            rentItems.push(car);
            console.log("Car added to rentals:", car);
            updateRent();
            updateRentalButtonVisibility();
            
            
            const rentalButton = document.getElementById("rentalButton");
            console.log("Before updateRentalVisibility:", rentalButton);
        
            if (rentalButton) {
                console.log("Rental button is found.");
            } else {
                console.error("Rental button not found!");
            }
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
    // Kapatma butonu için tıklama olayı
    document.getElementById("modalClose").onclick = function() {
        showModal(); // Modalı kapat
    }

    // Dışarı tıklama ile modalı kapatma
    window.onclick = function(event) {
        const modal = document.getElementById("modal");
        if (event.target === modal) {
            showModal(); // Modalı kapat
        }
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
    function clearRent() {
        rentItems = [];
        updateRent();
        updateRentalButtonVisibility();
        const brandSelect = document.getElementById("brandSelect");
        fetchCarByBrand(brandSelect.value);
    }
    

    document.addEventListener("DOMContentLoaded", async function () {
    
        updateRentalButtonVisibility();
        await fetchBrands();
        
        const brandSelect = document.getElementById("brandSelect");
        brandSelect.addEventListener("change", async function () {
            await fetchCarByBrand(brandSelect.value);
        });

        if (brandSelect.value) {
            await fetchCarByBrand(brandSelect.value);
        }
    });
