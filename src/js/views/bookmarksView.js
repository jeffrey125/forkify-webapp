// Import Parent class
import View from './View.js';
import previewView from './previewView.js';

class BookMarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;
  _message;

  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkUp() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookMarksView();
