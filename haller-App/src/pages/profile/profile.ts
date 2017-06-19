import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ImageFullComponent } from '../../shared/pages/image.full';
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
  private userId: String = '';
  public uid: String = '';
  public userInfo: Object = {};
  public showMsgBtn: Boolean = false;
  private tagBorderColor: string = 'dark';

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams,
    private event: Events) {
    this.uid = this.navParams.data.uid || null;
    this.userInfo = this.navParams.data.userData || {};
    this.showMsgBtn = this.navParams.data.allowMessage == false ? false : true;

    this.local = new Storage('localstorage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    this.local.get('uid').then(val => {
      this.userId = val;
    })

    if (this.uid) {
      this.local.get('userInfo').then((val) => {
        let userData = JSON.parse(val);
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
        if (this.uid == userData._id) {
          this.userInfo = userData;
        }
      });
    });
  }

  viewFullImage(currentProfile) {
    if (currentProfile) {
      let modal = this.modalCtrl.create(ImageFullComponent, { imgeSrc: currentProfile.secure_url });
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

}
