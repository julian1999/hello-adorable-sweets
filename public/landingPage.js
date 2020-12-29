const SUMMARY = 'Summary';
const ORDERS = 'Orders';

// insert config here

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function initialize(){
  initializeMenu();
  loadSummary();
}

function loadSummary(){

  let itemQuantities = {'Cakesickles' : 0, 'Cookies' : 0, 'Cocoa Bombs' : 0, 'Marshmallows' : 0};
  let specifics = {'Cakesickles' : {}, 'Cookies' : {}, 'Cocoa Bombs' : {}, 'Marshmallows' : {}};

  db.collection('orders').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      let items = doc.data().items;
      // iterate through each item
      let cakesicklesQuantities = items['Cakesickles'];
      for(let key in cakesicklesQuantities){
        itemQuantities['Cakesickles'] += cakesicklesQuantities[key];
        if(isNaN(specifics['Cakesickles'][key])){
          specifics['Cakesickles'][key] = cakesicklesQuantities[key];
        }
        else{
          specifics['Cakesickles'][key] += cakesicklesQuantities[key]
        }
      }
      let cookiesQuantities = items['Cookies'];
      for(let key in cookiesQuantities){
        itemQuantities['Cookies'] += cookiesQuantities[key];
        if(isNaN(specifics['Cookies'][key])){
          specifics['Cookies'][key] = cookiesQuantities[key];
        }
        else{
          specifics['Cookies'][key] += cookiesQuantities[key]
        }
      }
      let cocoaBombsQuantities = items['Cocoa Bombs'];
      for(let key in cocoaBombsQuantities){
        itemQuantities['Cocoa Bombs'] += cocoaBombsQuantities[key];
        if(isNaN(specifics['Cocoa Bombs'][key])){
          specifics['Cocoa Bombs'][key] = cocoaBombsQuantities[key];
        }
        else{
          specifics['Cocoa Bombs'][key] += cocoaBombsQuantities[key];
        }
      }
      let marshmallowsQuantities = items['Marshmallows'];
      for(let key in marshmallowsQuantities){
        itemQuantities['Marshmallows'] += marshmallowsQuantities[key];
        if(isNaN(specifics['Marshmallows'][key])){
          specifics['Marshmallows'][key] = marshmallowsQuantities[key];
        }
        else{
          specifics['Marshmallows'][key] += marshmallowsQuantities[key];
        }
      }
    });

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
      let quantity_td = createTableCell('td', itemQuantities[item]); //load from firebase later on
      let relevantSpecifics = {};
      let first_dropdown_td = createViewMoreButton(specifics[item], item);

      let item_tr = document.createElement('tr');
      item_tr.className = 'summary-table-row';
      item_tr.appendChild(item_td);
      item_tr.appendChild(quantity_td);
      item_tr.appendChild(first_dropdown_td);

      summary_table.appendChild(item_tr);
    });

    // update the background
    document.getElementById('main').style.backgroundColor = '#D9AFD9';
    document.getElementById('main').style.backgroundImage = 'linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)';
    document.getElementById('main').appendChild(summary_table);
    document.getElementById('main').appendChild(createPlaceOrderButton());


  });

  // loading screen
  document.getElementById('main').style.backgroundImage = 'url("loading.gif")';
  document.getElementById('main').style.backgroundRepeat = 'no-repeat';
  document.getElementById('main').style.backgroundSize = 'cover';



}

function loadOrders(){
  let orders = []; // initially empty

  // request all data in the orders collection from firebase

  db.collection('orders').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      let name = doc.data().name;
      let phone = doc.data().phone;
      let pickup = doc.data().pickup;
      let items = doc.data().items;
      let order = {'name' : name, 'phone': phone, 'pickup' : pickup, 'items' : items, 'id' : doc.id};
      orders.push(order);
    });


    // create the orders list
    let ordersUl = document.createElement('ul');
    ordersUl.className = 'orders-ul';
    ordersUl.id = 'orders-ul';

    orders.forEach(function(order){
      let orderLi = document.createElement('li');
      orderLi.className = 'order-li';
      orderLi.id = order['id'];
      let orderDiv = document.createElement('div');
      orderDiv.className = 'order-div';
      let orderName = document.createElement('p');
      orderName.className = 'order-p';
      orderName.innerText = order.name;
      let orderPhone = document.createElement('p');
      orderPhone.className = 'order-p';
      orderPhone.innerText = order.phone;
      let orderPickup = document.createElement('p');
      orderPickup.className = 'order-p';
      orderPickup.innerText = 'Due: ' + order.pickup;
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

        for(color in amounts){
          prettyInfo += '[' + color + ': ' + amounts[color] + '] ';
        }
        prettyInfo += '\n\n';
      }
      orderInfo.innerText = prettyInfo;
      orderDiv.appendChild(orderName);
      orderDiv.appendChild(orderPhone);
      orderDiv.appendChild(orderInfo);
      orderDiv.appendChild(orderPickup);
      let finishButton = document.createElement('button');
      finishButton.className = 'pink-btn centered-btn';
      finishButton.innerText = 'Finish';
      finishButton.onclick = function(){
        finishOrder(order['id']);
      }
      orderDiv.appendChild(finishButton);
      orderLi.appendChild(orderDiv);
      ordersUl.appendChild(orderLi);
    });

    document.getElementById('main').appendChild(ordersUl);

    // update the background
    document.getElementById('main').style.backgroundColor = '#D9AFD9';
    document.getElementById('main').style.backgroundImage = 'linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)';
  });

  // loading screen
  document.getElementById('main').style.backgroundImage = 'url("loading.gif")';
  document.getElementById('main').style.backgroundRepeat = 'no-repeat';
  document.getElementById('main').style.backgroundSize = 'cover';
}

