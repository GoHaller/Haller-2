import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the LikeListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-like-list',
  templateUrl: 'like-list.html',
})
export class LikeListPage {
  public likes = [];
  public userAvatar = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, ) {
    this.likes = navParams.get('likes');
    this.userAvatar = navParams.get('userAvatar');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LikeListPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
