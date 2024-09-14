function showContent(id) {
    // Hide all content sections
    const contentSections = document.querySelectorAll('.content-main');
    contentSections.forEach(section => section.classList.add('hidden'));

    // Show the clicked section
    document.getElementById(id).classList.remove('hidden');
}
function searchCustomer() {
    const searchInput = document.getElementById("search-input").value;
    fetch(`https://your-backend-api.com/customers?mobile=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data);
        })
        .catch(error => {
            console.error('Error fetching customer data:', error);
        });
}

function displaySearchResults(customers) {
    const searchResults = document.getElementById("search-results");
    searchResults.innerHTML = "";

    customers.forEach(customer => {
        const resultItem = document.createElement("li");
        resultItem.textContent = `${customer.name} - ${customer.mobile}`;
        resultItem.onclick = function () {
            fetchCustomerOrders(customer.id);
        };
        searchResults.appendChild(resultItem);
    });
}

function fetchCustomerOrders(customerId) {
    fetch(`https://your-backend-api.com/orders?customerId=${customerId}`)
        .then(response => response.json())
        .then(orders => {
            displayCustomerOrders(orders);
        })
        .catch(error => {
            console.error('Error fetching customer orders:', error);
        });
}

function displayCustomerOrders(orders) {
    const orderDetails = document.getElementById("order-details");
    orderDetails.innerHTML = "<h3>Customer Orders:</h3>";
    const orderList = document.createElement("ul");

    orders.forEach(order => {
        const orderItem = document.createElement("li");
        orderItem.textContent = `Order ID: ${order.id}, Garment: ${order.garment_type}, Quantity: ${order.quantity}`;
        orderList.appendChild(orderItem);
    });

    orderDetails.appendChild(orderList);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
});

function fetchOrders() {
    fetch('https://your-backend-api.com/orders')
        .then(response => response.json())
        .then(orders => {
            displayOrders(orders);
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });
}

function displayOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';  // Clear previous content

    orders.forEach(order => {
        const orderItem = document.createElement('li');
        orderItem.textContent = `Order ID: ${order.id}, Garment: ${order.garment_type}, Quantity: ${order.quantity}, Status: ${order.status}, Order Date: ${order.order_date}`;
        ordersList.appendChild(orderItem);
    });
}

function sortOrders(criteria) {
    fetch('https://your-backend-api.com/orders')
        .then(response => response.json())
        .then(orders => {
            let sortedOrders = orders;
            
            if (criteria === 'date') {
                const dateSortOrder = document.getElementById('sort-date').value;
                sortedOrders = orders.sort((a, b) => {
                    return dateSortOrder === 'newest' ? new Date(b.order_date) - new Date(a.order_date) : new Date(a.order_date) - new Date(b.order_date);
                });
            } else if (criteria === 'status') {
                const statusFilter = document.getElementById('sort-status').value;
                if (statusFilter !== 'all') {
                    sortedOrders = orders.filter(order => order.status.toLowerCase() === statusFilter);
                }
            }
            
            displayOrders(sortedOrders);
        })
        .catch(error => {
            console.error('Error sorting orders:', error);
        });
}

async function fetchWorkers() {
    try {
        const response = await fetch('/api/workers'); // Replace with your backend API endpoint
        const workers = await response.json();

        const workerList = document.getElementById('worker-list');
        workerList.innerHTML = ''; // Clear existing content

        workers.forEach(worker => {
            // Create a worker profile card
            const workerCard = document.createElement('div');
            workerCard.classList.add('worker-card');
            workerCard.innerHTML = `
                <h3>${worker.name}</h3>
                <p>${worker.role}</p>
                <button onclick="showWorkerOrders(${worker.id})">View Orders</button>
            `;
            workerList.appendChild(workerCard);
        });
    } catch (error) {
        console.error('Error fetching workers:', error);
    }
}

// Function to fetch and display orders for a specific worker
async function showWorkerOrders(workerId) {
    try {
        const response = await fetch(`/api/workers/${workerId}/orders`); // Replace with your backend API endpoint
        const orders = await response.json();

        const workerOrdersSection = document.getElementById('worker-orders');
        workerOrdersSection.innerHTML = ''; // Clear existing content

        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.innerHTML = `
                <h4>Order ID: ${order.id}</h4>
                <p>Garment Type: ${order.garment_type}</p>
                <p>Status: ${order.status}</p>
                <p>Due Date: ${order.due_date}</p>
            `;
            workerOrdersSection.appendChild(orderItem);
        });

        showContent('worker-orders'); // Show the worker orders section
    } catch (error) {
        console.error('Error fetching worker orders:', error);
    }
}

// Call fetchWorkers when the page loads or when this section is shown
document.addEventListener('DOMContentLoaded', fetchWorkers);


function toggleMeasurements() {
    var pantSection = document.getElementById("pant-section");
    var shirtSection = document.getElementById("shirt-section");
    var extraSection = document.getElementById("extra-section");

    // Get the selected radio button value
    var selectedValue = document.querySelector('input[name="measurements-selection"]:checked').value;
    
    // Show/Hide sections based on the selection
    if (selectedValue === "pant") {
        pantSection.classList.remove("hidden");
        shirtSection.classList.add("hidden");
        extraSection.classList.add("hidden");
    } else if (selectedValue === "shirt") {
        shirtSection.classList.remove("hidden");
        pantSection.classList.add("hidden");
        extraSection.classList.add("hidden");
    } else if (selectedValue === "extra") {
        extraSection.classList.remove("hidden");
        shirtSection.classList.add("hidden");
        pantSection.classList.add("hidden");
    }
}

function calculateTotals() {
    // Get quantity and amount input values
    const suitQty = parseFloat(document.getElementById('suit_qty').value) || 0;
    const suitAmt = parseFloat(document.getElementById('suit_amount').value) || 0;

    const safariQty = parseFloat(document.getElementById('safari_qty').value) || 0;
    const safariAmt = parseFloat(document.getElementById('safari_amount').value) || 0;

    const pantQty = parseFloat(document.getElementById('pant_qty').value) || 0;
    const pantAmt = parseFloat(document.getElementById('pant_amount').value) || 0;

    const shirtQty = parseFloat(document.getElementById('shirt_qty').value) || 0;
    const shirtAmt = parseFloat(document.getElementById('shirt_amount').value) || 0;

    // Calculate total quantities and total amount
    const totalQty = suitQty + safariQty + pantQty + shirtQty;
    const totalAmt = suitAmt + safariAmt + pantAmt + shirtAmt;

    // Update the total quantity and amount in the respective fields
    document.getElementById('total_qty').value = totalQty;
    document.getElementById('total_amt').value = totalAmt.toFixed(2);
}



