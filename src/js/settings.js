export const select = {
  templateOf: {
    songsList: '#template-songs-list',
    searchResultsNumber: '#template-search-results-number',
    categoriesHome: '#template-categories-home',
    categoriesSearch: '#template-categories-search'
  },
  containerOf: {
    page: '.page',
    songsListHome: '#songs-list-wrapper-home',
    songsListSearch: '#songs-list-wrapper-search',
    songsListDiscover: '#songs-list-wrapper-discover',
    categoriesHome: '#categories-wrapper-home',
    categoriesSearch: '#categories-select-wrapper',
    searchResultsNumber: '#search-results-number-wrapper',
    homePage: '#home',
    searchPage: '#search',
    discoverPage: '#discover'
  },
  all: {
    navPanel: '.main-nav',
    navLinks: '.main-nav a',
    activeNavLink: '.main-nav a.active',
    audioPlayer: '.audio-player-'
  },
  search: {
    form: '#search form',
    input: '#search input'
  },
  home: {
    categoryLink: '#categories-wrapper-home a',
    activeLink: 'a.active'
  }
};

export const classNames = {
  active: 'active',
};

export const settings = {
  pageID: {
    home: 'home',
    search: 'search'
  },
  db: {
    url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : ''),
    endpoint: {
      songs: 'songs',
      categories: 'categories'
    },
    amountOfSongsToGet: 10,
    queries: {
      bestSongs: '_sort=ranking,id&_order=asc,desc&_start=0&_limit=',
      searchPhraseInTitles: 'title_like=',
      searchPhraseInAuthors: 'author_like=',
      searchInSongCategories: 'categories_like=',
      lastSong: '_sort=id&_order=desc&_start=0&_limit=1',
      withSongID: 'id='
    }

  },
  message: {
    searchFieldsRequired: 'Please, choose a category and/or type an artist or song name',
    error: 'Sorry, but an unexpected error occured. Try again later. Error info: '
  }
};

export const templates = {
  songsList: Handlebars.compile(document.querySelector(select.templateOf.songsList).innerHTML),
  searchResultsNumber: Handlebars.compile(document.querySelector(select.templateOf.searchResultsNumber).innerHTML),
  categoriesHome: Handlebars.compile(document.querySelector(select.templateOf.categoriesHome).innerHTML),
  categoriesSearch: Handlebars.compile(document.querySelector(select.templateOf.categoriesSearch).innerHTML),
};
