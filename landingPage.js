const SUMMARY = 'Summary';
const ORDERS = 'Orders';

function initialize(){
  initializeMenu();
  loadSummary();
}

function loadSummary(){
  // later, load stuff in from firebase!
  let summary_table = document.createElement('table');
  summary_table.className = 'summary-table';
  summary_table.id = 'summary-table';
  let header_tr = document.createElement('tr');
  header_tr.className = 'summary-table-row';

  // creating the header row cells
  let item_th = createTableCell('th', 'Item');
  let quantity_th = createTableCell('th', 'Quantity');
  header_tr.appendChild(item_th);
  header_tr.appendChild(quantity_th);
  summary_table.appendChild(header_tr);

  let items = ['Cakesickles', 'Cookies', 'Cocoa Bombs', 'Marshmallows'];

  items.forEach(function(item){
    let item_td = createTableCell('td', item);
    let quantity_td = createTableCell('td', '0'); //load from firebase later on
    let first_dropdown_td = createViewMoreButton(item);

    let item_tr = document.createElement('tr');
    item_tr.className = 'summary-table-row';
    item_tr.appendChild(item_td);
    item_tr.appendChild(quantity_td);
    item_tr.appendChild(first_dropdown_td);

    summary_table.appendChild(item_tr);
  });

  document.getElementById('main').appendChild(summary_table);
  document.getElementById('main').appendChild(createPlaceOrderButton());

}

// Idea: When you finish an order, it should decrement the totals
// from summary by that amount for each item quantity in that order!
function loadOrders(){
  // mock getting data from firebase
  let orders = []; // initially empty

  // request all data in the orders collection from firebase (GET)

  // TODO: fix the specific options
  // TODO: make the list grow vertically, not horizontally

  let sampleData = {
    'name': 'Julian Alberto',
    'items': {
      'Cakesickles': {'Tree' : 0, 'Snowman' : 0, 'Raindeer' : 0, 'Peppermint' : 0, 'Blue':0, 'Green' : 0},
      'Cookies' : {'Raindeer' : 0, 'Snowman' : 0, 'Peppermint' : 0, 'Blue' : 0, 'Green' : 0},
      'Cocoa Bombs' : {'G/Pearls' : 0, 'W/Peppermint' : 0, 'W/SnowFlakes' : 0, 'W/Snowman' : 0},
      'Marshmallows' : {'Snowman' : 0, 'Cup' : 0, 'Raindeer' : 0, 'Santa' : 0, 'Blush' : 0}
    },
    'comments': 'Make the backside a little thicker than usual on the cakesickles'
  };

  orders.push(sampleData);
  orders.push(sampleData);
  console.log(orders);

  // create the orders list
  let ordersUl = document.createElement('ul');
  ordersUl.className = 'orders-ul';
  ordersUl.id = 'orders-ul';

  orders.forEach(function(order){
    let orderLi = document.createElement('li');
    orderLi.className = 'order-li';
    let orderDiv = document.createElement('div');
    orderDiv.className = 'order-div';
    let orderName = document.createElement('p');
    orderName.className = 'order-p';
    orderName.innerText = order.name;
    let orderInfo = document.createElement('p');
    orderInfo.className = 'order-p';
    let orderItems = order.items;
    let prettyInfo = '';
    for(let itemName in orderItems){
      let amounts = orderItems[itemName];
      let total = 0;
      for(color in amounts){
        total += amounts[color];
      }
    
      prettyInfo += itemName.toUpperCase() + ' ( Total = ' + total + ' )' + '\n';

      console.log(amounts);
      for(color in amounts){
        prettyInfo += '[' + color + ': ' + amounts[color] + '] ';
      }
      prettyInfo += '\n\n';
    }
    orderInfo.innerText = prettyInfo;
    let orderComments = document.createElement('p');
    orderComments.className = 'order-p';
    orderComments.innerText = 'Comments: ' + sampleData.comments;
    orderDiv.appendChild(orderName); //also need to append other data and (green) finish button!
    orderDiv.appendChild(orderInfo);
    orderDiv.appendChild(orderComments);
    let finishButton = document.createElement('button');
    finishButton.className = 'pink-btn centered-btn';
    finishButton.innerText = 'Finish';
    orderDiv.appendChild(finishButton);
    orderLi.appendChild(orderDiv);
    ordersUl.appendChild(orderLi);
  });

  document.getElementById('main').appendChild(ordersUl);
}

function createViewMoreButton(itemName){
  let viewMoreButton = document.createElement('button');
  viewMoreButton.className = 'pink-btn';
  viewMoreButton.innerText = '...';
  viewMoreButton.id = itemName + '-view-more-button';
  viewMoreButton.onclick = function(){
    handleClickViewMore(itemName);
  };
  return viewMoreButton;
}

