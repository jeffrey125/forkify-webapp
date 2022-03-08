// Import Icon
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data
   * @param {boolean} [render=true] If false, create HTML string instead of rendering to the DOM
   * @returns {undefined | string} If render is  false it will return a HTML string
   * @author Jeffrey Asilo
   */

  // Stores data for rendering
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const html = this._generateMarkUp();

    if (!render) return html;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  // DOM Updating Algorithm
  update(data) {
    this._data = data;
    const newHtml = this._generateMarkUp();

    // Storing the updated HTML in memory
    const newDOM = document.createRange().createContextualFragment(newHtml);

    // DOM Node
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentEl.querySelectorAll('*'));

    // DOM Updating logic
    newElements.forEach((newEl, i) => {
      const curEl = currElements[i];

      // Updating Text Content
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updating Data Attiributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  // Render spinner while loading the data
  renderSpinner() {
    const html = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  // Throws an Error to the UI when Query/Search not found
  renderError(message = this._errorMessage) {
    const html = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  //  Throws a Success message
  renderMessage(message = this._message) {
    const html = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  // Clears container
  _clear() {
    this._parentEl.innerHTML = '';
  }
}
