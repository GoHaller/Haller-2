import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-giphy-model',
  templateUrl: 'giphy-model.html',
})
export class GiphyModel {

  private gifList = [];
  private giphyKey = 'dc6zaTOxFJmzC';
  private giphyBaseUrl = 'http://api.giphy.com/v1/gifs/';
  private offset = 0;
  private limit = 20;
  private searchText = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.gifList = [];
    this.getGiphyGifTrending();
  }

  selectGif(gif) {
    this.viewCtrl.dismiss(gif);
  }
  makeSearch() {
    this.gifList = [];
    this.getGiphyGifSearch();
  }

  getGiphyGifTrending() {
    let url = this.giphyBaseUrl + 'trending?api_key=' + this.giphyKey + '&limit=' + this.limit + '&offset=' + this.offset;
    this.getGifs(url).subscribe((res: any) => {
      this.gifList = this.gifList.concat(res.data);
    }, error => {
      console.info('error', error);
    })
  }

  getGiphyGifSearch() {
    if (this.searchText.length > 2) {
      let searchUrl = this.giphyBaseUrl + 'search?q=' + this.searchText.replace(' ', '+') + '&api_key=' + this.giphyKey + '&limit=' + this.limit + '&offset=' + this.offset;;
      this.getGifs(searchUrl).subscribe((res: any) => {
        this.gifList = this.gifList.concat(res.data);
      }, error => {
        console.info('error', error);
      })
    }
  }

  doInfinite(infiniteScroll) {
    this.offset += this.limit;
    if (this.searchText.length > 0) {
      this.getGiphyGifSearch();
    } else {
      this.getGiphyGifTrending();
    }
    infiniteScroll.complete();
  }

  getGifs(url: string) {
    return this.http.get(url).map(this.extractData);
  }

  extractData(res: any) {
    let body = JSON.parse(res._body);
    return body || {};
  }

}
