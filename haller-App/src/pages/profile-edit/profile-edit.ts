import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Validators, FormBuilder } from '@angular/forms';
import { ProfileProvider } from "../../shared/providers/profile.provider";
import { ImageFullComponent } from '../../shared/pages/image.full';
import { CloudinaryProvider } from '../../shared/providers/cloudinary.provider';

/**
 * Generated class for the ProfileEdit page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEdit {

  private local: Storage;
  public userInfo: Object = {};
  public orgList = [];
  public interestList = [];
  public userForm: any;
  public cloudinaryImageData: Object = null;
  public userInterest: string = '';
  public showOrgForm: Boolean = false;
  public showInterestForm: Boolean = false;
  public orgSearchText: String = '';
  public userAvatar = '';

  constructor(private navCtrl: NavController, private navParams: NavParams, public profileProvider: ProfileProvider,
    private formBuilder: FormBuilder, private modalCtrl: ModalController, private cloudinaryProvider: CloudinaryProvider,
    public loadingCtrl: LoadingController, private event: Events) {
    this.local = new Storage('localstorage');
    this.userAvatar = profileProvider.httpClient.userAvatar;
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(50), Validators.required])],
      pronouns: ['', Validators.compose([Validators.maxLength(30)])],
      major: ['', Validators.compose([Validators.maxLength(30)])],
      hometown: ['', Validators.compose([Validators.maxLength(30)])]
    });

    this.local.get('userInfo').then(val => {
      this.userInfo = JSON.parse(val);
      this.userInfo['pronouns'] = this.userInfo['genderPronouns'].join(', ');
      this.userForm = this.formBuilder.group({
        firstName: [this.userInfo['firstName'] || '', Validators.compose([Validators.maxLength(50), Validators.required])],
        lastName: [this.userInfo['lastName'] || '', Validators.compose([Validators.maxLength(50), Validators.required])],
        pronouns: [this.userInfo['genderPronouns'].join(', ') || '', Validators.compose([Validators.maxLength(30)])],
        major: [this.userInfo['major'] || '', Validators.compose([Validators.maxLength(30)])],
        hometown: [this.userInfo['hometown'] || '', Validators.compose([Validators.maxLength(30)])]
      });
    })
  }

  ionViewDidLoad() { }

  goBack() {
    let resolve = this.navParams.get('resolve');
    if (resolve) resolve(this.userInfo);
    this.navCtrl.pop();
  }

  viewFullImage(currentProfile) {
    if (currentProfile) {
      let modal = this.modalCtrl.create(ImageFullComponent, { imgeSrc: currentProfile });
      modal.present();
    }
  }

  public choosePicture() {
    let actionSheet = this.cloudinaryProvider.actionSheetCtrl.create({
      // title: 'Select Image Source',
      buttons: [
        { text: 'Load from Library', handler: () => { this.cloudinaryProvider.takePictureFromLibrary().then(data => { this.saveProfileImageToCloudinary(data); }) } },
        { text: 'Use Camera', handler: () => { this.cloudinaryProvider.takePictureFromCamera().then(data => { this.saveProfileImageToCloudinary(data); }) } }
      ]
    });
    actionSheet.present();
  }

  saveProfileImageToCloudinary(data) {
    this.cloudinaryProvider.imageLocalPath = data;
    if (this.cloudinaryProvider.imageLocalPath) {
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true
      });
      loader.present();
      this.cloudinaryProvider.uploadPicture('profile-covers')
        .then((data: any) => {
          let cloud_response = JSON.parse(data.response);
          cloud_response.createdBy = this.userInfo['_id'];
          cloud_response.version = cloud_response.version.toString();
          this.cloudinaryImageData = cloud_response;
          this.saveProfileImage(loader);
        }, error => {
          console.info('cloudinary error', error);
          loader.dismiss();
        })
    }
  }

  saveProfileImage(loader) {
    this.profileProvider.updateUser(this.userInfo['_id'], { currentProfile: this.cloudinaryImageData })
      .subscribe((res: any) => {
        // console.info('updateUser res', res);
        this.userInfo = res;
        this.local.set('userInfo', JSON.stringify(res)).then(() => {
          loader.dismiss();
          this.event.publish('user-updated');
        });
      }, error => {
        loader.dismiss();
        console.info('updateUser error', error);
      });
  }

  searchInterest(event) {
    let val = event.target.value;
    // console.info('Interest', val);
    this.interestList = [];
    if (val.length > 0) {
      this.profileProvider.getInterestList(val)
        .subscribe((res: any) => {
          res.forEach(interest => {
            let interestFiltered = this.userInfo['interests'].filter(item => {
              return item.name.toLowerCase() == interest.name.toLowerCase();
            })
            if (interestFiltered.length == 0 && this.interestList.length < 5) {
              this.interestList.push(interest);
            }
          });
        }, error => {
          console.info('searchOrg error', error);
        });
    }
  }

  addInterestToUserList(interest) {
    let orgFiltered = this.userInfo['interests'].filter(item => {
      return item.name == interest.name;
    })
    if (orgFiltered.length == 0)
      this.userInfo['interests'].push({ name: interest.name });

    this.showInterestForm = false;
    this.interestList = [];
    let index = this.interestList.indexOf(interest);
    this.interestList.splice(index, 1);
    this.userInterest = '';
  }

  addInterestToUserListManual() {
    if (this.userInterest.length > 0) {
      let orgFiltered = this.userInfo['interests'].filter(item => {
        return item.name == this.userInterest;
      })
      this.showInterestForm = false;
      this.interestList = [];
      if (orgFiltered.length == 0)
        this.userInfo['interests'].push({ name: this.userInterest });
      this.userInterest = '';
    }
  }

  removeInterestFromUserList(interest) {
    let index = this.userInfo['interests'].indexOf(interest);
    this.userInfo['interests'].splice(index, 1);
  }

  searchOrg(event) {
    let val = event.target.value;
    this.orgList = [];
    if (val.length > 0) {
      this.profileProvider.searchOrg(val)
        .subscribe((res: any) => {
          res.forEach(org => {
            let orgFiltered = this.userInfo['organizations'].filter(item => {
              return item._id == org._id;
            })
            if (orgFiltered.length == 0 && this.orgList.length < 5) {
              this.orgList.push(org);
            }
          });
          // console.info('this.orgList', this.orgList);
        }, error => {
          console.info('searchOrg error', error);
        });
    }
  }

  addOrgToUserList(org) {
    let orgFiltered = this.userInfo['organizations'].filter(item => {
      return item._id == org._id;
    })
    if (orgFiltered.length == 0)
      this.userInfo['organizations'].push(org);
    this.showOrgForm = false;
    this.orgSearchText = '';
    this.orgList = [];
    let index = this.orgList.indexOf(org);
    this.orgList.splice(index, 1);
  }

  removeOrgFromUserList(org) {
    let orgFiltered = this.userInfo['organizations'].filter(item => {
      return item._id == org._id;
    })
    let index = this.userInfo['organizations'].indexOf(orgFiltered[0]);
    this.userInfo['organizations'].splice(index, 1);
  }

  saveProfile(data) {
    let selectOrg = [];
    let selInterest = []
    this.userInfo['organizations'].forEach(org => {
      selectOrg.push(org._id);
    });
    this.userInfo['interests'].forEach(interest => {
      selInterest.push(interest);
    });
    let user = {
      firstName: data['firstName'],
      lastName: data['lastName'],
      genderPronouns: data['pronouns'] ? data['pronouns'].split(', ') : [],
      graduationYear: data['graduationYear'],
      major: data['major'] || '',
      residence: this.userInfo['residence'],
      bio: this.userInfo['bio'],
      hometown: data['hometown'] || '',
      organizations: selectOrg,
      interests: selInterest
    }
    // if (data['pronouns']) user['genderPronouns'] = data['pronouns'].split(', ');
    // if (data['major']) user['major'] = data['major'];
    // if (data['hometown']) user['hometown'] = data['hometown'];

    this.profileProvider.updateUser(this.userInfo['_id'], user)
      .subscribe((res: any) => {
        // console.info('updateUser res', res);
        this.userInfo = res;
        this.userInfo['pronouns'] = this.userInfo['genderPronouns'].join(', ');
        this.local.set('userInfo', JSON.stringify(res)).then(() => {
          this.event.publish('user-updated');
          this.goBack();
        });
      }, error => {
        console.info('updateUser error', error);
      });
  }

  popupOrganizerList() {
    let modal = this.modalCtrl.create('Lists', { orgList: this.userInfo['organizations'] });
    modal.onDidDismiss(data => {
      this.userInfo['organizations'] = data;
      this.saveProfile(this.userForm.value);
      // console.info('data', data);
    });
    modal.present();
  }

}
