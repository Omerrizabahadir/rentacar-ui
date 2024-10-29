const BASE_PATH = "http://localhost:8080/";
const jwtToken = localStorage.getItem('jwtToken');


async function getPendingRentals() {
    try {
        const response = await fetch(BASE_PATH + "rental/pending", {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + jwtToken,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("HTTP error! status: " + response.status);
        }

        const rentals = await response.json();
        renderPendingRentals(rentals);
    } catch (error) {
        console.error("Error fetching pending rentals:", error);
    }
}

function renderPendingRentals(rentals) {
    const pendingRentalsList = document.getElementById("pendingRentalsList");
    if (!pendingRentalsList) {
        console.error("Element 'pendingRentalsList' not found.");
        return;
    }

    pendingRentalsList.innerHTML = rentals.map(rental => {

        const rentalId = rental.id;
        console.log("Rental ID:", rental.rentalId);
        return `
           
         <tr>
                <td>${rental.customerName}</td>
                <td>${rental.carModel}</td>
                <td>${rental.startRentalDate}</td>
                <td>${rental.endRentalDate}</td>
                <td>
                    <button class="btn btn-success" onclick="confirmDelivery(${rental.rentalId})">Teslim Alındı</button>
                </td>
            </tr>
        `;
    }).join("");
}

async function confirmDelivery(rentalId) {
    try {
        const response = await fetch(BASE_PATH + "rental/return/" + rentalId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        });

        if (!response.ok) {
            throw new Error("Failed to confirm delivery: " + response.status);
        }
        
        alert('Rental confirmed successfully!');
        getPendingRentals(); // Listeyi güncelle
    } catch (error) {
        console.error("Error confirming delivery:", error);
        alert('Teslimat onaylanırken bir hata oluştu.');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    getPendingRentals();
});
