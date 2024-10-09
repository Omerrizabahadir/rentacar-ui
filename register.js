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
    console.error("Error : ", error);
});
}