// TODO: implement firebase logic
function handleClickViewMore(itemName){
  //remove summary table + place order button
  var tables = document.getElementsByTagName("TABLE");
  for (var i=tables.length-1; i>=0;i-=1)
     if (tables[i]) tables[i].parentNode.removeChild(tables[i]);

  var buttons = document.getElementsByTagName("BUTTON");
  for (var i=buttons.length-1; i>=0;i-=1)
     if (buttons[i].innerText === 'Place an Order!')
      buttons[i].parentNode.removeChild(buttons[i]);

  // create an exit button
  let exitButton = document.createElement('button');
  exitButton.className = 'pink-btn centered-btn'
  exitButton.innerText = 'X';
  exitButton.onclick = function(){
    //delete the detailed stuff
    var tables = document.getElementsByTagName("TABLE");
    for (var i=tables.length-1; i>=0;i-=1)
       if (tables[i]) tables[i].parentNode.removeChild(tables[i]);

    var buttons = document.getElementsByTagName("BUTTON");
    for (var i=buttons.length-1; i>=0;i-=1)
       if (buttons[i].innerText === 'X')
        buttons[i].parentNode.removeChild(buttons[i]);
    loadSummary();
  };

  let detailedTable = document.createElement('table');

  detailedTable.className = 'summary-table';
  detailedTable.id = 'detailed-table';

  let colors = ['Green', 'White', 'Yellow', 'Brown']; // GET request to the item name's summary
  // let response = axios.get('/summary/' + itemName);

  colors.forEach(function(color){
    let color_td = createTableCell('td', color);
    let quantity_td = createTableCell('td', '0'); //load from firebase later on

    let color_tr = document.createElement('tr');
    color_tr.className = 'summary-table-row';
    color_tr.appendChild(color_td);
    color_tr.appendChild(quantity_td);

    detailedTable.appendChild(color_tr);
  });

  document.getElementById('main').appendChild(detailedTable);
  document.getElementById('main').appendChild(exitButton);
}

function createTableCell(type, data){
  let cell = document.createElement(type);
  cell.innerText = data;
  cell.className = 'summary-table-data';
  return cell;
}


function initializeMenu(){
  let navigation_ul = document.createElement('ul'); // append this do the body in DOM
  navigation_ul.className = 'navigation-ul';

  // creating the summary li 
  let summary_li = document.createElement('li');
  summary_li.className = 'navigation-li';

  let summary_button = createNavigationButton('Summary');

  summary_li.appendChild(summary_button);

  // creating the logo li
  let logo_li = document.createElement('li');
  logo_li.className = 'navigation-li';

  let logo_image = createNavigationLogo('clipboard.png');

  logo_li.appendChild(logo_image);

  // creating the orders li

  let orders_li = document.createElement('li');
  orders_li.className = 'navigation-li';

  let orders_button = createNavigationButton('Orders');

  orders_li.appendChild(orders_button);

  // append the three li's to the navigation ul
  navigation_ul.appendChild(summary_li);
  navigation_ul.appendChild(logo_li);
  navigation_ul.appendChild(orders_li);

  document.getElementById('main').appendChild(navigation_ul);
}


/* Create one of the two navigation bar buttons (summary and orders)
 * @param buttonName: Inner text and id to set for the button
 */
function createNavigationButton(buttonName){
  let button = document.createElement('button');
  button.className = 'pink-btn';
  button.id = buttonName;
  button.innerText = buttonName;
  button.onclick = function(){
    loadScreen(buttonName)
  };
  return button;
}

function createPlaceOrderButton(){
  let button = document.createElement('button');
  button.className = 'pink-btn centered-btn';
  button.innerText = 'Place an Order!';
  button.onclick = function(){
    createOrderForm();
  }
  return button;
}

function createOrderForm(){
  //remove summary table + place order button
  var tables = document.getElementsByTagName("TABLE");
  for (var i=tables.length-1; i>=0;i-=1)
     if (tables[i]) tables[i].parentNode.removeChild(tables[i]);

  var buttons = document.getElementsByTagName("BUTTON");
  for (var i=buttons.length-1; i>=0;i-=1)
     if (buttons[i].innerText === 'Place an Order!')
      buttons[i].parentNode.removeChild(buttons[i]);

  let form = document.createElement('form');
  form.className = 'place-order-form';

  form.appendChild(createItemHeader('Name'));
  form.appendChild(createOrderNameInput());
  form.appendChild(createItemHeader('Phone Number'));
  form.appendChild(createOrderPhoneInput());

  let itemNames = ['Cakesickles', 'Cookies', 'Cocoa Bombs', 'Marshmallows'];
  itemNames.forEach(function(itemName){
    form.appendChild(createItemHeader(itemName));
    // create ul of the inputs
    let orderInputs = []
    if(itemName === 'Cakesickles'){
      orderInputs = ['Tree', 'Snowman', 'Raindeer', 'Peppermint', 'Blue', 'Green'];
    }
    else if(itemName === 'Cookies'){
      orderInputs = ['Raindeer', 'Snowman', 'Peppermint', 'Blue', 'Green'];
    }
    else if(itemName === 'Cocoa Bombs'){
      orderInputs = ['G/Pearls', 'W/Peppermint', 'W/SnowFlakes', 'W/Snowman'];
    }
    else if(itemName === 'Marshmallows'){
      orderInputs = ['Snowman', 'Cup', 'Raindeer', 'Santa', 'Blush'];
    }
    form.appendChild(createOrderInputs(orderInputs));
  });

  let submitButton = createSubmitOrderButton();
  // TODO do REST call to put the order in the orders collection
  submitButton.onclick = function(){
    let order = ''; // create the JSON string to send to firebase as PUT request
    placeOrder(order);
  }

  form.appendChild(submitButton);
  
  document.getElementById('main').appendChild(form);
}

