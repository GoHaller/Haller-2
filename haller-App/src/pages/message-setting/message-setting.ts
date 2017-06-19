import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, AlertController } from 'ionic-angular';
import { MessagesProvider } from "../messages/messages.provider";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the MessageSetting page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-message-setting',
  templateUrl: 'message-setting.html',
})
export class MessageSetting {

  private local: Storage;
  public userInfo: Object = {};
  private participants: Array<Object> = [];
  private reciver: Object = {};
  private conversation: Object = {};
  private blockBtnText: string = 'Block'

  constructor(public navCtrl: NavController, public navParams: NavParams, private messageProvider: MessagesProvider,
    public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController) {
    this.local = new Storage('localstorage');
    this.conversation = this.navParams.data['conversation'] || {};
    this.participants = this.conversation['participants'] || [];
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.setBlockBtnText();
    });
  }

  setBlockBtnText() {
    if (this.participants.length == 2) {
      this.reciver = this.participants[0]['_id'] == this.userInfo['_id'] ? this.participants[1] : this.participants[0];
      let participantId = this.participants[0]['_id'] == this.userInfo['_id'] ? this.participants[1]['_id'] : this.participants[0]['_id'];
      this.blockBtnText = 'Block';
      if (this.userInfo['blocked']) {
        this.userInfo['blocked'].forEach(blocked => {
          if (participantId == blocked.user) {
            this.blockBtnText = 'Un block';
          }
        });
      }
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MessageSetting');
  }

  blockUser() {
    if (this.participants.length == 2) {
      let blockUserId = this.participants[0]['_id'] == this.userInfo['_id'] ? this.participants[1]['_id'] : this.participants[0]['_id'];
      this.messageProvider.blockUser(this.userInfo['_id'], blockUserId)
        .subscribe((res: any) => {
          if (res['_id'] == this.userInfo['_id']) {
            this.userInfo = res;
            this.local.set('userInfo', JSON.stringify(res)).then(() => { });
            this.setBlockBtnText();
          }
        }, error => {
          let toast = this.toastCtrl.create({
            message: 'Please try later',
            duration: 5000,
            position: 'top'
          });
          toast.present();
          console.info('sendProblem error', error);
        });
    }
  }

  goToProfile() {
    this.navCtrl.push('Profile', { userData: this.reciver, allowMessage: false }, { animate: true, direction: 'forward' });
  }

  presentLeaveConvoActionSheet() {
    let options = [];
    options.push({ text: 'Leave', handler: () => { this.leaveConversation(); } });
    options.push({ text: 'Cancel', handler: () => { } });

    let actionSheet = this.actionSheetCtrl.create({ title: '', buttons: options });
    actionSheet.present();
  }

  leaveConversation() {
    this.messageProvider.leaveConvo(this.conversation['_id'], this.userInfo['_id'])
      .subscribe((res: any) => {
        this.navCtrl.pop();
      }, error => {
        let toast = this.toastCtrl.create({
          message: 'Please try later',
          duration: 5000,
          position: 'top'
        });
        toast.present();
        console.info('leaveConvo error', error);
      })
  }

  doPrompt() {
    let prompt = this.alertCtrl.create({
      inputs: [
        {
          name: 'groupName',
          placeholder: 'Group Name',
          value: this.conversation['groupName']
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked', data);
            this.messageProvider.putMessage(this.conversation['_id'], data, this.userInfo['_id'])
              .subscribe((res: any) => {
                this.conversation = res;
              }, error => {
                console.info('putMessage error', error);
              });
          }
        }
      ]
    });
    prompt.present();
  }

}

