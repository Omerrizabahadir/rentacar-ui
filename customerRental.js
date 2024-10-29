const BASE_PATH = 'http://localhost:8080/'; 
const customerId = localStorage.getItem("customerId"); 
const jwtToken = localStorage.getItem("jwtToken"); 

async function fetchRentedCars() {
    try {
        const response = await fetch(`${BASE_PATH}rental/customer/${customerId}`, { 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        });
        console.log("response : ", response)
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

function displayRentedCars(cars) {
    const container = document.getElementById('rented-cars');
    container.innerHTML = '';

    cars.forEach(car => {
        console.log("Car data:", car);
        console.log("Total Price:", car.totalPrice);
        console.log("Start Rental Date:", car.startRentalDate); 
        console.log("End Rental Date:", car.endRentalDate); 

        const rentalInfo = document.createElement('div');
        rentalInfo.classList.add('rental-info'); // Stil eklemek için bir sınıf ekleyebilirsiniz

        // Tarihleri kullanıcı dostu formatta gösterme
        const startRentalDateFormatted = new Date(car.startRentalDate).toLocaleString(); // Tarih formatı güncellendi
        const endRentalDateFormatted = new Date(car.endRentalDate).toLocaleString(); // Tarih formatı güncellendi

        // Toplam fiyat kontrolü
        const totalPrice = car.totalPrice !== undefined ? car.totalPrice.toFixed(2) : "Bilinmiyor"; // Fiyat iki ondalık basamağa yuvarlandı

        rentalInfo.innerHTML = `
            <strong>Marka:</strong> ${car.name} <br>
            <strong>Model:</strong> ${car.modelName} <br>
            <strong>Toplam Fiyat:</strong> ${totalPrice} TL <br>
            <strong>Kiralayan:</strong> ${car.firstName} ${car.lastName} <br>
            <strong>Kiralama Süresi:</strong> ${car.totalRentalPeriodDays} gün <br>
            <strong>Pickup Adresi:</strong> ${car.pickupAddress || "Bilinmiyor"} <br> 
            <strong>İade Adresi:</strong> ${car.returnAddress || "Bilinmiyor"} <br> 
            <strong>Kiralama Başlangıç Tarihi :</strong> ${startRentalDateFormatted}<br>
            <strong>Kiralama Bitiş Tarihi :</strong> ${endRentalDateFormatted} <br>
        `;

        container.appendChild(rentalInfo);
    });
}

// Local Storage'dan verileri al
function loadRentalData() {
    const rentalId = localStorage.getItem('rentalId');
    const customerName = localStorage.getItem('customerName');
    const carModel = localStorage.getItem('carModel');
    const startDate = localStorage.getItem('startDate');
    const endDate = localStorage.getItem('endDate');
    const pickupAddress = localStorage.getItem('pickupAddress');
    const returnAddress = localStorage.getItem('returnAddress');
    const totalPrice = localStorage.getItem('totalPrice');

    console.log("Rental ID:", rentalId);
    console.log("Customer Name:", customerName);
    console.log("Car Model:", carModel);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Pickup Address:", pickupAddress);
    console.log("Return Address:", returnAddress);
    console.log("Total Price:", totalPrice);
}


// Sayfa yüklendiğinde kiralanmış araçları getir
document.addEventListener('DOMContentLoaded', () => {
    fetchRentedCars();
});
