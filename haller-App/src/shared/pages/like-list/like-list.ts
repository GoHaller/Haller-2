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
  public lists = [];
  public userAvatar = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, ) {
    this.lists = navParams.get('likes');
    if (navParams.get('comments'))
      this.lists = navParams.get('comments');
    this.userAvatar = navParams.get('userAvatar');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LikeListPage');
  }

  getImage(item) {
    if (item.actedBy)
    { return item.actedBy.currentProfile ? item.actedBy.currentProfile.secure_url : this.userAvatar }
    else if (item.createdBy) {
      return item.createdBy.currentProfile ? item.createdBy.currentProfile.secure_url : this.userAvatar
    }
  }

  getNames(item) {
    return item.actedBy ? (item.actedBy.firstName + ' ' + item.actedBy.lastName) : (item.createdBy.firstName + ' ' + item.createdBy.lastName);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
