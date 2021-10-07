import {settings, templates, select, classNames} from '../settings.js';
import utils from '../utils.js';
import Page from './page.js';

class Home extends Page{
  constructor(songsListWrapperSelector){
    super(songsListWrapperSelector);
    const thisHome = this;
    thisHome.getCategories();
    thisHome.renderCategories(templates.categoriesHome, thisHome.dom.categoriesWrapper);
    const query = settings.db.queries.bestSongs + settings.db.amountOfSongsToGet;
    const dataPromise = thisHome.getData(query);
    thisHome.songsByCategoriesBuffer = {mainHome: dataPromise};
    thisHome.renderSongsList(dataPromise);
  }
  getElements(){
    const thisHome = this;
    super.getElements();
    thisHome.dom.categoriesWrapper = document.querySelector(select.containerOf.categoriesHome);
  }
  initActions(){
    const thisHome = this;
    thisHome.dom.categoriesWrapper.addEventListener('click', function(evt){
      evt.preventDefault();
      const clickedLink = utils.lookForEventTarget(evt, select.home.categoryLink);
      if(clickedLink){
        window.location.hash = '#/home';
        const currentActiveCategoryLink = thisHome.dom.categoriesWrapper.querySelector(select.home.activeLink);
        if(currentActiveCategoryLink){
          currentActiveCategoryLink.classList.remove(classNames.active);
          if(clickedLink === currentActiveCategoryLink){
            thisHome.renderSongsList(thisHome.songsByCategoriesBuffer.mainHome);
            return;
          }
        }
        clickedLink.classList.add(classNames.active);
        const categoryName = clickedLink.getAttribute('href').replace('#', '');
        const bufferedCategorySongs = thisHome.songsByCategoriesBuffer[categoryName];
        if(bufferedCategorySongs){
          thisHome.renderSongsList(bufferedCategorySongs);
        } else {
          const query = thisHome.generateQueryBasedOnCategory(categoryName, true, settings.db.amountOfSongsToGet);
          const dataPromise = thisHome.getData(query);
          thisHome.songsByCategoriesBuffer[categoryName] = dataPromise;
          thisHome.renderSongsList(dataPromise);
        }
      }
    });
  }
}

export default Home;
