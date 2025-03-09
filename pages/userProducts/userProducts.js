
import restApiUrl from "../../js/script.js";

const tbody = document.querySelector(".tbody")
const imageInModal = document.querySelector(".imageInModal")
const addNewProductBtn = document.querySelector(".addNewProductBtn")


function getAllProducts() {
    const token = localStorage.getItem('token');
    axios.get(`${restApiUrl}/products`, {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then((response) => {
            const products = response.data;
            console.log(products)
            showProducts(products)
            addEventToImageinModal();
            addEventToDeleteBtn();
            addEventToEditBtn();

        })
        .catch((error) => {
            console.error("Error getting product list:", error);
            alert("Error getting product list");
        });
}

getAllProducts();

function showProducts(products) {
    tbody.innerHTML = "";

    products.forEach((product, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${product.brand}</td>
        <td>${product.model}</td>
        <td>${product.category}</td>
        <td>
            <img 
                src="${product.imageUrl}" 
                class="imageInTable" 
                width="200" 
                data-bs-toggle="modal" 
                data-bs-target="#imageModal" 
            />
        </td>
        <td>${product.price} $</td>
        <td>${product.rate}/5</td>
        <td>
            <button 
                class="btn btn-primary mx-2 edit-btn" 
                data-id="${product.id}" 
                data-product='${JSON.stringify(product)}' 
                data-bs-toggle="modal" 
                data-bs-target="#productModal">
                Редактировать
            </button>
            <button 
                class="btn btn-danger delete-btn" 
                data-id="${product.id}">
                Удалить
            </button>
        </td>
    `;
        tbody.appendChild(tr);
    });
}


function addEventToImageinModal() {
    const imagesInTable = document.querySelectorAll(".imageInTable");
    imagesInTable.forEach((imageInTable) => {
        imageInTable.addEventListener("click", () => {
            imageInModal.src = imageInTable.src;
        })
    })
}

function addEventToDeleteBtn() {
    const deleteBtnList = document.querySelectorAll(".delete-btn");

    deleteBtnList.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", () => {

            const token = localStorage.getItem("token");

            if (confirm("Are you sure you want to delete this product?")) {
                const productId = deleteBtn.getAttribute("data-id");

                axios
                    .delete(`${restApiUrl}/products/${productId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then(() => {
                        alert("Product successfully deleted");
                        getAllProducts();
                    })
                    .catch((error) => {
                        console.error("Error deleting product:", error);
                        alert("Error deleting product");
                    });
            }
        });
    });
}

addNewProductBtn.addEventListener("click", () => {
    sessionStorage.setItem("formMode", "addNewProduct" )

    window.location.href = '/pages/newProduct/newProduct.html';
   
});

function addEventToEditBtn() {
    const editBtnList = document.querySelectorAll(".edit-btn");

    editBtnList.forEach((editBtn) => {
        editBtn.addEventListener("click", () => {
            const product = editBtn.getAttribute("data-product");

            sessionStorage.setItem('product', product )
            sessionStorage.setItem('formMode', "editProduct" )

            window.location.href = '/pages/newProduct/newProduct.html';
            
        });
    });
}


