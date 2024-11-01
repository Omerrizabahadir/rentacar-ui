const BASE_PATH = "http://localhost:8080/";
const BASE_IMAGE_PATH = "/Users/macbook/Documents/GitHub/rentacar/";
const jwtToken = localStorage.getItem('jwtToken');

// Markaları al
async function fetchBrands() {
    try {
        const response = await fetch(`${BASE_PATH}brand`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Brand fetch failed');
        
        const brands = await response.json();
        const brandSelect = document.getElementById('brandSelect');
        
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.id;
            option.textContent = brand.name;
            brandSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
    }
}

// Seçilen markaya göre araçları al
async function fetchCarsByBrand(brandId) {
    if (!brandId) return;

    try {
        const response = await fetch(`${BASE_PATH}car/brand/${brandId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Cars fetch failed');

        const cars = await response.json();
        displayCarImages(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
    }
}

// Araç görsellerini görüntüle
function displayCarImages(cars) {
    const carImagesContainer = document.getElementById('carImagesContainer');
    carImagesContainer.innerHTML = ''; // Önceki görselleri temizle

    cars.forEach(car => {
        const img = document.createElement('img');
        img.src = `${BASE_IMAGE_PATH}${car.image}`; // Araç görseli yolu
        img.alt = car.name;
        img.className = 'car-image';
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3'; // Bootstrap için sütun ayarı
        col.appendChild(img);
        carImagesContainer.appendChild(col);
    });
}

// Sayfa yüklendiğinde markaları al
document.addEventListener('DOMContentLoaded', fetchBrands);


