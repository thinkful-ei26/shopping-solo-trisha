/*eslint-env jquery*/

'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  hideCompleted: false,
  searchTermSubmitted: false,
};

/* *************************************************************
All functions below have a side effect of mutating global variable STORE
************************************************************* */


function generateItemElement(item, itemIndex, template) {
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


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');

  //  >>>> add a variable that will filter the checked items
  let filteredItems = [...STORE.items];
  //
  // // >>> add a variable that will filter by search terms
  let searchTermItem = [...STORE.items];

  // Extract properties from the STORE to use for conditional statements below
  const { hideCompleted, searchTermSubmitted } = STORE;


  //  >>>> add conditional statement that will run through the STORE.items and grab all the items that are not checked and render it on the DOM
  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter(item => !item.checked);
  }


  // !!!!! HELP WITH ITEM FILTER: I need to tell renderShoppingList to go through STORE.items and if the value of the submitted <input> in js-filter-search-entry which is defined in handleFilterBySearchTerm() is the same as the STORE.item.name then filter keep those items rendered !!!!
  if (STORE.searchTermSubmitted) {
    searchTermItem = searchTermItem.filter( item => item.name
      // .toLowerCase().indexOf(searchTermSubmitted.toLowerCase()) !== -1
    );
  }


  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
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

// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`);

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}



//  >>>> if the STORE.hideCompleted is false
function toggleHideItems(){
  console.log('toggleHideItems ran');
  STORE.hideCompleted = !STORE.hideCompleted;
}

//  >>>> when the checkbox with id #toggle-filter-completed-items is
// clicked run toggleHideItems
function handleToggleHideItemFilter() {
  console.log('handleToggleHideItemFilter ran');
  $('#toggle-filter-completed-items').click(event => {
    toggleHideItems();
    renderShoppingList();
  });
}

// >>>> if the STORE.searchTermSubmitted is false
function filterBySearchTerm(){
  console.log('filterBySearchTerm fired!');
  STORE.searchTermSubmitted = !STORE.searchTermSubmitted;
}

//  >>>>
function handleFilterBySearchTerm() {

  $('#js-filterby-searchWord').on('submit', function(event) {
    event.preventDefault();

    console.log('handleFilterBySearchTerm fired!');

    const searchEntry = $('.js-filter-search-entry').val();
    $('.js-filter-search-entry').val('');
    filterBySearchTerm(searchEntry);
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideItemFilter();
  handleFilterBySearchTerm();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
