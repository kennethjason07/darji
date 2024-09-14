function showContent(id) {
    // Hide all content sections
    const contentSections = document.querySelectorAll('.content-main');
    contentSections.forEach(section => section.classList.add('hidden'));

    // Show the clicked section
    document.getElementById(id).classList.remove('hidden');

    // Fetch and display today's orders if the section is "order-overview"
    if (id === 'order-overview') {
        fetchTodaysOrders();
    }
}

function fetchTodaysOrders() {
    fetch('http://localhost:5000/api/todays-orders')
        .then(response => response.json())
        .then(data => {
            displayTodaysOrders(data);
        })
        .catch(error => {
            console.error('Error fetching today\'s orders:', error);
        });
}

function displayTodaysOrders(orders) {
const todaysOrders = document.getElementById('todays-orders');
todaysOrders.innerHTML = '';

if (orders.length === 0) {
todaysOrders.innerHTML = '<p>No orders for today.</p>';
return;
}

// Create a table for the orders
const table = document.createElement('table');
table.innerHTML = `
<thead>
    <tr>
        <th>Order ID</th>
        <th>Customer Name</th>
        <th>Order Date</th>
        <th>Delivery Date</th>
        <th>Garment Type</th>
        <th>Worker</th>
        <th>Status</th>
    </tr>
</thead>
<tbody>
    ${orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${formatDateTime(order.order_date)}</td>
            <td>${formatDateTime(order.delivery_date)}</td>
            <td>${order.garment_type}</td>
            <td>${order.worker_name}</td>
            <td>${order.order_status}</td>
                                <td>
                <button 
                    onclick="updateOrderStatus(${order.id})" 
                    ${order.order_status === 'Delivered' ? 'disabled' : ''}>
                    ${order.order_status === 'Delivered' ? 'Delivered' : 'Mark as Delivered'}
                </button>
            </td>
            </tr>

    `).join('')}
</tbody>
`;
todaysOrders.appendChild(table);
}
//new function to update order status




function formatDateTime(dateTimeString) {
    // Create a Date object from the string
    const date = new Date(dateTimeString);
    
    // Extract date in YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

function updateOrderStatus(orderId) {
const status = 'Delivered';

fetch(`http://127.0.0.1:5000/api/orders/${orderId}`, {
method: 'PATCH',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify({ order_status: status })
})
.then(response => response.json())
.then(data => {
console.log('Order status updated:', data);
alert(`Order ${orderId} status updated to Delivered`);
// Optionally, refresh the list to reflect the updated status
location.reload();
})
.catch(error => {
console.error('Error updating order status:', error);
alert('An error occurred while updating the order status.');
});
}

document.getElementById('customer-info-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const mobileNumber = document.getElementById('customer-mobile-number').value;

    fetch(`http://127.0.0.1:5000/api/customer-info/${mobileNumber}`)
        .then(response => response.json())
        .then(data => {
            displayCustomerOrders(data.order_history);
        })
        .catch(error => {
            console.error('Error fetching customer data:', error);
            alert('No orders found for this customer.');
        });
});

function displaySearchResults(customers) {
const searchResults = document.getElementById("search-results");
searchResults.innerHTML = "";

customers.forEach(customer => {
const resultItem = document.createElement("div");
resultItem.className = "result-item";
resultItem.innerHTML = `
    <table>
        <tr>
            <th>Customer Name:</th>
            <td>${customer.name}</td>
        </tr>
        <tr>
            <th>Mobile Number:</th>
            <td>${customer.mobile}</td>
        </tr>
    </table>
    <button onclick="fetchCustomerOrders(${customer.id})">View Orders</button>
`;
searchResults.appendChild(resultItem);
});
}

