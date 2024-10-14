    const BASE_PATH = "http://localhost:8080/"
    const BASE_IMAGE_PATH_= "/Users/macbook/Documents/GitHub/rentacar/"
    const jwtToken = localStorage.getItem('jwtToken');


    async function addCar(){

        const carBrandId = document.getElementById('brandSelect').value;
        const fileInput = document.getElementById('carImage');
        const modelName = document.getElementById('modelName').value;
        const dailyPrice = document.getElementById('dailyPrice').value;
        const carAvailableStock = document.getElementById('carAvailableStock').value;
        const gearBox = document.getElementById('gearBox').value;
        const color = document.getElementById('color').value;
        const carStatus = document.getElementById('carStatus').value;
        const active = document.getElementById('carActive').checked;
        const isRented = document.getElementById('isRented').checked;
        const mileage = document.getElementById('mileage').value;

        const formData = new FormData();
        console.log("formData", formData)
        formData.append("file", fileInput.files[0]); // Yüklemek istediğiniz dosya
        formData.append("brandId", carBrandId); // Brand ID
        formData.append("modelName", modelName); // Model adı
        formData.append("color", color); // Renk
        formData.append("carStatus", carStatus); // Araç durumu
        formData.append("active", active); // Aktif mi
        formData.append("isRented", isRented); // Kiralandı mı
        formData.append("carAvailableStock", carAvailableStock); // Mevcut stok
        formData.append("gearBox", gearBox); // Vites türü
        formData.append("mileage", mileage); // Kilometre
        formData.append("dailyPrice", dailyPrice); // Günlük fiyat

        await fetch(BASE_PATH + "car/create", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + jwtToken
            },
            body: formData
        }).then(response => {
            if (!response.ok) {
                throw new Error("Car ekleme isteği başarısız durum kodu : " + response.status)
            }
           return response.json()
        }).then(data => {
            console.log(data)
        }).catch(error => {
            console.error('Error:', error);
        });
    }