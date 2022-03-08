// TODO analytics for query
// TODO throw an error if a user disables their JS
// TODO add a button that adds an ingredient on the ingredient column

/* Feature Suggestions 
// Easy
-Display number of Pages between the pagination buttons
-Ability to sort search results by duration or number of ingredients
-Perform ingredient validation in view, before submitting the form
-Improve recipe ingredient Input: separate in multiple fields and allow more than 6 Ingredients

// Features
-Shopping list feature: button on recipe to add ingredients to a list
-Weekly meal planning feature: assign recipes to the next 7 days and show on a weekly calendar

// Complex Features
-Get Nutrition data on each ingredient from spoonacular API and calculate total calories of recipe 

*/

// MVC Imports
import * as model from './model.js';
import * as config from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// Polyfiling Import
import 'core-js/stable';
import 'regenerator-runtime';

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    // Getting Hash
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // Getting Recipe (model.loadRecipe() will return a Promise because all async function will return a promise)
    await model.loadRecipe(id);

    // Update bookmoorks
    bookmarksView.update(model.state.bookmarks);

    // Rendering Recipe
    // Sending data to recipeView
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();
    // Load search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage(model.state.search.page));

    // Render Pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // Guard clause because goToPage is giving an undefined when loading a new page
  if (!goToPage) return;

  // Uncomment this after developing the pagination
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Render Pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  // Add bookmark or Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.removeBookMark(model.state.recipe.id);

  // Updates the recipe view
  recipeView.update(model.state.recipe);

  // Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookMarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (ownRecipe) {
  try {
    addRecipeView.renderSpinner();

    // Upload the data
    await model.uploadRecipe(ownRecipe);

    // Render own recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    console.log(model.state);

    // Change the ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Closes window
    setTimeout(() => {
      addRecipeView.closeWindow();
    }, config.CLOSE_WINDOW_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookMarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookMark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
