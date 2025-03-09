import restApiUrl from "../../js/script.js";

const product = JSON.parse(sessionStorage.getItem('product'));
const imageInForm = document.querySelector(".imageInForm");
const imageInput = document.querySelector(".imageInput");
const resetBtn = document.querySelector(".resetBtn")
const form = document.querySelector(".form")
const formMode = sessionStorage.getItem('formMode');

imageInput.addEventListener("input", () => {
    imageInForm.src = imageInput.value
})
resetBtn.addEventListener("click", () => {
    imageInForm.src = "";
})

form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (form.checkValidity()) {
        if (formMode === "addNewProduct") {
            addNewProduct(data); 
        } else if (formMode === "editProduct") {
            editProduct(data, product.id);
        }
    }
    setTimeout(() => {
        window.location.href = '/pages/userProducts/userProducts.html';
    }, 3000)
    form.classList.add('was-validated')
})


function addNewProduct(newProduct) {
    const token = localStorage.getItem('token');
    axios.post(`${restApiUrl}/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(() => {
            alert("product created")
        })
        .catch((error) => {
            console.error("Error adding product:", error);
            alert("Error adding product");
        });
}



function editProduct(productForEdit, id) {
    const token = localStorage.getItem('token');
    axios.put(`${restApiUrl}/products/${id}`, productForEdit, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(() => {
            alert("product edited")
        })
        .catch((error) => {
            console.error("Error editing product:", error);
            alert("Error editing product");
        });
}

function updateUI() {
    const title = document.querySelector(".title");
    if (formMode === "addNewProduct") {
        title.innerHTML = "Create product"
    } else if (formMode === "editProduct") {
        title.innerHTML = "Edit product"

      
        const product = JSON.parse(sessionStorage.getItem("product"));

    
        if (!product) {
            console.log("No data to load the product.");
            return;
        }

       
        document.querySelector(".brandInput").value = product.brand || "";
        document.querySelector(".modelInput").value = product.model || "";
        document.querySelector(".categoryInput").value = product.category || "";
        document.querySelector(".descriptionInput").value = product.description || "";
        document.querySelector(".priceInput").value = product.price || "";
        document.querySelector(".rateInput").value = product.rate || "";
        document.querySelector(".imageInput").value = product.imageUrl || "";

      
        const imagePreview = document.querySelector(".imageInForm");
        if (product.imageUrl) {
            imagePreview.src = product.imageUrl;
        } else {
            imagePreview.src = ""; 
        }


    }
}
updateUI();