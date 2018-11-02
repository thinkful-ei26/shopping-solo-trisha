# User stories for PM drills 
Implement the following features which will require a more complex store object:

 ## CHALLENGE #1: 
 User can press a switch/checkbox to toggle between displaying all items or displaying only items that are unchecked
  1. Added checkbox in index.html
  2. Change the state of STORE from an array to an object with hideCompleted property
  3. Create a toggleHideItems function which determines if the STORE.hideCompleted is clicked or not (boolean)
  4. Create handleToggleHideItemFilter attaches the toggleItems function to an event handler that listens for checking #toggle-filter-completed-items
  5. Render the new state of STORE


 ## CHALLENGE #2: 
 User can type in a search term and the displayed list will be filtered by item names only containing that search term
  1. Create an html search box
  2. CREATE LOGIC for this feature:
   * This feature will have the same functionality as the toggle check BUT get the value of the submit button
   * you are combining `handleToggleHideItemFilter` and `handleNewItemSubmit`
  3. Change `STORE` to recognize the search term value
  4. Create a function that `filterBySearchTerm()` recognizes if a search term is submitted (boolean)
  5. Create `handleFilterBySearchTerm()` that listens for the submit event and attaches it to the js-filterby-searchWord <form>
  6. Change `renderShoppingList()` for conditional including `handleFilterBySearchTerm`
  7. RENDER THE HTML via `renderShoppingList()` inside the `handleFilterBySearchTerm()` function


## CHALLENGE #3: User can edit the title of an item
