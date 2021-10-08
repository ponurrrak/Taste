import {select, settings, templates} from '../settings.js';
import Page from './page.js';
import utils from '../utils.js';

class Search extends Page{
  constructor(songsListWrapperSelector){
    super(songsListWrapperSelector);
    const thisSearch = this;
    thisSearch.renderCategories(templates.categoriesSearch, thisSearch.dom.selectWrapper);
  }
  getElements(){
    const thisSearch = this;
    super.getElements();
    thisSearch.dom.input = document.querySelector(select.search.input);
    thisSearch.dom.selectWrapper = document.querySelector(select.containerOf.categoriesSearch);
    thisSearch.dom.form = document.querySelector(select.search.form);
    thisSearch.dom.searchResultsNumber = document.querySelector(select.containerOf.searchResultsNumber);
  }
  initActions(){
    const thisSearch = this;
    const superGetDataFunc = super.getData;
    const selectElement = thisSearch.dom.categoriesElement;
    thisSearch.dom.form.addEventListener('submit', function(evt){
      evt.preventDefault();
      const inputValue = thisSearch.dom.input.value.replace(' ', '');
      if(!inputValue && !selectElement.value){
        alert(settings.message.searchFieldsRequired);
        return;
      }
      let dataPromiseSorted;
      if(!inputValue){
        const query = thisSearch.generateQueryBasedOnCategory(selectElement.value, true);
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
  generateQueries(){
    const thisSearch = this;
    const selectElement = thisSearch.dom.categoriesElement;
    let queryBasedOnTitles = settings.db.queries.searchPhraseInTitles + thisSearch.dom.input.value;
    let queryBasedOnAuthors = settings.db.queries.searchPhraseInAuthors + thisSearch.dom.input.value;
    if(selectElement.value){
      const queryBasedOnCategory = thisSearch.generateQueryBasedOnCategory(selectElement.value);
      queryBasedOnTitles += '&' + queryBasedOnCategory;
      queryBasedOnAuthors += '&' + queryBasedOnCategory;
    }
    return [queryBasedOnTitles, queryBasedOnAuthors];
  }
  getData(){
    const thisSearch = this;
    const [queryBasedOnTitles, queryBasedOnAuthors] = thisSearch.generateQueries();
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
      alert(settings.message.error + err.toString());
    }
  }
  removeRenderedSongs(){
    const thisSearch = this;
    super.removeRenderedSongs();
    thisSearch.dom.searchResultsNumber.innerHTML = '';
  }
  cleanOnPageVisit(){
    const thisSearch = this;
    const selectElement = thisSearch.dom.categoriesElement;
    thisSearch.removeRenderedSongs();
    selectElement.value = '';
    thisSearch.dom.input.value = '';
    thisSearch.dom.input.focus();
  }
}

export default Search;
