import {select, settings, templates} from '../settings.js';
import Page from './page.js';
import utils from '../utils.js';

class Search extends Page{
  constructor(songsListWrapperSelector){
    super(songsListWrapperSelector);
    const thisSearch = this;
    thisSearch.renderCategories(templates.categoriesSearch, thisSearch.dom.select);
  }
  getElements(){
    const thisSearch = this;
    super.getElements();
    thisSearch.dom.input = document.querySelector(select.search.input);
    thisSearch.dom.select = document.querySelector(select.search.select);
    thisSearch.dom.form = document.querySelector(select.search.form);
    thisSearch.dom.searchResultsNumber = document.querySelector(select.containerOf.searchResultsNumber);
  }
  initActions(){
    const thisSearch = this;
    const superGetDataFunc = super.getData;
    thisSearch.dom.form.addEventListener('submit', function(evt){
      evt.preventDefault();
      const inputValue = thisSearch.dom.input.value.replace(' ', '');
      const selectValue = thisSearch.dom.select.value;
      if(!inputValue && !selectValue){
        return;
      }
      let dataPromiseSorted;
      if(!inputValue){
        const query = thisSearch.generateQueryBasedOnCategory(selectValue, true);
        dataPromiseSorted = superGetDataFunc(query);
      } else {
        const dataPromisesAll = thisSearch.getData();
        const dataPromiseMerged = thisSearch.removeDuplicates(dataPromisesAll);
        dataPromiseSorted = thisSearch.sortData(dataPromiseMerged);
      }
      thisSearch.renderSongsList(dataPromiseSorted);
      thisSearch.renderResultsNumber(dataPromiseSorted);
    });
  }
  getData(){
    const thisSearch = this;
    const inputValue = thisSearch.dom.input.value;
    let queryBasedOnTitles = settings.db.queries.searchPhraseInTitles + inputValue;
    let queryBasedOnAuthors = settings.db.queries.searchPhraseInAuthors + inputValue;
    const queryBasedOnCategory = thisSearch.generateQueryBasedOnCategory(thisSearch.dom.select.value);
    queryBasedOnTitles += '&' + queryBasedOnCategory;
    queryBasedOnAuthors += '&' + queryBasedOnCategory;
    const promiseTitles = super.getData(queryBasedOnTitles);
    const promiseAuthors = super.getData(queryBasedOnAuthors);
    const promises = Promise.all([promiseTitles, promiseAuthors]);
    return promises;
  }
  async removeDuplicates(dataPromisesAll){
    const arrayOfResponses = await dataPromisesAll;
    const uniqueIDs = [];
    const uniqueSongs = arrayOfResponses[0];
    for(const song of uniqueSongs){
      uniqueIDs.push(song.id);
    }
    for(const song of arrayOfResponses[1]){
      if(!uniqueIDs.includes(song.id)){
        uniqueIDs.push(song.id);
        uniqueSongs.push(song);
      }
    }
    return uniqueSongs;
  }
  async sortData(dataPromise){
    const uniqueSongs = await dataPromise;
    uniqueSongs.sort(function(firstElem, secondElem){
      if(firstElem.ranking === secondElem.ranking || (isNaN(firstElem.ranking) && isNaN(secondElem.ranking))){
        return secondElem.id - firstElem.id;
      } else if(isNaN(firstElem.ranking)){
        return 1;
      } else if(isNaN(secondElem.ranking)){
        return -1;
      } else {
        return firstElem.ranking - secondElem.ranking;
      }
    });
    return uniqueSongs;
  }
  async renderResultsNumber(dataPromise){
    const thisSearch = this;
    try {
      const uniqueSongs = await dataPromise;
      const searchResultsNumber = {
        searchResultsNumber: uniqueSongs.length
      };
      const generatedDOMElement = utils.createDOMBasedOnTemplate(searchResultsNumber, templates.searchResultsNumber);
      thisSearch.dom.searchResultsNumber.appendChild(generatedDOMElement);
    } catch(err) {
      alert(settings.errorMessage + err.toString());
    }
  }
  removeRenderedSongs(){
    const thisSearch = this;
    super.removeRenderedSongs();
    thisSearch.dom.searchResultsNumber.innerHTML = '';
  }
  cleanOnPageVisit(){
    const thisSearch = this;
    thisSearch.removeRenderedSongs();
    thisSearch.dom.select.value = '';
    thisSearch.dom.input.value = '';
    thisSearch.dom.input.focus();
  }
}

export default Search;
