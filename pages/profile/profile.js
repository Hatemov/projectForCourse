import restApiUrl from "../../js/script.js";


function getUserProfile() {
    const token = localStorage.getItem('token'); 
    if (token) {
        axios.get(`${restApiUrl}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                let user = response.data

                document.querySelector(".info").innerHTML = `
                <div class="p-4 fs-1">
                    <h3 class="text-danger fw-bold mb-3 fs-1">User Details</h3>
                    <p class="mb-1"><strong>Name:</strong> ${user.name}</p>
                    <p class="mb-1"><strong>Surname:</strong>  ${user.surname}</p>
                    <p class="mb-1"><strong>Email:</strong>  ${user.email}</p>
                    <p class="mb-1"><strong>Username:</strong>  ${user.username}</p>
                </div>
                `

            })
            .catch(error => {
                if (error.response) {
                    console.error('Ошибка сервера:', error.response.data); 
                } else {
                    console.error('Сетевая ошибка:', error.message); 
                }
            });
    } else {
        alert("No profile available");
       
    }
}
getUserProfile();