import {select, classNames, settings} from './settings.js';
import Home from './components/home.js';
import Search from './components/search.js';
import Discover from './components/discover.js';

const app = {
  getElements: function(){
    const thisApp = this;
    thisApp.dom = {
      pages: document.querySelectorAll(select.containerOf.page),
      navLinks: document.querySelectorAll(select.all.navLinks)
    };
  },
  initNavigation: function(){
    const thisApp = this;
    for(const navLink of thisApp.dom.navLinks){
      navLink.addEventListener('click', function(evt){
        evt.preventDefault();
        const clickedNavLink = this;
        if(clickedNavLink.classList.contains(classNames.active)){
          return;
        }
        const currentActiveNavLink = document.querySelector(select.all.activeNavLink);
        if(currentActiveNavLink){
          const currentActiveHashedID = currentActiveNavLink.getAttribute('href');
          thisApp.cleanCurrentActivePage(currentActiveHashedID);
        }
        const pageToActivateID = clickedNavLink.getAttribute('href').replace('#', '');
        thisApp.activatePage(pageToActivateID);
        if(pageToActivateID === settings.pageID.search) {
          thisApp.pages.search.dom.input.focus();
        }
      });
    }
  },
  activatePage: function(pageToActivateID){
    const thisApp = this;
    for(const page of thisApp.dom.pages){
      page.classList.toggle(
        classNames.active,
        page.id === pageToActivateID
      );
    }
    for(const navLink of thisApp.dom.navLinks){
      navLink.classList.toggle(
        classNames.active,
        navLink.getAttribute('href') === '#' + pageToActivateID
      );
    }
    window.location.hash = '#/' + pageToActivateID;
  },
  activateStartPage: function(){
    const thisApp = this;
    const idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingHash = thisApp.dom.pages[0].id;
    for(const page of thisApp.dom.pages){
      if(page.id === idFromHash){
        pageMatchingHash = idFromHash;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);
  },
  cleanCurrentActivePage: function(activePageHashedID){
    const thisApp = this;
    let dataPromise;
    switch (activePageHashedID) {
    case select.containerOf.discoverPage:
      dataPromise = thisApp.pages.discover.getRandomSong();
      thisApp.pages.discover.renderSongsList(dataPromise);
      break;
    case select.containerOf.searchPage:
      thisApp.pages.search.cleanOnPageExit();
      break;
    case select.containerOf.homePage:
      thisApp.pages.home.resetActiveCategory();
      break;
    }
  },
  initPages: function(){
    const thisApp = this;
    thisApp.pages = {
      home: new Home(select.containerOf.songsListHome),
      search: new Search(select.containerOf.songsListSearch),
      discover: new Discover(select.containerOf.songsListDiscover)
    };
  },
  init: function(){
    const thisApp = this;
    thisApp.getElements();
    thisApp.initNavigation();
    thisApp.initPages();
    thisApp.activateStartPage();
  },
};

app.init();
