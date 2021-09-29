import {select, settings, templates} from '../settings.js';
import Page from './page.js';
import utils from '../utils.js';

class Search extends Page{
  constructor(songsListWrapperSelector){
    super(songsListWrapperSelector);
    const thisSearch = this;
    thisSearch.initActions();
  }
  getElements(){
    const thisSearch = this;
    super.getElements();
    thisSearch.dom.input = document.querySelector(select.search.input);
    thisSearch.dom.form = document.querySelector(select.search.form);
    thisSearch.dom.searchResultsNumber = document.querySelector(select.containerOf.searchResultsNumber);
  }
  initActions(){
    const thisSearch = this;
    thisSearch.dom.form.addEventListener('submit', function(evt){
      evt.preventDefault();
      if(!thisSearch.dom.input.value.replace(' ', '')){
        return;
      }
      const dataPromisesAll = thisSearch.getData();
      const dataPromiseMerged = thisSearch.removeDuplicates(dataPromisesAll);
      const dataPromiseSorted = thisSearch.sortData(dataPromiseMerged);
      thisSearch.renderResultsNumber(dataPromiseSorted);
      thisSearch.renderData(dataPromiseSorted);
    });
  }
  getData(){
    const thisSearch = this;
    const queryBasedOnTitles = settings.db.queries.searchPhraseInTitles + thisSearch.dom.input.value;
    const queryBasedOnAuthors = settings.db.queries.searchPhraseInAuthors + thisSearch.dom.input.value;
    const promiseTitles = super.getData(queryBasedOnTitles);
    const promiseAuthors = super.getData(queryBasedOnAuthors);
    const promises = Promise.all([promiseTitles, promiseAuthors]);
    return promises;
  }
  removeDuplicates(dataPromisesAll){
    const dataPromiseMerged = dataPromisesAll.then(function(arrayOfResponses){
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
    });
    return dataPromiseMerged;
  }
  sortData(dataPromise){
    dataPromise = dataPromise.then(function(uniqueSongs){
      uniqueSongs.sort(function(firstElem, secondElem){
        if(firstElem.ranking === secondElem.ranking || (isNaN(firstElem.ranking) && isNaN(secondElem.ranking))){
          return secondElem.id - firstElem.id;
        } else if(isNaN(firstElem.ranking)){
          return 1;
        } else if(isNaN(secondElem.ranking)){
          return -1;
        } else {
          return secondElem.ranking - firstElem.ranking;
        }
      });
      return uniqueSongs;
    });
    return dataPromise;
  }
  renderResultsNumber(dataPromise){
    const thisSearch = this;
    dataPromise.then(function(uniqueSongs){
      thisSearch.dom.searchResultsNumber.innerHTML = '';
      const searchResultsNumber = {
        searchResultsNumber: uniqueSongs.length
      };
      const generatedDOMElement = utils.createDOMBasedOnTemplate(searchResultsNumber, templates.searchResultsNumber);
      thisSearch.dom.searchResultsNumber.appendChild(generatedDOMElement);

    });
  }
}

export default Search;
