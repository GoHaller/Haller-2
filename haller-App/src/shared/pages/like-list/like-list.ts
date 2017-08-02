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
  public isLikes: Boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, ) {
    let getLists = navParams.get('likes');
    if (navParams.get('comments'))
      getLists = navParams.get('comments');
    this.userAvatar = navParams.get('userAvatar');

    if (getLists[0].actedBy) this.isLikes = true;
    else this.isLikes = false;

    getLists.forEach(element => {
      if (element.createdBy) {
        let index = this.lists.findIndex(x => x['_id'] == element.createdBy['_id'])
        if (index == -1) {
          this.lists.push(element.createdBy);
        }
      } else if (element.actedBy) {
        let index = this.lists.findIndex(x => x['_id'] == element.actedBy['_id'])
        if (index == -1) {
          this.lists.push(element.actedBy);
        }
      }
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LikeListPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
