'use strict';

/*eslint-env jquery*/

const STORE = {
  items: [
    {name: 'item1', checked: false},
    {name: 'item2', checked: false},
    {name: 'item3', checked: true},
    {name: 'item4', checked: true}
  ],
  hideCompleted: false,
  searchTerm: null,
};

// Bug: Once the checkbox is checked, it will delete all items with array of the clicked item and anything that comes after that. This is a side effect from using an array as a data type. 


/* **********************************************************************
All functions below have a side effect of mutating global variable STORE
*********************************************************************** */

function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`);
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {

  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {

    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex, 1);
    renderShoppingList();
  });
}

// changes the value of STORE.hideCompleted 
function toggleHideItems(){
  console.log('toggleHideItems ran');
  STORE.hideCompleted = !STORE.hideCompleted;
}

// when the checkbox with id #toggle-filter-completed-items is clicked run toggleHideItems()
function handleToggleHideItemFilter() {
  console.log('handleToggleHideItemFilter ran');
  $('#toggle-filter-completed-items').click(event => {
    toggleHideItems();
    renderShoppingList();
  });
}

// change the searchTerm value from 'null' to whatever the user submits on the search bar 
function changeSearchTerm(searchItem){
  STORE.searchTerm = searchItem.toLowerCase();
}

// target the form with the class js-shopping-list-search-entry and on keyup run a function that grabs the searchEntry results, aka the word that the user enters in the search bar
// then run the current value of searchEntry to the changeSearchTerm() to change the global value of STORE.searchTerm 
function handleFilterBySearchTerm() {
  $('.js-shopping-list-search-entry').on('keyup', event => {
    console.log('handleFilterBySearchTerm fired!');

    const searchEntry = $(event.currentTarget).val();
    changeSearchTerm(searchEntry);
    renderShoppingList();

    console.log(`I am mutating the global value of STORE.searchTerm to ${STORE.searchTerm}`);
  });
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');

  let items = [...STORE.items];

  //  >>>> add conditional statement that will run through the STORE.items and grab all the items that are not checked and render it on the DOM
  if (STORE.hideCompleted) {
    items = STORE.items.filter(item => !item.checked);
  }


  // tell renderShoppingList() that if STORE.items.includes( STORE.searchTerm) then render that item only
  if (STORE.searchTerm) {
    items = STORE.items.filter(item => item.name.includes(STORE.searchTerm));
  }

  const shoppingListItemsString = generateShoppingItemsString(items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideItemFilter();
  handleFilterBySearchTerm();
  renderShoppingList();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
