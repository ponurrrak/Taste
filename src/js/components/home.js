import {settings} from '../settings.js';
import Page from './page.js';

class Home extends Page{
  constructor(songsListWrapperSelector){
    super(songsListWrapperSelector);
    const thisHome = this;
    const query = settings.db.queries.bestSongs + settings.db.amountOfSongsToGet;
    const dataPromise = thisHome.getData(query);
    thisHome.renderData(dataPromise);
  }
}

export default Home;
