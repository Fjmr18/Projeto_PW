class Restaurant {
  constructor() {
    this.tables = [];
    for (let i = 0; i < 20; i++) {
      this.tables.push(new Table());
    }
    this.generateTableButtons();
    const productListButton = document.getElementById('productListButton');
    productListButton.addEventListener("click", () =>this.handleProductListButtonClick());
    }

  // Generates buttons for the tables and sets up click event listeners
  generateTableButtons() {
    const tableContainer = document.getElementById("table-Of-Tables");
    tableContainer.innerHTML = "";

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

      // Handles click events for table buttons
      tableButton.addEventListener("click", () =>
        this.handleTableButtonClick(i)
      );
      tableContainer.appendChild(tableButton);
    }
  }

  handleProductListButtonClick() {
    const containerDetailsExtra = document.getElementById('container-DetailsExtra');
  
    // Clear the container-DetailsExtra
    containerDetailsExtra.innerHTML = '';
  
    // Adding a header for the product list
    const productListHeader = document.createElement('h2');
    productListHeader.innerText = 'Product List';
    containerDetailsExtra.appendChild(productListHeader);
  
    // Creating a table for products
    const productListTable = document.createElement('table');
    productListTable.classList.add('product-list-table');
  
    const tableHeaders = ['Product Name', 'Price'];
  
    // Create table header row
    const headerRow = document.createElement('tr');
    tableHeaders.forEach(headerText => {
      const headerCell = document.createElement('th');
      headerCell.textContent = headerText;
      headerRow.appendChild(headerCell);
    });
    productListTable.appendChild(headerRow);
  
    // Get all products and populate the table
    const products = Products.getAllProducts();
    products.forEach(product => {
      const productRow = document.createElement('tr');
      const nameCell = document.createElement('td');
      const priceCell = document.createElement('td');
      nameCell.textContent = product.name;
      priceCell.textContent = `$${product.price}`;
      productRow.appendChild(nameCell);
      productRow.appendChild(priceCell);
      productListTable.appendChild(productRow);
    });
  
    // Append the table to the container-DetailsExtra
    containerDetailsExtra.appendChild(productListTable);
  
    // Creating a form for adding a new product
    const addProductForm = document.createElement('form');
    addProductForm.innerHTML = `
      <input type="text" id="newProductName" placeholder="New Product Name">
      <input type="number" id="newProductPrice" placeholder="New Product Price">
      <button type="submit">Add Product</button>
    `;
  
    // Handle form submission
    addProductForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const productNameInput = document.getElementById('newProductName');
      const productPriceInput = document.getElementById('newProductPrice');
  
      const productName = productNameInput.value;
      const productPrice = parseFloat(productPriceInput.value);
      console.log(productName);
      console.log(productPrice);
      if (productName && !isNaN(productPrice) && productPrice >= 0) {
        Products.createProduct(productName, productPrice);
        console.log(Products.getAllProducts());
        // After creating the new product, re-render the product list
        this.handleProductListButtonClick();
      } else {
        // Handle invalid input
        alert('Please enter valid product name and price.');
      }
    });
  
    // Append the form to the container-DetailsExtra
    containerDetailsExtra.appendChild(addProductForm);
  }

  // Handles the click event of a table button
  handleTableButtonClick(tableIndex) {
    // Updates button styles and displays table details
    const tableButtons = document.getElementsByClassName("tableButton");
    const clickedButton = this.tables[tableIndex];

    // Check if the clicked button is in the "Selected" state
    if (clickedButton.getState() === "Selected") {
      // If it's "Selected", and if it's not in the "Open" state, keep it "Selected"
      if (clickedButton.getState() !== "Open") {
        clickedButton.setState("Selected");
      }
    } else {
      // If another button was previously "Selected", revert it to the "Closed" state
      for (let i = 0; i < tableButtons.length; i++) {
        const table = this.tables[i];
        if (table.getState() === "Selected") {
          table.setState("Closed");
          break;
        }
      }
      // If the clicked button is "Open", keep it "Open"
      if (clickedButton.getState() === "Open") {
        clickedButton.setState("Open");
      }
      // If the clicked button is "Closed", set it to "Selected"
      if (clickedButton.getState() === "Closed") {
        clickedButton.setState("Selected");
      }
    }

    const tableDetailsDiv = document.getElementById("container-Details");
    tableDetailsDiv.innerHTML = "";

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

    // Reset the divs Create, Edit e Delete content so the user dont get confused.
    const tableDetailsDivExtra = document.getElementById(
      "container-DetailsExtra"
    );
    tableDetailsDivExtra.innerHTML = "";

    const createButton = document.createElement("button");
    createButton.innerText = "Create";
    createButton.addEventListener("click", () =>
      this.handleCreateButtonClick(tableIndex)
    );
    tableDetailsDiv.appendChild(createButton);

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", () =>
      this.handleEditButtonClick(tableIndex)
    );
    tableDetailsDiv.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () =>
      this.handleDeleteButtonClick(tableIndex)
    );
    tableDetailsDiv.appendChild(deleteButton);

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () =>
      this.handleCloseButtonClick(tableIndex)
    );
    tableDetailsDiv.appendChild(closeButton);

    this.updateTableButtonStyles();
    this.updateDetailTable(tableIndex);
  }
  //  Handles the click event of the Create button for a table
  handleCreateButtonClick(tableIndex) {
    // Creates form elements for product selection and quantity input
    const createDiv = document.createElement("div");
    createDiv.innerHTML = `
        <form>
            <label for="productSelect">Select Product:</label>
            <select id="productSelect"></select>
            <label for="quantityInput">Quantity:</label>
            <input type="number" id="quantityInput" name="quantity" required>
            <button type="button" onclick="restaurant.saveProduct(${tableIndex})">Save</button>
        </form>
    `;

    const productSelect = createDiv.querySelector("#productSelect");
    for (const product of Products.getAllProducts()) {
      const option = document.createElement("option");
      option.value = product.name;
      option.innerText = product.name;
      productSelect.appendChild(option);
    }

    const tableDetailsDiv = document.getElementById("container-DetailsExtra");
    tableDetailsDiv.innerHTML = "";
    tableDetailsDiv.appendChild(createDiv);
    this.updateDetailTable(tableIndex);
  }
  // Handles the click event of the Edit button for a table
  handleEditButtonClick(tableIndex) {
    // Displays an edit form for the table's order
    const order = this.tables[tableIndex].getOrder();

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
            <td><input type="number" value="${
              product.quantity
            }" min="0" data-product-index="${i}"></td>
            <td>$<span class="priceSpan">${
              product.product.price * product.quantity
            }</span></td>
        `;
      orderTable.appendChild(row);
    }

    const tableDetailsDiv = document.getElementById("container-DetailsExtra");
    tableDetailsDiv.innerHTML = "";
    tableDetailsDiv.appendChild(editDiv);

    const saveChangesBtn = document.getElementById("saveChangesBtn");
    saveChangesBtn.addEventListener("click", () =>
      this.handleSaveChanges(tableIndex)
    );

    const clearChangesBtn = document.getElementById("clearChangesBtn");
    clearChangesBtn.addEventListener("click", () =>
      this.handleClearChanges(tableIndex)
    );

    tableDetailsDiv.addEventListener("input", (event) => {
      if (
        event.target.tagName === "INPUT" &&
        event.target.dataset.productIndex !== undefined
      ) {
        const productIndex = parseInt(event.target.dataset.productIndex);
        const newQuantity = parseInt(event.target.value);
        if (!isNaN(newQuantity) && newQuantity >= 0) {
          const priceSpan =
            event.target.parentElement.nextElementSibling.querySelector(
              ".priceSpan"
            );
          priceSpan.textContent =
            this.tables[tableIndex].order.products[productIndex].product.price *
            newQuantity;
        }
      }
    });
  }

  // Handles the click event of the Save button to save quantity changes
  handleSaveChanges(tableIndex) {
    // Saves changes made to quantities and updates the table details
    const tableDetailsDiv = document.getElementById("container-DetailsExtra");
    const inputs = tableDetailsDiv.querySelectorAll("input");

    inputs.forEach((input, productIndex) => {
      const parsedQuantity = parseInt(input.value);
      if (!isNaN(parsedQuantity) && parsedQuantity >= 0) {
        this.tables[tableIndex].order.products[productIndex].quantity =
          parsedQuantity;
      }
    });

    this.updateDetailTable(tableIndex);
  }

  // Handles the click event of the Clear button to reset quantity inputs
  handleClearChanges(tableIndex) {
    // Resets quantity inputs to their original values and updates the input field
    const tableDetailsDiv = document.getElementById("container-DetailsExtra");
    const inputs = tableDetailsDiv.querySelectorAll("input");

    const order = this.tables[tableIndex].order;
    console.log(order);
    for (let i = 0; i < order.products.length; i++) {
      inputs[i].value = order.products[i].quantity;
    }
  }

  // Handles the click event of the Delete button for a table
  handleDeleteButtonClick(tableIndex) {
    // Displays a delete form for products in the table's order and updates the table details
    const order = this.tables[tableIndex].getOrder(); // Utilizando o método getOrder

    const deleteDiv = document.createElement("div");
    deleteDiv.innerHTML = `
        <h3>Delete Product</h3>
        <select id="deleteProductSelect"></select>
        <button type="button" onclick="restaurant.removeProduct(${tableIndex}, this.previousElementSibling.value)">Remove</button>`;

    const deleteProductSelect = deleteDiv.querySelector("#deleteProductSelect");

    for (const product of order.products) {
      const option = document.createElement("option");
      option.value = product.product.name;
      option.innerText = product.product.name;
      deleteProductSelect.appendChild(option);
    }

    const tableDetailsDiv = document.getElementById("container-DetailsExtra");
    tableDetailsDiv.innerHTML = "";
    tableDetailsDiv.appendChild(deleteDiv);
    tableDetailsDiv.appendChild(deleteDiv);
    this.updateDetailTable(tableIndex);
  }

  handleCloseButtonClick(tableIndex) {
    const tableButton =
      document.getElementsByClassName("tableButton")[tableIndex];

    const tableDetailsDiv = document.getElementById("container-DetailsExtra");

    tableDetailsDiv.innerHTML = "";

      // Verifica se o estado da mesa é "Open" antes de limpar os detalhes

      // Limpa o pedido associado à mesa utilizando o método clearOrder
      this.tables[tableIndex].clearOrder();
      this.tables[tableIndex].setState("Closed");
      this.updateTableButtonStyles();
      this.updateDetailTable(tableIndex);
  }

  // Método para atualizar o estilo dos botões com base no estado das mesas
  updateTableButtonStyles() {
    const tableButtons = document.getElementsByClassName("tableButton");

    for (let i = 0; i < this.tables.length; i++) {
      const tableButton = tableButtons[i];
      const currentState = this.tables[i].getState();

      if (currentState === "Closed") {
        tableButton.style.backgroundColor = "";
        tableButton.style.color = "";
      } else if (currentState === "Open") {
        tableButton.style.backgroundColor = "darkblue";
        tableButton.style.color = "yellow";
      } else if (currentState === "Selected") {
        tableButton.style.backgroundColor = "lightblue";
        tableButton.style.color = "black";
      }
    }
  }

  // Método para atualizar a tabela de detalhes na UI
  updateDetailTable(tableIndex) {
    const order = this.tables[tableIndex].order;
    const orderTable = document.querySelector("#container-Details table");
    orderTable.innerHTML = `<tr><th>Products</th><th>Quantity</th><th>Price</th></tr>`;
    let totalValue = order.calculateTotalValue();

    for (const product of order.products) {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${product.product.name}</td><td>${
        product.quantity
      }</td><td>$${product.product.price * product.quantity}</td>`;
      orderTable.appendChild(row);
    }

    const totalValueLabel = document.getElementById("orderTotalValueLabel");
    totalValueLabel.innerText = `Total Value: $${totalValue}`;
  }

  // Método para salvar o produto selecionado para o pedido associado à mesa
  saveProduct(tableIndex) {
    const productSelect = document.getElementById("productSelect");
    const selectedProductName = productSelect.value;

    const quantityInput = document.getElementById("quantityInput");
    const selectedQuantity = parseInt(quantityInput.value);

    if (selectedQuantity > 0) {
      const selectedProduct = Products.getAllProducts().find(
        (product) => product.name === selectedProductName
      );
      this.tables[tableIndex].order.addProduct(
        selectedProduct,
        selectedQuantity
      );

      // Atualiza o estado da mesa para "Open"
      this.tables[tableIndex].setState("Open");
      this.updateTableButtonStyles();
      this.updateDetailTable(tableIndex);
    } else {
      throw new Error(alert("A quantidade deve ser um número positivo."));
    }
  }

  // Método para remover um produto do pedido associado à mesa
  removeProduct(tableIndex, productName) {
    const order = this.tables[tableIndex].order;
    const productIndex = order.products.findIndex(
      (product) => product.product.name === productName
    );
  
    if (productIndex !== -1) {
      order.deleteProduct(productIndex);
      this.updateDetailTable(tableIndex);
      if (order.getSize() === 0) {
        this.tables[tableIndex].setState("Closed");
        this.updateTableButtonStyles();
      }
    } else {
      throw new Error(alert("Product not found in the order."));
    }
  }
}

