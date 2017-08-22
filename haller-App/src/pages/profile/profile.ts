import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, Events, ToastController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProfileProvider } from "../../shared/providers/profile.provider";

import { ImageFullComponent } from '../../shared/pages/image.full';
import { TabsPage } from "../tabs/tabs";
/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

  private local: Storage;
  public userId: string = '';
  public uid: string = '';
  public userInfo: Object = {};
  public loggedInUser: Object = {};
  public showMsgBtn: Boolean = false;
  public tagBorderColor: string = 'dark';
  public userAvatar = '';

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams,
    private event: Events, public profileProvider: ProfileProvider, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController) {
    this.uid = this.navParams.data.uid || null;
    this.userInfo = this.navParams.data.userData || {};
    this.showMsgBtn = this.navParams.data.allowMessage == false ? false : true;
    this.userAvatar = profileProvider.httpClient.userAvatar;
    this.local = new Storage('localstorage');
    this.local.get('userInfo').then((val) => {
      let userData = JSON.parse(val);
      this.loggedInUser = userData;
    });
  }

  goBack() {
    if (this.navCtrl.length() > 1) {
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot(TabsPage);
    }
  }

  ionViewDidLoad() {
    this.local.get('uid').then(val => {
      this.userId = val;
    })

    if (this.uid) {
      this.local.get('userInfo').then((val) => {
        let userData = JSON.parse(val);
        this.loggedInUser = userData;
        if (this.uid == userData._id) {
          this.userInfo = userData;
          this.tagBorderColor = 'primary';
        } else {
          this.tagBorderColor = 'dark';
        }
      });
    } else if (!this.userInfo) {
      this.goBack();
    }
    this.event.subscribe('user-updated', () => {
      this.local.get('userInfo').then((val) => {
        let userData = JSON.parse(val);
        this.loggedInUser = userData;
        if (this.uid == userData._id) {
          this.userInfo = userData;
        }
      });
    });
  }

  viewFullImage(currentProfile) {
    if (currentProfile) {
      let modal = this.modalCtrl.create(ImageFullComponent, { imgeSrc: currentProfile });
      modal.present();
    }
  }

  gotoMessage() {
    this.navCtrl.push('Message', { recipients: this.userInfo }, { animate: true, direction: 'forward' });
  }

  gotoProfileEdit() {
    new Promise((resolve, reject) => {
      this.navCtrl.push('ProfileEdit', { resolve: resolve }, { animate: true, direction: 'forward' });
    }).then(data => {
      this.userInfo = data;
    });

  }

  confirmBlock(blockUserId) {
    let options = [{ text: 'Block', handler: () => { this.blockUser(); } }];
    options.push({ text: 'No', handler: () => { } });
    let actionSheet = this.actionSheetCtrl.create({ buttons: options });
    actionSheet.present();
  }

  blockUser() {
    if (this.userId != this.userInfo['_id']) {
      this.profileProvider.blockUser(this.userId, this.userInfo['_id'])
        .subscribe((res: any) => {
          if (res['_id'] == this.userId) {
            this.userInfo = res;
            this.local.set('userInfo', JSON.stringify(res)).then(() => {
              this.goBack();
            });
          }
        }, error => {
          let toast = this.toastCtrl.create({
            message: 'Please try later',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          console.info('sendProblem error', error);
        });
    }
  }

  getOrganizationAsString(organizations) {
    if (organizations) {
      let oArray = [];
      organizations.forEach(ele => {
        oArray.push(ele.name);
      });
      return oArray.join(' | ');
    } else {
      return null;
    }

  }

  getFbLikesObject(user) {
    // return user.facebook && user.facebook.likes ? user.facebook.likes.data : [];
    let likes = [];
    if (user.facebook && user.facebook.likes && this.loggedInUser['facebook'] && this.loggedInUser['facebook'].likes) {
      this.loggedInUser['facebook'].likes.data.forEach(lgiuLikes => {
        let commonLikes = user.facebook.likes.data.filter(puLikes => {
          return puLikes.id == lgiuLikes.id || puLikes.name == lgiuLikes.name
        });
        if (commonLikes)
          likes = likes.concat(commonLikes);
      });
    }
    return likes;
  }

}
