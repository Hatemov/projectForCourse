import restApiUrl from "/js/script.js"

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {

          
            const name = document.querySelector(".name").value;
            const surname = document.querySelector(".surname").value;
            const email = document.querySelector(".email").value;
            const username = document.querySelector(".username").value;
            const password = document.querySelector(".password").value;



            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                event.preventDefault()
                event.stopPropagation()

             
                const newUser = {
                    name,        
                    surname,     
                    username,   
                    password,    
                    email,      
                };

                axios.post(restApiUrl + "/auth/register", newUser)
                    .then((response) => {
           
                        console.log(response.data);
                        if (response.data.message) {
                            alert("Successful registration: " + response.data.message);
                        } else {
                            alert("Registration was successful!");
                        }
                       
                        window.location.href = "/pages/logIn/login.html";
                    })
                    .catch((error) => {
                        console.error(error);

                      
                        if (error.response) {
                         
                            alert("Error during registration: " + error.response.data);
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
