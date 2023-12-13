class Restaurant {
    /**
     * Constructor for the Restaurant class.
     */
    constructor() {
        /** @private */
        this.tables = [];
        for (let i = 0; i < 20; i++) {
            this.tables.push(new Table());
        }

    }

    /**
     * Generates buttons for the tables and adds event listeners to handle click events.
     */
    generateTableButtons() {
        const tableContainer = document.getElementById("table-Of-Tables");
        tableContainer.innerHTML = ""; // Clear existing buttons

        for (let i = 0; i < 20; i++) {
            const tableButton = document.createElement("button");
            tableButton.innerText = `${i + 1}`;
            tableButton.classList.add("tableButton");
            tableButton.style.cssText = `width: 3rem;
                                        height: 3rem;
                                        margin: 5px;
                                        border: 1px solid #000;
                                        text-align: center;
                                        font-size: 16px;
                                        cursor: pointer;`;

            tableButton.addEventListener("click", () => this.handleTableButtonClick(i));
            tableContainer.appendChild(tableButton);
            
        }
    }

    /**
     * Handles the click event of a table button.
     *
     * @param {number} tableIndex - The index of the table button clicked.
     */
   handleTableButtonClick(tableIndex) {
    const tableButtons = document.getElementsByClassName("tableButton");
    const clickedButton = tableButtons[tableIndex];

    // Resetar todos os botões de mesa para o estilo padrão
    for (let i = 0; i < tableButtons.length; i++) {
        tableButtons[i].style.backgroundColor = "";
        tableButtons[i].style.color = "";
    }

    // Destacar o botão de mesa clicado
    clickedButton.style.backgroundColor = "lightblue";

    // Criar TableDetailsDiv e exibir detalhes da mesa
    const tableDetailsDiv = document.getElementById("container-Details");
    tableDetailsDiv.innerHTML = ""; // Limpar conteúdo existente

    const tableHeader = document.createElement("h2");
    tableHeader.innerText = `Table ${tableIndex + 1}`;
    tableDetailsDiv.appendChild(tableHeader);

    const orderTable = document.createElement("table");
    orderTable.innerHTML = `
        <tr>
            <th>Products</th>
            <th>Quantity</th>
            <th>Price</th>
        </tr>
    `;
    tableDetailsDiv.appendChild(orderTable);

    const totalLabel = document.createElement("label");
    totalLabel.id = "orderTotalValueLabel";
    totalLabel.innerText = `Total Value: `;
    tableDetailsDiv.appendChild(totalLabel);
    
    tableDetailsDiv.appendChild(document.createElement("br"));

    const createButton = document.createElement("button");
    createButton.innerText = "Create";
    createButton.addEventListener("click", () => this.handleCreateButtonClick(tableIndex));
    tableDetailsDiv.appendChild(createButton);

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", () => this.handleEditButtonClick(tableIndex));
    tableDetailsDiv.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => this.handleDeleteButtonClick(tableIndex));
    tableDetailsDiv.appendChild(deleteButton);

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => this.handleCloseButtonClick(tableIndex));
    tableDetailsDiv.appendChild(closeButton);

    // Atualizar a tabela de detalhes
    updateDetailTable(tableIndex);
}


    /**
     * Handles the click event of the Create button.
     *
     * @param {number} tableIndex - The index of the table associated with the Create button.
     */
    handleCreateButtonClick(tableIndex) {
        const createDiv = document.createElement("div");
        createDiv.innerHTML = `
        <form>
            <label for="productSelect">Select Product:</label>
            <select id="productSelect"></select>
            <label for="quantityInput">Quantity:</label>
            <input type="number" id="quantityInput" name="quantity" required>
            <button type="button" onclick="saveProduct(${tableIndex})">Save</button>
        </form>
    `;

        const productSelect = createDiv.querySelector("#productSelect");
        // Populate product options from the Products class
        for (const product of Products.getAllProducts()) {
            const option = document.createElement("option");
            option.value = product.name;
            option.innerText = product.name;
            productSelect.appendChild(option);
        }

        const tableDetailsDiv = document.getElementById("container-DetailsExtra");
        tableDetailsDiv.innerHTML = "";
        tableDetailsDiv.appendChild(createDiv);
        updateDetailTable(tableIndex);
    }

/**
 * Handles the click event of the Edit button.
 *
 * @param {number} tableIndex - The index of the table associated with the Edit button.
 */
