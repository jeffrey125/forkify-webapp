// TODO REFACTOR CODE on _generateMarkUp

// Import Parent class
import View from './View.js';

// Import icons
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _message = 'Recipe was Sucessfully Uploaded!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _openBtn = document.querySelector('.nav__btn--add-recipe');
  _closeBtn = document.querySelector('.btn--close-modal');

  constructor() {
    super();

    // Handler method
    this._addHandlerShowWindow();
    this._addHandlerRemoveWindow();
  }

  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  closeWindow() {
    this._addHideClass();
  }

  _addHideClass() {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
  }

  _showWindow() {
    this._overlay.classList.remove('hidden');
    this._window.classList.remove('hidden');
  }

  _removeWindow(e) {
    if (e.key === 'Escape' || e.type === 'click') {
      this._addHideClass();
    }
  }

  _addHandlerShowWindow() {
    this._openBtn.addEventListener('click', this._showWindow.bind(this));
  }

  _addHandlerRemoveWindow() {
    // Hides the window when clicked
    [this._closeBtn, this._overlay].forEach(el =>
      el.addEventListener('click', this._removeWindow.bind(this))
    );

    // Hides the window when pressing Escape
    window.addEventListener('keyup', this._removeWindow.bind(this));
  }

  _generateMarkUp() {}
}

export default new AddRecipeView();
