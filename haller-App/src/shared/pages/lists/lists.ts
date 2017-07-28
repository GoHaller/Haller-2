import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProfileProvider } from "../../providers/profile.provider";

@IonicPage()
@Component({
  selector: 'page-lists',
  templateUrl: 'lists.html',
})
export class Lists {

  private selectedList = [];
  private orgList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private profileProvider: ProfileProvider) {
    this.selectedList = navParams.get('orgList');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad Lists');
    this.profileProvider.getAllOrg().subscribe((res: any) => {
      // console.info('res', res);
      this.orgList = res;
    })
  }

  close() {
    this.viewCtrl.dismiss(this.selectedList);
  }
  selectOrg(org) {
    if (this.isOrgSelected(org)) {
      this.selectedList.splice(this.selectedList.findIndex(i => i._id === org._id), 1);
    } else
      this.selectedList.push(org);
  }

  isOrgSelected(org) {
    return this.selectedList.findIndex(i => i._id === org._id) > -1;
  }

}
