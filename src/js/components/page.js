/* global GreenAudioPlayer */ // eslint-disable-line no-unused-vars
import {settings, templates, select} from '../settings.js';
import utils from '../utils.js';

class Page {
  constructor(songsListWrapperSelector){
    const thisPage = this;
    thisPage.songsListWrapperSelector = songsListWrapperSelector;
    thisPage.getElements();
  }
  getElements(){
    const thisPage = this;
    thisPage.dom = {
      songsListWrapper: document.querySelector(thisPage.songsListWrapperSelector),
    };
  }
  async getData(query, endpoint = settings.db.endpoint.songs){
    const url = settings.db.url + '/' + endpoint + '?' + query;
    const rawResponse = await fetch(url);
    return rawResponse.json();
  }
  getCategories(){
    const thisPage = this;
    Page.prototype.categories = thisPage.getData('', settings.db.endpoint.categories);
  }
  async renderSongsList(dataPromise){
    const thisPage = this;
    try {
      const parsedResponse = await dataPromise;
      thisPage.removeRenderedSongs();
      for(const songData of parsedResponse){
        const generatedDOMElement = utils.createDOMBasedOnTemplate(songData, templates.songsList);
        thisPage.dom.songsListWrapper.appendChild(generatedDOMElement);
        const currentAudioPlayerSelector = thisPage.songsListWrapperSelector + ' ' + select.all.audioPlayer + songData.id;
        const currentAudioPlayer = new GreenAudioPlayer(currentAudioPlayerSelector, {stopOthersOnPlay: true});
        thisPage.audioPlayers.push(currentAudioPlayer);
      }
    } catch(err) {
      alert(settings.message.error + err.toString());
    }
  }
  async renderCategories(templateFunction, wrapper){
    const thisPage = this;
    try {
      const categories = await thisPage.categories;
      categories.sort();
      thisPage.dom.categoriesElement = utils.createDOMBasedOnTemplate({categories}, templateFunction);
      wrapper.appendChild(thisPage.dom.categoriesElement);
      thisPage.initActions && thisPage.initActions();
    } catch(err) {
      alert(settings.message.error + err.toString());
    }
  }
  removeRenderedSongs(){
    const thisPage = this;
    thisPage.dom.songsListWrapper.innerHTML = '';
    thisPage.audioPlayers = [];
  }
  generateQueryBasedOnCategory(category, haveResultsToBeSorted, howManyResults){
    let query = settings.db.queries.searchInSongCategories + '(,|^)' + category + '(,|$)';
    query = haveResultsToBeSorted ?
      isNaN(howManyResults) ?
        query + '&' + settings.db.queries.bestSongs :
        query + '&' + settings.db.queries.bestSongs + settings.db.amountOfSongsToGet
      : query;
    return query;
  }
}

export default Page;
