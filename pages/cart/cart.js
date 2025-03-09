import restApiUrl from "../../js/script.js";
let totalPrice = null;

function getCartData() {
    const token = localStorage.getItem('token');

    axios.get(restApiUrl + "/cart", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    .then((response) => {
        if (Array.isArray(response.data)) {
            showCart(response.data);
        } else {
            alert("Invalid data format from the server");
        }
    })
}




function showCart(cart) {
    const list = document.querySelector(".list");
    list.innerHTML = "";
    let total = 0;

    cart.forEach(product => {
        const imageUrl = product.imageUrl || "default-image-url.jpg";
        const brand = product.brand || "Unknown brand";
        const model = product.model || "Unknown model";
        const price = product.price || 0;
        const quantity = product.quantity || 1;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td scope="row">
                <img width="100px" src="${imageUrl}" alt="${brand} ${model}">
                <span>${brand} ${model}</span>
            </td>
            <td>${price}$</td>
            <td>
                <input class="form-control quantity-input" min="1" style="width: 60px;" 
                       type="number" value="${quantity}" data-product-id="${product.productId}">
            </td>
            <td class="subtotal">${price * quantity}$</td>
            <td>
                <button class="btn btn-danger btn-sm remove-btn" data-product-id="${product.productId}">
                    Remove
                </button>
            </td>
        `;
        total += price * quantity;
        totalPrice = total;

        list.appendChild(tr);
    });

    updateTotals(total);

   
    setupCartEventListeners();
}
function setupCartEventListeners() {
    
    const quantityInputs = document.querySelectorAll(".quantity-input");
    quantityInputs.forEach(input => {
        input.addEventListener("change", (event) => {
            const productId = event.target.getAttribute("data-product-id");
            const newQuantity = parseInt(event.target.value, 10);
            if (newQuantity > 0) {
                updateCart(productId, newQuantity);
            } else {
                alert("Количество должно быть больше 0");
            }
        });
    });

    
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const productId = event.target.getAttribute("data-product-id");
            removeFromCart(productId);
        });
    });
}


function updateCart(productId, quantity) {
    const token = localStorage.getItem('token');

    axios.put(`${restApiUrl}/cart/${productId}`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            quantity: quantity
        }
    })
    .then((response) => {
        getCartData();
    })
    .catch((error) => handleError(error));
}


function removeFromCart(productId) {
    const token = localStorage.getItem('token');

    axios.delete(`${restApiUrl}/cart/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    .then(() => {
        alert("Товар удален из корзины");
        getCartData();
    })
    .catch((error) => handleError(error));
}


function updateTotals(total) {
    document.querySelector(".subtotalElement").textContent = `${total}$`;
    document.querySelector(".totalElement").textContent = `${total}$`;
}



function handleError(error) {
    if (error.response) {
        alert("Ошибка сервера: " + error.response.data.message || error.response.data);
    } else if (error.request) {
        alert("Ошибка запроса: сервер не ответил");
    } else {
        alert("Неизвестная ошибка: " + error.message);
    }
}


document.querySelector(".checkoutBtn").addEventListener("click", () => {
    if (totalPrice){
        window.location.href = "/pages/checkout/checkout.html";

    } else {
        alert("Empty cart")
    }

})

getCartData();