handleEditButtonClick(tableIndex) {
    const order = this.tables[tableIndex].order;

    const editDiv = document.createElement("div");
    editDiv.innerHTML = `
        <h3>Edit Order</h3>
        <table>
            <tr>
                <th>Products</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </table>
        <button id="saveChangesBtn">Save</button>
        <button id="clearChangesBtn">Clear</button>
    `;

    const orderTable = editDiv.querySelector("table");
    for (let i = 0; i < order.products.length; i++) {
        const product = order.products[i];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.product.name}</td>
            <td><input type="number" value="${product.quantity}" min="0" data-product-index="${i}"></td>
            <td>$<span class="priceSpan">${product.product.price * product.quantity}</span></td>
        `;
        orderTable.appendChild(row);
    }

    const tableDetailsDiv = document.getElementById("container-DetailsExtra");
    tableDetailsDiv.innerHTML = "";
    tableDetailsDiv.appendChild(editDiv);

    const saveChangesBtn = document.getElementById("saveChangesBtn");
    saveChangesBtn.addEventListener("click", () => this.handleSaveChanges(tableIndex));

    const clearChangesBtn = document.getElementById("clearChangesBtn");
    clearChangesBtn.addEventListener("click", () => this.handleClearChanges(tableIndex));

    tableDetailsDiv.addEventListener("input", (event) => {
        if (event.target.tagName === "INPUT" && event.target.dataset.productIndex !== undefined) {
            const productIndex = parseInt(event.target.dataset.productIndex);
            const newQuantity = parseInt(event.target.value);
            if (!isNaN(newQuantity) && newQuantity >= 0) {
                const priceSpan = event.target.parentElement.nextElementSibling.querySelector(".priceSpan");
                priceSpan.textContent = this.tables[tableIndex].order.products[productIndex].product.price * newQuantity;
            }
        }
    });
}

/**
 * Handles the click event of the Save button to save the changes made to quantities.
 *
 * @param {number} tableIndex - The index of the table associated with the Save button.
 */
handleSaveChanges(tableIndex) {
    const tableDetailsDiv = document.getElementById("container-DetailsExtra");
    const inputs = tableDetailsDiv.querySelectorAll("input");

    inputs.forEach((input, productIndex) => {
        const parsedQuantity = parseInt(input.value);
        if (!isNaN(parsedQuantity) && parsedQuantity >= 0) {
            this.tables[tableIndex].order.products[productIndex].quantity = parsedQuantity;
        }
    });

    updateDetailTable(tableIndex);
}

/**
 * Handles the click event of the Clear button to reset quantity inputs to their original values.
 *
 * @param {number} tableIndex - The index of the table associated with the Clear button.
 */
handleClearChanges(tableIndex) {
    const tableDetailsDiv = document.getElementById("container-DetailsExtra");
    const inputs = tableDetailsDiv.querySelectorAll("input");

    const order = this.tables[tableIndex].order;
    for (let i = 0; i < order.products.length; i++) {
        inputs[i].value = order.products[i].quantity;
    }
}

    /**
     * Handles the click event of the Delete button.
     *
     * @param {number} tableIndex - The index of the table associated with the Delete button.
     */
    handleDeleteButtonClick(tableIndex) {
        const order = this.tables[tableIndex].order;

        const deleteDiv = document.createElement("div");
        deleteDiv.innerHTML = `
            <h3>Delete Product</h3>
            <select id="deleteProductSelect"></select>
            <button type="button" onclick="confirmDeleteProduct(${tableIndex})">Delete</button>
        `;

        const deleteProductSelect = deleteDiv.querySelector("#deleteProductSelect");
        // Populate product options from the order
        for (const product of order.products) {
            const option = document.createElement("option");
            option.value = product.product.name; // Ajuste aqui para acessar corretamente o nome do produto
            option.innerText = product.product.name; // Ajuste aqui para acessar corretamente o nome do produto
            deleteProductSelect.appendChild(option);
        }

        const tableDetailsDiv = document.getElementById("container-DetailsExtra");
        tableDetailsDiv.innerHTML = "";
        tableDetailsDiv.appendChild(deleteDiv);
        updateDetailTable(tableIndex);
    }

    /**
     * Handles the click event of the Close button.
     *
     * @param {number} tableIndex - The index of the table associated with the Close button.
     */
    handleCloseButtonClick(tableIndex) {
        const tableButton = document.getElementsByClassName("tableButton")[tableIndex];
        tableButton.style.backgroundColor = "";
        tableButton.style.color = ""; // Restaura a cor do texto para o padrão
    
        const tableDetailsDiv = document.getElementById("container-DetailsExtra");
        tableDetailsDiv.innerHTML = "";
    
        // Clear the order associated with the table
        this.tables[tableIndex].order = new Order();
        updateDetailTable(tableIndex);
    }
}

class Table {
    /**
     * Constructor for the Table class.
     */
    constructor() {
        /** @private */
        this.order = new Order();
    }
}
class Order {
    constructor() {
        this.products = [];
    }

    addProduct(product, quantity) {
        const existingProduct = this.products.find(item => item.product.name === product.name);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            this.products.push({ product, quantity });
        }
    }

    deleteProduct(index) {
        this.products.splice(index, 1);
    }

    calculateTotalValue() {
        let totalValue = 0;
        for (const item of this.products) {
            totalValue += item.product.price * item.quantity; // Calcula o valor total considerando a quantidade
        }
        return totalValue;
    }
}

class Product {
    /**
     * Constructor for the Product class.
     *
     * @param {string} name - The name of the product.
     * @param {number} price - The price of the product.
     */
    constructor(name, price) {
        /** @private */
        this.name = name;

        /** @private */
        this.price = price;
    }

    /**
     * Getter method to retrieve the name of the product.
     *
     * @returns {string} The name of the product.
     */
    getName() {
        return this.name;
    }

    /**
     * Getter method to retrieve the price of the product.
     *
     * @returns {number} The price of the product.
     */
    getPrice() {
        return this.price;
    }
}

// Usage Examples for the classes

// Create an instance of the Restaurant class
const restaurant = new Restaurant();

// Generate table buttons
restaurant.generateTableButtons();

// Create an instance of the Products class
class Products {
    static getAllProducts() {
        return [
            new Product("Pizza", 10),
            new Product("Burger", 8),
            new Product("Salad", 6),
            new Product("Pasta", 12)
        ];
    }
}

// Function to save the selected product to the order associated with the table
function saveProduct(tableIndex) {
    const productSelect = document.getElementById("productSelect");
    const selectedProductName = productSelect.value;

    const quantityInput = document.getElementById("quantityInput");
    const selectedQuantity = parseInt(quantityInput.value);

    if (selectedQuantity > 0) {
        const selectedProduct = Products.getAllProducts().find(product => product.name === selectedProductName);

        restaurant.tables[tableIndex].order.addProduct(selectedProduct, selectedQuantity);

        const tableButton = document.getElementsByClassName("tableButton")[tableIndex];
        tableButton.style.backgroundColor = "darkblue";
        tableButton.style.color = "yellow";

        // Atualiza a tabela na DetailDiv após adicionar o produto
        updateDetailTable(tableIndex);
    } else {
        throw new Error(alert("A quantidade deve ser um número positivo."));
    }
}

// Função separada para atualizar a tabela na DetailDiv
function updateDetailTable(tableIndex) {
    const order = restaurant.tables[tableIndex].order;

    const orderTable = document.querySelector("#container-Details table");
    orderTable.innerHTML = `
        <tr>
            <th>Products</th>
            <th>Quantity</th>
            <th>Price</th>
        </tr>
    `;

    let totalValue = order.calculateTotalValue(); // Calcula o valor total da ordem


    for (const product of order.products) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.product.name}</td>
            <td>${product.quantity}</td>
            <td>$${product.product.price * product.quantity}</td>
        `;
        orderTable.appendChild(row);
    }

    const totalValueLabel = document.getElementById("orderTotalValueLabel");
    totalValueLabel.innerText = `Total Value: $${totalValue}`; // Atualiza a label com o valor total da ordem
}


// Function to delete the selected product from the order associated with the table
function deleteProduct(tableIndex, productIndex) {
    // Delete the product from the order associated with the table
    restaurant.tables[tableIndex].order.deleteProduct(productIndex);
    updateDetailTable(tableIndex);
}

// Function to confirm the deletion of the selected product from the order associated with the table
function confirmDeleteProduct(tableIndex) {
    const deleteProductSelect = document.getElementById("deleteProductSelect");
    const selectedProductName = deleteProductSelect.value;

    // Find the index of the selected product in the order
    const productIndex = restaurant.tables[tableIndex].order.products.findIndex(product => product.name === selectedProductName);

    // Delete the product from the order
    restaurant.tables[tableIndex].order.deleteProduct(productIndex);

    updateDetailTable(tableIndex);
    
}