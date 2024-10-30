const BASE_PATH = 'http://localhost:8080/'; 
const customerId = localStorage.getItem("customerId"); 
const jwtToken = localStorage.getItem("jwtToken"); 

// Kiralanan araçları fetch eden fonksiyon
async function fetchRentedCars() {
    try {
        const response = await fetch(`${BASE_PATH}rental/customer/${customerId}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        });
        console.log("response : ", response);
        
        if (!response.ok) {
            throw new Error("Failed to fetch rented cars, response status: " + response.status);
        }

        const rentedCars = await response.json(); 
        console.log("Rented Cars Data:", rentedCars);
        displayRentedCars(rentedCars); 
    } catch (error) {
        console.error("Error fetching rented cars: ", error);
    }
}
/*
// Tarihleri özel formatta gösterme fonksiyonu
function formatDate(dateString) {
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}.${year}`;
}
*/
// Kiralanan araçları ekranda gösterme fonksiyonu
function displayRentedCars(cars) {
    const container = document.getElementById('rented-cars');
    container.innerHTML = '';

    cars.forEach(car => {
        console.log("Car data:", car);
        console.log("Total Price:", car.totalPrice);
        console.log("Start Rental Date:", car.startRentalDate); 
        console.log("End Rental Date:", car.endRentalDate); 
        console.log("car.totalRentalPeriodDays", car.totalRentalPeriodDays);


        
        const rentalInfo = document.createElement('div');
        rentalInfo.classList.add('rental-info'); // Stil eklemek için sınıf

        
        const totalPrice = car.totalPrice !== undefined ? car.totalPrice.toFixed(2) : "Bilinmiyor";

        rentalInfo.innerHTML = `
            <strong>Marka:</strong> ${car.name} <br>
            <strong>Model:</strong> ${car.modelName} <br>
            <strong>Toplam Fiyat:</strong> ${car.totalPrice} TL <br>
            <strong>Kiralayan:</strong> ${car.firstName} ${car.lastName} <br>
            <strong>Alış Adresi:</strong> ${car.pickupAddress || "Bilinmiyor"} <br> 
            <strong>İade Adresi:</strong> ${car.returnAddress || "Bilinmiyor"} <br> 
            <strong>Kiralama Başlangıç Tarihi :</strong> ${car.startRentalDate}<br>
            <strong>Kiralama Bitiş Tarihi :</strong> ${car.endRentalDate} <br>
            <strong>Kiralama Süresi:</strong> ${car.totalRentalPeriodDays} gün <br>
        `;

        container.appendChild(rentalInfo);
    });
}

// Sayfa yüklendiğinde kiralanmış araçları getir
document.addEventListener('DOMContentLoaded', () => {
    fetchRentedCars();
});
