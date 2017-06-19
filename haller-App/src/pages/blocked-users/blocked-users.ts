import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ProfileEditProvider } from "../profile-edit/profile-edit.provider";
import { MessagesProvider } from "../messages/messages.provider";

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private profileEditProvider: ProfileEditProvider, private messageProvider: MessagesProvider,
    public actionSheetCtrl: ActionSheetController) {
    this.local = new Storage('localstorage');
    this.local.get('userInfo').then(val => {
      this.userInfo = JSON.parse(val);
      this.getBlockedUsers();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlockedUsers');
  }

  getBlockedUsers() {
    this.profileEditProvider.getBlockedUsers(this.userInfo['_id'])
      .subscribe((res: any) => {
        this.blockedUsers = res;
        console.info('this.blockedUsers', this.blockedUsers);
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
    this.messageProvider.blockUser(this.userInfo['_id'], blockUserId)
      .subscribe((res: any) => {
        if (res['_id'] == this.userInfo['_id']) {
          this.userInfo = res;
          this.local.set('userInfo', JSON.stringify(res)).then(() => { });
          this.getBlockedUsers();
        }
      }, error => {

      });
  }

}