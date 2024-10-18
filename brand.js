const jwtToken = localStorage.getItem('jwtToken');
const BASE_PATH = "http://localhost:8080/"

var currentBrandId = 0;

function getAllBrand(){

    fetch(BASE_PATH + "brand", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        }
    }).then(response => {
        if(!response.ok){
            throw new Error("Failed to get brands, response status : ", response.status)
        }
        return response.json();
    }).then(brands => {
        displayBrands(brands)
    }).catch(error => {
        console.error('Error : ', error);
    });
}
function displayBrands(brands){
    const brandTableBody = document.getElementById('brandTableBody');
    brandTableBody.innerHTML = "";
    brands.forEach(brand => {
        const row = brandTableBody.insertRow();
        row.innerHTML = `
        <td>${brand.id}</td> 
        <td>${brand.name}</td>
        <td>
            <button class="btn btn-warning" onclick = "getBrandAndShowModal(${brand.id})">Update</button>
            <button class="btn btn-danger" onclick="showDeleteBrandModal(${brand.id})">Delete</button>
        </td>
      `;
    });
}

/*-----------------add brand---------------*/
/*ister onclick="addBrand()"" ile bunu yaparsın veya butona tıklayınca dinleyerek ->addEventListener('DOMContentLoaded') içine yazdım */
/*async function addBrand() {
    const brandName = document.getElementById('brandName').value;

    fetch(BASE_PATH + "brand/create", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        },
        body: JSON.stringify({ name: brandName})
    }).then(response => {
        if(!response.ok){
            throw new Error("An error occurred while adding a brand.")
        }
        return response.json();
    }).then(brand => {
         console.log(brand);
        getAllBrand();
        showSuccessAlert("Brand added successfully!");
       
    }).catch (error => {
        console.error("Error : ", error);
        showFailAlert("Failed to add brand: " + error.message);
    })
}
*/

//-----------------------Update-------------------

 async function updateBrand(){

    const brandId = document.getElementById('updateBrandId').value       //input'un id si
    const brandName = document.getElementById('updateBrandName').value   //input'un id'si

    bodyData = JSON.stringify({
        id: brandId,
        name: brandName,
    })

    fetch(BASE_PATH + "brand/update", {
        method: 'PUT',
        body: bodyData,
        headers: {
    
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
            
        }
    }).then(response => {
        if(!response.ok){
            throw new Error("Brand put request failed, code status : ", response.status)
        }
        return response.json();

    }).then(brand => {
        console.log(brand);
        showSuccessAlert("Brand updated successfully!")
        hideUpdateModal('updateBrandModal')
        getAllBrand();

    }).catch(error => {
        console.error("Error : ", error);
    });
}
    function getBrandAndShowModal(brandId) {
        
        fetch(BASE_PATH + "brand/" + brandId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error("Brand get request failed code status : " + response.status)
            }
            return response.json();
        }).then(brand => {
            
            document.getElementById('updateBrandId').value = brand.id;
            document.getElementById('updateBrandName').value = brand.name;
            
            const updateBrandModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('updateBrandModal'))
            updateBrandModal.show();

        }).catch(error => {
            console.error('Error:', error);
        });
    }
    function hideUpdateModal(modalId) {
        const updateModal = document.getElementById(modalId);
        const updateBrandModal = bootstrap.Modal.getInstance(updateModal);
        if (updateBrandModal) {
            updateBrandModal.hide();
        }
    }

    //-----------------------Delete-------------------
    async function deleteBrand() {
        if (currentBrandId !== 0) {
            try {
                const response = await fetch(BASE_PATH + "brand/" + currentBrandId, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwtToken
                    }
                });
    
                if (!response.ok) {
                    const data = await response.json();
                    if (data && data.message) {                        
                        showFailAlert(data.message);                           
                    }
                } else {
                    showSuccessAlert('Brand deleted successfully'); 
                    getAllBrand();
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                hideDeleteModal('deleteBrandModal');
            }
        }
    }
    //MODAL hide
    function hideDeleteModal(modalId) {
        const deleteBrandModal = bootstrap.Modal.getOrCreateInstance(document.getElementById(modalId))
        deleteBrandModal.hide();
    }

    //Modal show
    function showDeleteBrandModal(brandId) {
        currentBrandId = brandId
        const deleteBrandModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteBrandModal'))
        deleteBrandModal.show();
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
                opacity -= opacity * 0.1;
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
                opacity -= opacity * 0.1;
            }, 50);
        }, 3000);
    }


document.addEventListener('DOMContentLoaded', async () => {
    await getAllBrand();

    document.getElementById('addBrandBtn').addEventListener("click", function () { //addEventListener da onclick="addBrand()" sil ve butonın id 'sini ekle buraya
        const brandName = document.getElementById('brandName').value; 

        
         if (!brandName) {
            showFailAlert("Brand name cannot be empty!");
            return; 
        }
        fetch(BASE_PATH + "brand/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwtToken
            },
            body: JSON.stringify({ name: brandName })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("An error occurred while adding a brand.");
            }
            return response.json();
        })
        .then(brand => {
            getAllBrand(); 
            showSuccessAlert("Brand added successfully!");
            console.log(brand);
        })
        .catch(error => {
            console.error("Error: ", error);
            showFailAlert("Failed to add brand: " + error.message);
        });
    });
});