function createOrderNameInput(){
  let inputList = document.createElement('ul');
  let inputListItem = document.createElement('li');
  inputListItem.className = 'place-order-li';
  let input = document.createElement('input');
  input.required = true;
  input.className = 'place-order-input place-order-input-name';
  let sideText = document.createElement('p');
  sideText.innerText = 'Full Name';
  inputListItem.appendChild(input);
  inputListItem.appendChild(sideText);
  inputList.appendChild(inputListItem);
  return inputList;
}

function createOrderPhoneInput(){
  let inputList = document.createElement('ul');
  let inputListItem = document.createElement('li');
  inputListItem.className = 'place-order-li';
  let input = document.createElement('input');
  input.required = true;
  input.type = 'tel';
  input.pattern= '[0-9]{3}-[0-9]{3}-[0-9]{4}';
  input.className = 'place-order-input place-order-input-name';
  let sideText = document.createElement('p');
  sideText.innerText = 'Phone Number: xxx-xxx-xxxx';
  inputListItem.appendChild(input);
  inputListItem.appendChild(sideText);
  inputList.appendChild(inputListItem);
  return inputList;
}

function createOrderInputs(listOfInputs){
  let inputList = document.createElement('ul');

  listOfInputs.forEach(function(inputName){
    let inputListItem = document.createElement('li');
    inputListItem.className = 'place-order-li';
    let input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = '10';
    input.value = 0;
    input.required = true;
    input.className = 'place-order-input';
    let sideText = document.createElement('p');
    sideText.innerText = inputName;
    inputListItem.appendChild(input);
    inputListItem.appendChild(sideText);
    inputList.appendChild(inputListItem);
  });
  return inputList;
}

function createSubmitOrderButton(){
  let button = document.createElement('button');
  button.className = 'pink-btn';
  button.innerText = 'Submit';
  return button;
}

// JSON string
function placeOrder(order){
  // axios.put('orders/', order)
}

function createItemHeader(itemName){
  let itemHeader = document.createElement('h1');
  itemHeader.className = 'place-order-header';
  itemHeader.innerText = itemName;
  return itemHeader;
}

/* Create the logo that goes in between the two navigation bar buttons
 * @param logoImagePath: The path name to where the logo image is located
 */
function createNavigationLogo(logoImagePath){
  let logo_image = document.createElement('img');
  logo_image.className = 'navigation-img';
  logo_image.src = logoImagePath;
  return logo_image;
}

function loadScreen(screen){
  if(screen === SUMMARY){
    if(document.getElementsByTagName("TABLE").length == 0){
      var orders = document.getElementsByTagName("UL");
      for (var i = orders.length - 1; i >= 0; i -= 1)
        if(orders[i].id === 'orders-ul') orders[i].parentNode.removeChild(orders[i]);

      var forms = document.getElementsByTagName("FORM");
      for (var i=forms.length-1; i>=0;i-=1)
         if (forms[i]) forms[i].parentNode.removeChild(forms[i]);

      loadSummary();
    }
  }
  else if(screen === ORDERS){
    var password = prompt("Admin password: ");
    if(password === 'yummy1234'){
      var tables = document.getElementsByTagName("TABLE");
      for (var i=tables.length-1; i>=0;i-=1)
         if (tables[i]) tables[i].parentNode.removeChild(tables[i]);

      var forms = document.getElementsByTagName("FORM");
      for (var i=forms.length-1; i>=0;i-=1)
         if (forms[i]) forms[i].parentNode.removeChild(forms[i]);

      var buttons = document.getElementsByTagName("BUTTON");
      for (var i=buttons.length-1; i>=0;i-=1)
         if (buttons[i].innerText === 'Place an Order!' || buttons[i].innerText === 'X')
          buttons[i].parentNode.removeChild(buttons[i]);

      //screen = ORDERS;
      loadOrders();
    }
    else if(password != 'yummy1234' && password.length > 0){
      alert('incorrect password');
    }
  }
}
