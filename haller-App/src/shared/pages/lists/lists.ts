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
  public showOrg = [];
  limit = 50;
  skip = 0;
  isSearchGoingOn: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private profileProvider: ProfileProvider) {
    this.selectedList = navParams.get('orgList');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad Lists');
    this.profileProvider.getAllOrg().subscribe((res: any) => {
      // console.info('res', res);
      this.orgList = res;
      this.showOrg = this.orgList.slice(this.skip, this.limit);
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

  doInfinite(infiniteScroll) {
    if (this.showOrg.length < this.orgList.length && !this.isSearchGoingOn) {
      setTimeout(() => {
        this.skip = this.showOrg.length;// + this.limit;
        let end = (this.skip + this.limit) < this.orgList.length ? (this.showOrg.length + this.limit) : this.orgList.length;
        for (let i = this.skip; i < end; i++) { this.showOrg.push(this.orgList[i]); }
        infiniteScroll.complete();
      }, 200);
    } else {
      infiniteScroll.complete();
    }
  }

  onSearchChange(event) {
    if (event.target.value) {
      this.isSearchGoingOn = true;
      this.showOrg = this.orgList.filter(org => {
        return org.name.toLowerCase().startsWith(event.target.value.toLowerCase())
      })
    } else {
      this.isSearchGoingOn = false;
      this.showOrg = this.orgList.slice(this.skip, this.limit);
    }
  }

}
