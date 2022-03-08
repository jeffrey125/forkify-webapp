// TODO REFACTOR CODE on _generateMarkUp

// Import Parent class
import View from './View.js';

// Import icons
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkUp() {
    // Calculate how many pages do we need
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currPage = this._data.page;

    // Page 1 and there are other pages
    if (currPage === 1 && numPages > 1) {
      return `  
      <button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
         `;
    }

    // Last page
    if (currPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          currPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
        </button>
           `;
    }

    // Some other page and there are other pages
    if (currPage < numPages) {
      return `
      <button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currPage - 1}</span>
      </button>
      <button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
         `;
    }

    // Page 1 and there are no other pages
    return '';
  }
}

export default new PaginationView();
