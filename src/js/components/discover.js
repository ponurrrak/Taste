import {settings} from '../settings.js';
import Page from './page.js';

class Discover extends Page{
  constructor(songsListWrapperSelector){
    super(songsListWrapperSelector);
    const thisDiscover = this;
    thisDiscover.getAllSongsNumber();
    const dataPromise = thisDiscover.getRandomSong();
    thisDiscover.renderData(dataPromise);
  }
  getAllSongsNumber(){
    const thisDiscover = this;
    thisDiscover.lastSongPromise = thisDiscover.getData(settings.db.queries.lastSong);
  }
  async getRandomSong(){
    const thisDiscover = this;
    const lastSongData = await thisDiscover.lastSongPromise;
    const lastSongID =  lastSongData[0].id;
    const randomID = Math.floor(Math.random() * lastSongID) + 1;
    const query = settings.db.queries.withSongID + randomID;
    return thisDiscover.getData(query);
  }
}

export default Discover;
