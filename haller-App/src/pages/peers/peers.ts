import { Pipe, PipeTransform, Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { PeersProvider } from './peers.provider'

/**
 * Generated class for the Peers page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-peers',
  templateUrl: 'peers.html',
})
export class Peers {
  public selectedPeers: String = 'residents';
  items;
  private local: Storage;
  public userInfo: Object = {};
  public peersList = [];
  private clearList: Boolean = false;
  public skip = 0; public limit = 50;
  public searchText: String = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public peersProvider: PeersProvider) {
    this.local = new Storage('localstorage');
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.getPeersList();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Peers');
  }
  goBack() {
    this.navCtrl.pop();
  }

  getItems(ev: any) {
    this.searchText = ev.target.value;
  }


  getPeersList() {
    if (this.selectedPeers == 'residents') {
      this.peersProvider.getUserByResidence(this.userInfo['_id'], this.userInfo['residence'], this.skip, this.limit).subscribe((res: any) => {
        if (this.clearList) {
          this.peersList = res; this.clearList = false;
        } else {
          this.peersList = this.peersList.concat(res);
        }
      }, error => {
        console.info('error', error);
      })
    } else {
      this.peersProvider.listUser(this.userInfo['_id'], this.skip, this.limit).subscribe((res: any) => {
        if (this.clearList) {
          this.peersList = res; this.clearList = false;
        } else {
          this.peersList = this.peersList.concat(res);
        }
      }, error => {
        console.info('error', error);
      })
    }
  }

  viewProfile(peer) {
    // console.info('peer', peer);
    this.navCtrl.push('Profile', { userData: peer }, { animate: true, direction: 'forward' });
  }

  doInfinite(): Promise<any> {
    return new Promise((resolve) => {
      this.skip += this.limit;
      this.getPeersList();
    })
  }

  changeSegment(segment) {
    this.selectedPeers = segment;
    this.clearList = true;
    this.getPeersList();
  }

}


@Pipe({
  name: "peersearch",
  pure: false
})
export class PeerFilterPipe implements PipeTransform {
  transform(items: any, conditions: string[]): any {
    return items.filter(item => {
      if (conditions[2] && conditions[2].length > 0) {
        let name = item[conditions[0]] + ' ' + item[conditions[1]];
        if (name.toUpperCase().startsWith(conditions[2].toUpperCase())) {
          return true;
        }
        else return false;
      } else return true;
    });
  };

}
