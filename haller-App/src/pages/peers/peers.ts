import { Pipe, PipeTransform, Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
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
  public infiniteScroll = null;
  shouldEnableInfinite: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public profileProvider: ProfileProvider, private viewCtrl: ViewController, storage: Storage) {
    this.local = storage;
    this.userAvatar = profileProvider.httpClient.userAvatar;
    // this.chooseUser = this.navParams.get('resolve') ? true : false;
    this.chooseUser = this.navParams.get('selection') ? true : false;
    this.selectedUser = this.navParams.get('selected') || [];
    this.profileProvider.httpClient.getActivationToken();
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.getPeersList();
    });
  }

  ionViewDidLoad() {}
  ionViewDidLeave() {}
  ionViewWillEnter() {}

  goBack() {
    this.navCtrl.pop();
  }

  doneChoosing() {
    if (this.selectedUser.length)
      this.navCtrl.push('Message', { selected: this.selectedUser }, { animate: true, direction: 'forward' })
        .then(() => {
          // first we find the index of the current view controller:
          const index = this.viewCtrl.index;
          // then we remove it from the navigation stack
          this.navCtrl.remove(index);
        });
  }

  onSearchChange(ev: any) {
    if (!ev.target.value || ev.target.value.length == 0) {
      this.searchText = '';
      this.skip = 0;
      this.clearList = true;
      this.getPeersList();
    } else {
      this.searchText = ev.target.value;
    }
  }

  getItems() {
    this.skip = 0;
    this.clearList = true;
    this.getPeersList();
  }

  getPeersList() {
    let residenceSearch = this.selectedPeers == 'residents' ? this.userInfo['residence'] : null;
    let searchKeyword = this.searchText.length > 0 ? this.searchText : null;
    this.profileProvider.serachPeers(this.userInfo['_id'], this.skip, this.limit, residenceSearch, searchKeyword)
      .subscribe((res: any) => {
        if (this.clearList) {
          this.peersList = res; this.clearList = false;
        } else {
          this.peersList = this.peersList.concat(res);
        }
        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
          if (res.length == 0){
            this.shouldEnableInfinite = false;
            this.infiniteScroll.enable(false);
          }
          this.infiniteScroll = null;
        }
      }, error => {
        console.info('error', error);
        if (this.infiniteScroll) {
          this.infiniteScroll.complete();
          this.infiniteScroll = null;
        }
      })
  }

  getPeersList1() {
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
      if (this.infiniteScroll) {
        this.infiniteScroll.complete();
        if (res.length == 0)
          this.infiniteScroll.enable(false);
        this.infiniteScroll = null;
      }
    }, error => {
      console.info('error', error);
      if (this.infiniteScroll) {
        this.infiniteScroll.complete();
        this.infiniteScroll = null;
      }
    })
  }

  isUserSelected(peer) {
    return this.selectedUser.filter(sUser => { return sUser._id == peer._id }).length > 0;
    // return this.selectedUser.indexOf(peer) > -1
  }

  viewProfile(peer) {
    if (this.chooseUser) {
      let peerSelect = this.selectedUser.filter(sUser => { return sUser._id == peer._id })[0];
      if (this.selectedUser.indexOf(peerSelect) > -1) {
        let index = this.selectedUser.indexOf(peerSelect);
        this.selectedUser.splice(index, 1);
      } else {
        this.selectedUser.push(peer);
      }
    } else
      this.navCtrl.push('Profile', { userData: peer }, { animate: true, direction: 'forward' });
  }


  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.skip += this.limit;
    this.getPeersList();
  }

  changeSegment(segment) {
    this.skip = 0;
    this.selectedPeers = segment;
    this.shouldEnableInfinite = true;
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
      if (item[conditions[0]]) {
        if (conditions[2] && conditions[2].length > 0) {
          let name = item[conditions[0]] + ' ' + item[conditions[1]];
          if (name.toUpperCase().startsWith(conditions[2].toUpperCase())) {
            return true;
          }
          else return false;
        } else return true;
      } else return false
    });
  };

}
