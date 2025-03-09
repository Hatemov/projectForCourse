import restApiUrl from '../../js/script.js';

const productsContainer = document.querySelector(".products");
let allProducts = []; // Variable to store all products

function getAllProducts() {
    axios.get(`${restApiUrl}/products/all`)
        .then((response) => {
            console.log(response.data); // product data
            allProducts = response.data; // Save all products
            showProducts(allProducts); // Display all products
            showCategories(allProducts); // Display categories
            addRateFilters(allProducts);
        })
        .catch((error) => {
            console.log(error.message); // error handling
        });
}

function showProducts(products) {
  
    productsContainer.innerHTML = "";

   
    products.forEach(product => {
    
        const productDiv = document.createElement("div");
        productDiv.classList.add("col");

        productDiv.innerHTML = `
            <div class="card h-100 border-0">
                <div class="bg-light-grey p-3 " >
                    <img src='${product.imageUrl}' class="card-img-top productImage" alt="..."  data-product='${JSON.stringify(product)}'>
                </div>
                <div class="card-body">
                    <h6 class="card-title">${product.brand} ${product.model}</h6>
                    <p class="card-text">
                    <div class="text-danger">
                         ${product.price}$
                    </div>
                    <div>
                       ${showRate(product.rate)} <!-- passing product rating -->
                       <span class="text-secondary">(${product.reviewsCount || Math.round(Math.random() * 100)})</span> <!-- Number of reviews -->
                    </div>
                    <div>
                        <!-- Add data-product attribute to pass product data -->
                        <button class="btn btn-dark w-100 my-2 add-to-cart" data-product='${JSON.stringify(product)}'>add to cart</button>
                    </div>
                    </p>
                </div>
            </div>
        `;

       
        productsContainer.appendChild(productDiv);
    });

    console.log('Products displayed');

    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const product = JSON.parse(this.getAttribute('data-product'));
            addToCart(product);
        });
    });

    document.querySelectorAll('.productImage').forEach(image => {
        image.addEventListener('click', function () {
            const product = JSON.parse(this.getAttribute('data-product'));
            localStorage.setItem("product", JSON.stringify(product))
            window.location.href = '/pages/product/product.html'; 

        });
    });

}

function showRate(rate) {
    let stars = '';
    for (let i = 1; i <= rate; i++) {
        stars += '<i class="bi bi-star-fill text-warning"></i>';
    }
    return stars;
}

function addToCart(product) {
   
    const token = localStorage.getItem('token');
    console.log("Token:", token);

    // If token exists, send request to server
    if (token) {
        axios.post(`${restApiUrl}/cart/${product.id}?quantity=1`, {}, {
            headers: {
                Authorization: `Bearer ${token}`, // Send token in headers
            }
        })
            .then(response => {
                alert("Product added to cart");
                console.log("Product added to cart:", response.data);
            })
            .catch(error => {
                console.error("Error adding product to cart:", error.message);
            });
    } else {
        console.error("Error: Authorization token not found.");
    }
}

function showCategories(products) {
    const categories = document.querySelector(".categories");
    categories.innerHTML = "";
    let categoriesList = products.map((product) => {
        return product.category;
    });

    const uniqueCategories = new Set(categoriesList);

    // Display categories
    uniqueCategories.forEach((category) => {
        const div = document.createElement("div");
        div.innerText = category;
        div.classList.add("my-1");
        categories.append(div);

        // Click event handler for category
        div.addEventListener("click", () => {
            const filteredProducts = products.filter((product) => {
                return product.category === category;
            });
            showProducts(filteredProducts);
        });
    });
}

function addRateFilters(allProducts){
    const rateList = document.querySelectorAll(".rate");
    rateList.forEach(rate => {
        rate.addEventListener("click", () => {
    
            const filteredProducts = allProducts.filter((product) => {
                return product.rate == rate.dataset.rate;
            });
            showProducts(filteredProducts);
        });
    
    });
    
}

document.querySelector(".sortSelect").addEventListener("change", function (event) {
    const order = event.target.value === "1" ? 'asc' : 'desc'; // Sorting selection
    const sortedProducts = sortProductsByPrice(allProducts, order);
    showProducts(sortedProducts);
});

function sortProductsByPrice(products, order = 'asc') {
    return products.sort((a, b) => {
        if (order === 'asc') {
            return a.price - b.price; // Sort in ascending order
        } else if (order === 'desc') {
            return b.price - a.price; // Sort in descending order
        } else {
            console.error('Invalid order parameter');
            return 0;
        }
    });
}

document.querySelector(".allProductsBtn").addEventListener("click", () => {
    getAllProducts();
})

document.querySelector(".searchInput").addEventListener("input", (e) => {
    let searchWord = e.target.value.toLowerCase(); 
    let filteredProducts;

   
    filteredProducts = allProducts.filter((product) => {
        const brandAndModel = (product.brand + " " + product.model).toLowerCase(); 
        return brandAndModel.includes(searchWord);
    });

    // If search field is empty, show all products
    if (searchWord === "") {
        filteredProducts = allProducts;
    }

    showProducts(filteredProducts); 
});

getAllProducts();
