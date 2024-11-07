const BASE_PATH = "http://localhost:8080/"


function submitForm(){
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: {
            country: document.getElementById('country').value,
            city: document.getElementById('city').value,
            addressLine: document.getElementById('addressLine').value
        }
    };

console.log("form data : ", formData);

fetch(BASE_PATH + "customer/register", {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => {
    if(!response.ok){
        throw new Error("Registration request failed status code : " + response.status)
    }
    return response.json()
}).then(data => {
    console.log(data)
    window.location.href = "login.html"
}).catch(error => {
    console.error("Error : ", error); // Hata nesnesini logla
    if (error.response) {
        // Sunucudan gelen hata mesajını kontrol et
        console.error("Response data: ", error.response.data);
        console.error("Response status: ", error.response.status);
        console.error("Response headers: ", error.response.headers);
        alert('Sunucu hatası: ' + error.response.data.message); // Eğer sunucu özel bir hata mesajı döndüyse
    } else if (error.request) {
        // İstek yapıldı ama yanıt alınamadı
        console.error("Request data: ", error.request);
        alert('İstek gönderildi ama yanıt alınamadı. Lütfen bağlantınızı kontrol edin.');
    } else {
        // Diğer hatalar
        console.error("Error message: ", error.message);
        alert('Bir hata oluştu: ' + error.message);
    }
});
}

//veritabanımda kayıtlı email ile giriş yaparsa hata verecek
function displayError(message) {
    // Get or create error message container
    let errorContainer = document.getElementById('error-message');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-message';
        errorContainer.className = 'alert alert-danger d-none';
        document.querySelector('.container').prepend(errorContainer);
    }
    
    errorContainer.textContent = message;
    errorContainer.classList.remove('d-none'); // Show the error message
}