import restApiUrl from "../../js/script.js";

(() => {
    'use strict'
  
    const forms = document.querySelectorAll('.needs-validation')
  
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        } else {
          event.preventDefault()
          event.stopPropagation()
  
          form = document.querySelector(".form")
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());
          console.log(data)
          clearCart();
  
        }
        form.classList.add('was-validated')
      }, false)
    })
  })()
  

function getCartData() {
    const token = localStorage.getItem('token');
  
    axios.get(restApiUrl + "/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => {
        if (Array.isArray(response.data)) {
          showData(response.data);
        } else {
          alert("Invalid data format from the server");
        }
      })
      .catch((error) => handleError(error));
  }
  
  getCartData()


  
function showData(data) {
    const total = data.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  
  
    document.querySelector(".subtotal").innerHTML = `${total}$`;
    document.querySelector(".total").innerHTML = `${total}$`;
  
  }
  

  function clearCart() {
    const token = localStorage.getItem('token');
  
  
    axios.delete(restApiUrl + "/cart/clear", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => {
       
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 3000)
      })
      .catch((error) => handleError(error));
  }