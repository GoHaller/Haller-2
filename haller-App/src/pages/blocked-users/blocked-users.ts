import { Component, PipeTransform, Pipe } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ProfileProvider } from "../../shared/providers/profile.provider";
import { ConvoProvider } from "../../shared/providers/convo.provider";

/**
 * Generated class for the BlockedUsers page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-blocked-users',
  templateUrl: 'blocked-users.html',
})
export class BlockedUsers {

  private local: Storage;
  private userInfo: Object = {};
  private blockedUsers = [];
  private searchText: String = '';
  private userAvatar = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public profileProvider: ProfileProvider, private convoProvider: ConvoProvider,
    public actionSheetCtrl: ActionSheetController, storage: Storage) {
    this.local = storage;
    this.userAvatar = convoProvider.httpClient.userAvatar;
    this.local.get('userInfo').then(val => {
      this.userInfo = JSON.parse(val);
      this.getBlockedUsers();
    })
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad BlockedUsers');
  }

  ionViewWillEnter() {
    if (this.userInfo['_id']) {
      this.getBlockedUsers();
    }
  }

  getBlockedUsers() {
    this.profileProvider.getBlockedUsers(this.userInfo['_id'])
      .subscribe((res: any) => {
        this.blockedUsers = res;
      }, error => {
        console.info('getBlockedUsers error', error);
      });
  }

  viewProfile(blocked) {
    this.navCtrl.push('Profile', { userData: blocked }, { animate: true, direction: 'forward' });
  }

  confirmUnblock(blockUserId) {
    let options = [{ text: 'Unblock', handler: () => { this.unBlockUser(blockUserId); } }];
    options.push({ text: 'No', handler: () => { } });
    let actionSheet = this.actionSheetCtrl.create({ buttons: options });
    actionSheet.present();
  }

  unBlockUser(blockUserId) {
    this.convoProvider.blockUser(this.userInfo['_id'], blockUserId)
      .subscribe((res: any) => {
        if (res['_id'] == this.userInfo['_id']) {
          this.userInfo = res;
          this.local.set('userInfo', JSON.stringify(res)).then(() => { });
          this.getBlockedUsers();
        }
      }, error => {

      });
  }

  getItems(ev: any) {
    this.searchText = ev.target.value;
  }

}


@Pipe({
  name: "blockedsearch",
  pure: false
})
export class BlockedFilterPipe implements PipeTransform {
  transform(items: any, conditions: string[]): any {
    return items.filter(item => {
      if (conditions[2] && conditions[2].length > 0) {
        let name = item.user[conditions[0]] + ' ' + item.user[conditions[1]];
        if (name.toUpperCase().startsWith(conditions[2].toUpperCase())) {
          return true;
        }
        else return false;
      } else return true;
    });
  };

}
