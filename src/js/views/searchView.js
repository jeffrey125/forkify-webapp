class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearText();
    return query;
  }

  addHandlerSearch(handler) {
    // Search Bar
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });

    // Search BTN
    document
      .querySelector('.search__btn')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler();
      });
  }

  _clearText() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