function displayCustomerOrders(orders) {
const orderDetails = document.getElementById("order-details");
orderDetails.innerHTML = "<h3>Customer Orders:</h3>";

if (orders.length === 0) {
orderDetails.innerHTML += "<p>No orders found for this customer.</p>";
return;
}

const orderTable = document.createElement("table");
orderTable.className = "orders-table";

const tableHeader = `
<tr>
    <th>Order ID</th>
    <th>Garment Type</th>
    <th>Quantity</th>
    <th>Order Date</th>
    <th>Due Date</th>
    <th>Status</th>
</tr>
`;
orderTable.innerHTML = tableHeader;

orders.forEach(order => {
const orderRow = `
    <tr>
        <td>${order.id}</td>
        <td>${order.garment_type}</td>
        <td>${order.quantity}</td>
        <td>${formatDateTime(order.order_date)}</td>
        <td>${formatDateTime(order.delivery_date)}</td>
        <td>${order.status}</td>
    </tr>
`;
orderTable.innerHTML += orderRow;
});

orderDetails.appendChild(orderTable);
}

document.getElementById('new-bill-form').addEventListener('submit', function (event) {
event.preventDefault();

const formData = new FormData(this);
const garmentType = formData.get('garment_type'); // Retrieve the selected garment type

const data = {
garment_type: garmentType,
// Collect other form data as needed
pant_options: formData.get('pant_options'),
shirt_options: formData.get('shirt_options'),
quantity: formData.get('quantity'),
order_date: formData.get('today_date'),
delivery_date: formData.get('due_date'),
worker_name: formData.get('worker_name'),
customer_name: formData.get('customer_name'),
mobile_number: formData.get('mobile_number')
};

console.log('Form Data:', data); // Debugging line to see the form data

fetch('http://127.0.0.1:5000/api/new-bill', {
method: 'POST',
headers: {
    'Content-Type': 'application/json'
},
body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => {
console.log('Bill created:', result);
alert('Bill created successfully');
this.reset();
})
.catch(error => {
console.error('Error creating bill:', error);
alert('An error occurred while creating the bill.');
});
});


function sortOrders(sortType) {
    const sortStatus = document.getElementById('sort-status').value;

    fetch(`http://127.0.0.1:5000/api/orders?status=${sortStatus}`)
        .then(response => response.json())
        .then(data => {
            displayOrders(data);
        })
        .catch(error => {
            console.error('Error sorting orders:', error);
        });
}

function displayOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';

    orders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <h3>Order ID: ${order.id}</h3>
            <h3>Customer Name: ${order.customer_name}</h3>
            <p>Order Date: ${formatDateTime(order.order_date)}</p>
            <p>Due Date: ${formatDateTime(order.delivery_date)}</p>
            <p>Worker: ${order.worker_name}</p>
            <p>Mobile Number: ${order.mobile_number}</p>
            <p>Garment Type: ${order.garment_type}</p>
        `;
        ordersList.appendChild(orderItem);
    });
}

// Initialize the page with the first tab active
showContent('order-overview');
//workers data and work fetch
function fetchWorkerInfo(workerName) {
if (!workerName) {
return; // Exit if no worker name is selected
}

fetch(`http://127.0.0.1:5000/api/worker-info/${encodeURIComponent(workerName)}`)
.then(response => response.json())
.then(data => {
    displayWorkerInfo(data);
})
.catch(error => {
    console.error('Error fetching worker information:', error);
    alert('An error occurred while fetching worker information.');
});
}

function displayWorkerInfo(workerData) {
const workerList = document.getElementById('workerinfo');
workerList.innerHTML = '';

if (!workerData || workerData.length === 0) {
workerList.innerHTML = '<p>No information available for this worker.</p>';
return;
}

// Example: Display worker's orders
const table = document.createElement('table');
table.innerHTML = `
<thead>
    <tr>
        <th>Order ID</th>
        <th>Garment Type</th>
        <th>Quantity</th>
        <th>Order Date</th>
        <th>Delivery Date</th>
        <th>Status</th>
    </tr>
</thead>
<tbody>
    ${workerData.orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.garment_type}</td>
            <td>${order.quantity}</td>
            <td>${formatDateTime(order.order_date)}</td>
            <td>${formatDateTime(order.delivery_date)}</td>
            <td>${order.order_status}</td>
        </tr>
    `).join('')}
</tbody>
`;

workerList.appendChild(table);
}



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