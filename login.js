const BASE_PATH = "http://localhost:8080/"

function submitForm(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log("email : " + email)
    console.log("password : " + password)

    fetch(BASE_PATH + "customer/login", {
       method: 'POST',
       body: JSON.stringify({
        email: email,
        password: password
       }),
       headers: {
        'Content-Type': 'application/json'
       }
    }).then(response => {
        if(!response.ok) {
            throw new Error("Login request failed status code : " + response.status)
        }
        return response.json()
    }).then(data => {
        console.log(data)
        localStorage.setItem("jwtToken", data.token)
        localStorage.setItem("customerId", data.customerId)

        const role = parseJwt(data.token)
        showSuccessAlert("User login successfully!");

        if(role === "ROLE_ADMIN"){
            window.location.href = "admin.html"
        }else if (role === "ROLE_USER") {
            window.location.href = "index.html"
        }
    }).catch(error => {
        showFailAlert("Login failed: " + error.message);
    })
}
 //success alert 'i
 function showSuccessAlert(message) {
    let alert = document.getElementById('success-alert');
    alert.style.display = 'block';
    alert.style.opacity = 2;

    let alertMessage = document.getElementById('successAlertMessage');
    alertMessage.textContent = message;
    setTimeout(() => {                         
        let opacity = 2;
        let timer = setInterval(() => {
            if (opacity <= 0.1) {
                clearInterval(timer);
                alert.style.display = 'none';
            }
            alert.style.opacity = opacity;
            opacity -= 0.1;
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
            opacity -= 0.1;
        }, 50);
    }, 3000);
}

function parseJwt(token) {
    if(!token){
        return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');

    const decodedData = JSON.parse(window.atob(base64));

    return decodedData.authorities[0].authority
    
}