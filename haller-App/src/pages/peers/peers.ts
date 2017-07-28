import { Pipe, PipeTransform, Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ProfileProvider } from "../../shared/providers/profile.provider";

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
  public selectedUser = [];
  private clearList: Boolean = false;
  public skip = 0; public limit = 50;
  public searchText: String = '';
  private userAvatar = '';
  private chooseUser: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public profileProvider: ProfileProvider) {
    this.local = new Storage('localstorage');
    this.userAvatar = profileProvider.httpClient.userAvatar;
    this.chooseUser = this.navParams.get('resolve') ? true : false;
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      // this.getPeersList();
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad Peers');
  }
  ionViewDidLeave() {
    // console.log('ionViewDidLeave Peers');
    this.clearList = true;
    this.peersList = [];
  }

  ionViewWillEnter() {
    if (this.userInfo['_id']) {
      this.clearList = true;
      this.getPeersList();
    } else {
      setTimeout(() => {
        this.clearList = true;
        this.getPeersList();
      }, 100);
    }
  }

  goBack() {
    if (this.chooseUser) {
      this.navParams.get('resolve')(this.selectedUser);
    }
    this.navCtrl.pop();
  }

  getItems(ev: any) {
    this.searchText = ev.target.value;
  }

  getPeersList() {
    let response = null;
    if (this.selectedPeers == 'residents') {
      response = this.profileProvider.getUserByResidence(this.userInfo['_id'], this.userInfo['residence'], this.skip, this.limit);
    } else {
      response = this.profileProvider.listUser(this.userInfo['_id'], this.skip, this.limit);
    }
    response.subscribe((res: any) => {
      if (this.clearList) {
        this.peersList = res; this.clearList = false;
      } else {
        this.peersList = this.peersList.concat(res);
      }
    }, error => {
      console.info('error', error);
    })
  }

  isUserSelected(peer) {
    return this.selectedUser.indexOf(peer) > -1
  }

  viewProfile(peer) {
    // console.info('peer', peer);
    if (this.chooseUser) {
      if (this.selectedUser.indexOf(peer) > -1) {
        let index = this.selectedUser.indexOf(peer);
        this.selectedUser.splice(index, 1);
      } else {
        this.selectedUser.push(peer);
      }
    } else
      this.navCtrl.push('Profile', { userData: peer }, { animate: true, direction: 'forward' });
  }

  doInfinite(): Promise<any> {
    return new Promise((resolve) => {
      this.skip += this.limit;
      this.getPeersList();
    })
  }

  changeSegment(segment) {
    this.skip = 0;
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
