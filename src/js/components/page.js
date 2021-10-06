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
  getCategories(){

  }
  async getData(query){
    const url = settings.db.url + '/' + settings.db.endpoint + '?' + query;
    const rawResponse = await fetch(url);
    return rawResponse.json();
  }
  async renderData(dataPromise){
    const thisPage = this;
    try {
      const parsedResponse = await dataPromise;
      thisPage.removeRenderedData();
      for(const songData of parsedResponse){
        const generatedDOMElement = utils.createDOMBasedOnTemplate(songData, templates.songsList);
        thisPage.dom.songsListWrapper.appendChild(generatedDOMElement);
        const currentAudioPlayerSelector = thisPage.songsListWrapperSelector + ' ' + select.all.audioPlayer + songData.id;
        const currentAudioPlayer = new GreenAudioPlayer(currentAudioPlayerSelector, {stopOthersOnPlay: true});
        thisPage.audioPlayers.push(currentAudioPlayer);
      }
    } catch(err) {
      alert(settings.errorMessage + err.toString());
    }
  }
  removeRenderedData(){
    const thisPage = this;
    thisPage.dom.songsListWrapper.innerHTML = '';
    thisPage.audioPlayers = [];
  }
}

export default Page;