class Table {
  constructor() {
    this.order = new Order();
    this.state = "Closed";
  }

  getOrder() {
    return this.order;
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
  }

  clearOrder() {
    this.order = new Order();
  }
}
class Order {
  constructor() {
    this.products = [];
  }

  addProduct(product, quantity) {
    const existingProductIndex = this.products.findIndex(
      (item) => item.product.name === product.name
    );

    if (existingProductIndex !== -1) {
      // If the product already exists in the table's order, update the quantity
      this.products[existingProductIndex].quantity += quantity;
    } else {
      // If the product doesn't exist, add it to the table's order
      this.products.push({ product, quantity });
    }
  }
  getSize() {
    return this.products.length;
  }

  deleteProduct(index) {
    this.products.splice(index, 1);
  }

  calculateTotalValue() {
    let totalValue = 0;
    for (const item of this.products) {
      totalValue += item.product.price * item.quantity;
    }
    return totalValue;
  }
}
class Products {
  static productList = [
    new Products('Pizza', 10),
    new Products('Burger', 8),
    new Products('Salad', 6),
    new Products('Pasta', 12),
  ];

  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  static createProduct(name, price) {
    const existingProduct = Products.productList.find(product => product.name === name);
    if (!existingProduct) {
      const newProduct = new Products(name, price);
      Products.productList.push(newProduct);
    } else {
      throw new Error(alert('Product already exists!'));
    }
  }

  static getAllProducts() {
    return Products.productList;
  }
}

//Start of Restaurant and generation of the table buttons.
const restaurant = new Restaurant();