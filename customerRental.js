const BASE_PATH = 'http://localhost:8080/'; // API temel yolunu buraya ekleyin
const customerId = localStorage.getItem("customerId"); // Müşteri ID'sini yerel depolamadan al
const jwtToken = localStorage.getItem("jwtToken"); // JWT tokeninizi yerel depolamadan al

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
        displayRentedCars(rentedCars); // Araçları görüntüle
    } catch (error) {
        console.error("Error fetching rented cars: ", error);
    }
}

function displayRentedCars(cars) {
    const container = document.getElementById('rented-cars');
    container.innerHTML = ''; // Önceki verileri temizle

    if (cars.length === 0) {
        container.textContent = 'Henüz kiralanmış bir aracınız yok.';
        return;
    }

    cars.forEach(car => {
        const carElement = document.createElement('div');
        carElement.textContent = `Rental ID: ${car.rentalId}, Customer: ${car.firstName} ${car.lastName}, Car: ${car.name} ${car.modelName}`;
        container.appendChild(carElement);
    });
}

// Sayfa yüklendiğinde kiralanmış araçları getir
document.addEventListener('DOMContentLoaded', () => {
    fetchRentedCars();
});
