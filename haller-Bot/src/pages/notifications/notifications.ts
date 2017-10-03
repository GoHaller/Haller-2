import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, IonicPage, ModalController } from 'ionic-angular';
import { BotconvoProvider } from "../../providers/botconvo-provider";
import { ImageFullComponent } from '../view-image/image.full';
// $IMPORTSTATEMENT

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class Notifications {
  local: Storage;
  userInfo: any = {};
  notifications = [];
  userMessage: string = '';
  refresher: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, storage: Storage,
    private botconvoProvider: BotconvoProvider, public modalCtrl: ModalController) {
    this.local = storage;
  }

  ionViewDidLoad() {
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.getNotifications();
    });
  }

  getNotifications() {
    this.botconvoProvider.getNotifications(this.userInfo['_id'])
      .subscribe((res: any) => {
        this.userMessage = res.length > 0 ? '' : 'Nothing here yet.';
        this.notifications = res;
        if (this.refresher) {
          this.refresher.complete();
          this.refresher = null;
        }
        console.log('getNotifications res', res);
      }, error => {
        this.botconvoProvider.http.showError(error);
      })
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.getNotifications();
  }

  checkIfPdf(url) {
    return url.endsWith('.pdf');
  }

  openUrl(url) {
    if (this.checkIfPdf(url)) {
      // this.iab.create(url, '_system'); 
      window.open(encodeURI(url), '_system');
    }
    else
      this.viewFullImage(url);
  }

  viewFullImage(image) {
    if (image) {
      let modal = this.modalCtrl.create(ImageFullComponent, { imgeSrc: image });
      modal.present();
    }
  }

}
