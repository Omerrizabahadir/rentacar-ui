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
            console.error("HTTP error! status: " + response.status);
            throw new Error("HTTP error! status: " + response.status);
        }

        const rentals = await response.json();
        console.log("Pending rentals fetched successfully:", rentals);
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

    console.log("Rendering pending rentals:", rentals);
    pendingRentalsList.innerHTML = rentals.map(rental => {
        
        const customerName = `${rental.firstName} ${rental.lastName}`;

        return `
         <tr>
                <td>${customerName}</td>
                <td>${rental.brandName}</td>
                <td>${rental.modelName}</td>
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
    console.log("Confirming delivery for rental ID:", rentalId);
    try {
        const response = await fetch(BASE_PATH + "rental/return/" + rentalId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        });

        if (!response.ok) {
            console.error("Failed to confirm delivery, status: " + response.status);
            throw new Error("Failed to confirm delivery: " + response.status);
        }

        alert('Rental confirmed successfully!');
        getPendingRentals(); 
    } catch (error) {
        console.error("Error confirming delivery:", error);
        alert('Teslimat onaylanırken bir hata oluştu.');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    getPendingRentals();
});
