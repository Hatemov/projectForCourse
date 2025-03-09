import restApiUrl from "/js/script.js"


(() => {
    'use strict'

    
    const forms = document.querySelectorAll('.needs-validation')

  
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {

           
            const username = document.querySelector(".username").value;
            const password = document.querySelector(".password").value;



            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()

                const userData = {
                    username,  
                    password,    
                };

             
                axios.post(restApiUrl + "/auth/login", userData)
                    .then((response) => {
                     
                        if (response.data) {
                            alert("Successful login: "); 
                            localStorage.setItem("token", response.data); 
                        } else {
                            alert("Successful login"); 
                        }
                       
                        window.location.href = "/index.html";
                    })
                    .catch((error) => {
                    
                        if (error.response && error.response.data) {
                            alert("Login error: " + (error.response.data.message || error.response.data)); 
                        } else if (error.request) {
                            alert("Request error: No response from the server."); 
                        } else {
                            alert("Unknown error: " + error.message); 
                        }
                    });

            }

            form.classList.add('was-validated')
        }, false)
    })
})()