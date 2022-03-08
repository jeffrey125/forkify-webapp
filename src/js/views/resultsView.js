// Import Parent class
import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = `No Recipes Found, Please try again!`;
  _message;

  _generateMarkUp() {
    return this._data
      .map(recipeResults => previewView.render(recipeResults, false))
      .join('');
  }
}

export default new ResultsView();