function finishOrder(id){
  db.collection('orders').doc(id).delete();
  //remove this order on the front end
  let order = document.getElementById(id);
  order.parentNode.removeChild(order);
}

function createViewMoreButton(specifics, itemName){
  let viewMoreButton = document.createElement('button');
  viewMoreButton.className = 'pink-btn';
  viewMoreButton.innerText = '...';
  viewMoreButton.id = itemName + '-view-more-button';
  viewMoreButton.onclick = function(){
    handleClickViewMore(specifics, itemName);
  };
  return viewMoreButton;
}

// TODO: implement firebase logic
function handleClickViewMore(specifics, itemName){
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
  
  for(let key in specifics){
    let color_td = createTableCell('td', key);
    let quantity_td = createTableCell('td', specifics[key]);

    let color_tr = document.createElement('tr');
    color_tr.className = 'summary-table-row';
    color_tr.appendChild(color_td);
    color_tr.appendChild(quantity_td);

    detailedTable.appendChild(color_tr);
  }

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
  form.appendChild(createItemHeader('Pickup Date'));
  form.appendChild(createOrderPickupInput());

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
    form.appendChild(createOrderInputs(orderInputs, itemName));
  });

  let submitButton = createSubmitOrderButton();
  submitButton.type = 'button';
  submitButton.onclick = function(){
    alert('Thank you for your order! (: ');

    // Construct the JSON string for the REST call to firebase
    let name = document.getElementById('name').value; // YES, this works!
    let phone = document.getElementById('phone').value;
    let pickup = document.getElementById('pickup').value;

    let itemToQuantities = {};

    itemNames.forEach(function(itemName){
      let unorderedLists = document.getElementById(itemName);
      let listItems = unorderedLists.children;
      itemToQuantities[itemName] = {};
      for(let i = 0; i < listItems.length; i++){
        let listItem = listItems[i];
        let input = listItem.children[0];
        itemToQuantities[itemName][input.id] = Number(input.value);
      }
    });

    order = {'name' : name, 'phone' : phone, 'pickup' : pickup, 'items' : itemToQuantities};

    placeOrder(order);

    // remove the form and load summary
    var forms = document.getElementsByTagName("FORM");
    for (var i=forms.length-1; i>=0;i-=1)
       if (forms[i]) forms[i].parentNode.removeChild(forms[i]);
    
    loadSummary();
  }

  form.appendChild(submitButton);
  
  document.getElementById('main').appendChild(form);
}

function createOrderNameInput(){
  let inputList = document.createElement('ul');
  let inputListItem = document.createElement('li');
  inputListItem.className = 'place-order-li';
  let input = document.createElement('input');
  input.id = 'name';
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
  input.id = 'phone';
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

function createOrderPickupInput(){
  let inputList = document.createElement('ul');
  let inputListItem = document.createElement('li');
  inputListItem.className = 'place-order-li';
  let input = document.createElement('input');
  input.id = 'pickup';
  input.required = true;
  input.pattern= '[0-9]{2}/[0-9]{2}/[0-9]{2}';
  input.className = 'place-order-input place-order-input-name';
  let sideText = document.createElement('p');
  sideText.innerText = 'Pickup Date: MM/DD/YY';
  inputListItem.appendChild(input);
  inputListItem.appendChild(sideText);
  inputList.appendChild(inputListItem);
  return inputList;
}

function createOrderInputs(listOfInputs, itemName){
  let inputList = document.createElement('ul');
  inputList.id = itemName;

  listOfInputs.forEach(function(inputName){
    let inputListItem = document.createElement('li');
    inputListItem.className = 'place-order-li';
    let input = document.createElement('input');
    input.id = inputName;
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

function placeOrder(order){
  db.collection('orders').add(order);
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

      loadOrders();
    }
    else if(password != 'yummy1234' && password.length > 0){
      alert('incorrect password');
    }
  }
}
