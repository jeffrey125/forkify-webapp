// Import config and helpers files
import * as config from './config.js';
import * as helpers from './helpers.js';

const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: config.RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

const loadRecipe = async function (id) {
  try {
    //   Gets Recipe
    const data = await helpers.AJAX(
      `${config.API_URL}/${id}?key=${config.API_KEY}`
    );

    //   Cleans data and stores data in state
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

const loadSearchResults = async function (query) {
  try {
    //
    const data = await helpers.AJAX(
      `${config.API_URL}?search=${query}&key=${config.API_KEY}`
    );

    // Storing it in the search object
    state.search.query = query;

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

const updateServings = function (newServings) {
  if (!newServings) return;

  // Update serving ingredients
  const updatedIngredients = state.recipe.ingredients.forEach(
    ings =>
      (ings.quantity = (ings.quantity * newServings) / state.recipe.servings)
  );

  state.recipe.servings = newServings;
};

const storeBookmarks = function () {
  try {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  } catch (err) {
    throw new Error(`localStorage disabled, can't use bookmarks`);
  }
};

const addBookMark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Stores bookmarks in localStorage API
  storeBookmarks();
};

const removeBookMark = function (id) {
  // Finding the index of the target ID
  const index = state.bookmarks.findIndex(el => el.id === id);

  // Removing it from the array
  state.bookmarks.splice(index, 1);

  // Removing highlight bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Stores bookmarks in localStorage API
  storeBookmarks();
};

const uploadRecipe = async function (ownRecipe) {
  try {
    // Convert raw data to our data
    const ingredients = Object.entries(ownRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(ings => ings.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong Ingredient Format! Please use the correct Format.'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Converted Data
    const recipe = {
      title: ownRecipe.title,
      source_url: ownRecipe.sourceUrl,
      image_url: ownRecipe.image,
      publisher: ownRecipe.publisher,
      cooking_time: +ownRecipe.cookingTime,
      servings: +ownRecipe.servings,
      ingredients,
    };

    const data = await helpers.AJAX(
      `${config.API_URL}?key=${config.API_KEY}`,
      recipe
    );

    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  const data = JSON.parse(storage);

  if (!data) return;
  state.bookmarks = data;
};

init();

export {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateServings,
  addBookMark,
  removeBookMark,
  uploadRecipe,
};
