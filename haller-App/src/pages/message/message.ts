import { Pipe, PipeTransform, Component, ViewChild } from '@angular/core';
import { Events, Content, ModalController, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MessagesProvider } from '../messages/messages.provider';
import { ImageFullComponent } from '../../shared/pages/image.full';
import { CloudinaryProvider } from '../../shared/providers/cloudinary-provider';

/**
 * Generated class for the Message page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class Message {

  @ViewChild(Content) content: Content;
  private local: Storage;
  public userInfo: Object = {};
  conversation: Object = {};
  recipients = [];
  conversationId: String;
  isNewConvo: Boolean = false;
  // recipientId: String;
  userList = [];
  searchText: String = '';
  //data to send new message
  msgContent: String;
  private localImage: String = null;
  private cloudinaryImageData: Object = null;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams,
    public messageProvider: MessagesProvider, public cloudinaryProvider: CloudinaryProvider, private event: Events,
    public loadingCtrl: LoadingController) {
    this.conversationId = this.navParams.data.conversationId;
    this.recipients = this.navParams.data.recipients ? [this.navParams.data.recipients] : [];

    this.local = new Storage('localstorage');
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      if (this.conversationId) {
        this.isNewConvo = false;
        this.getConversation();
      } else if (this.recipients.length) {
        this.getConversationForRecipient();
      } else {
        this.isNewConvo = true;
        this.getUsers();
      }
    });
  }

  goBack() {
    let resolver = this.navParams.get('resolve');
    if (resolver) resolver(this.conversation);
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 1000);
    this.event.subscribe('image-loaded', () => {
      this.localImage = this.cloudinaryProvider.imageLocalPath;
    });
  }

  ionViewWillEnter() {
    if (this.conversationId && this.userInfo['_id']) {
      this.isNewConvo = false;
      this.getConversation();
    }
  }

  removeImage() {
    this.localImage = null;
    this.cloudinaryProvider.imageLocalPath = null;
    this.cloudinaryImageData = null;
  }

  //Recipient Section Start
  findParticipants(event) {
    this.searchText = event.target.value;
  }
  selectRecipient(user) {
    if (this.recipients.indexOf(user) == -1) {
      this.recipients.push(user);
      this.onRecipientsChange();
    }
  }
  removeRecipient(user) {
    let index = this.recipients.indexOf(user);
    this.recipients.splice(index, 1);
    this.onRecipientsChange();
  }
  onRecipientsChange() {
    if (this.recipients.length == 1) { this.getConversationForRecipient(); }
    else {
      this.conversation = {};
      this.conversationId = '';
    }
  }
  getConversationForRecipient() {
    this.messageProvider.getConversationForRecipient(this.userInfo['_id'], this.recipients[0]['_id']).subscribe((res: any) => {
      // res[0].messages = this.setMessagesIfUserDeleted(res[0]);
      this.conversation = res[0];
      if (this.conversation)
        this.conversationId = this.conversation['_id'];
      this.markMessageAsRead();
    }, error => {
      console.info('usres error', error);
    });
  }
  //Recipient Section end

  getUsers() {
    this.messageProvider.getUsers(this.userInfo['_id'], 0, 50).subscribe((res: any) => {
      this.userList = res;
    }, error => {
      console.info('usres error', error);
    });
  }
  getConversation() {
    this.messageProvider.getConversation(this.conversationId, this.userInfo['_id']).subscribe((res: any) => {
      // console.info('conversation', res);
      // res.messages = this.setMessagesIfUserDeleted(res);
      this.conversation = res;
      this.recipients = this.conversation['participants'].filter(part => {
        return part._id !== this.userInfo['_id'];
      });
      this.content.scrollToBottom(300);
      this.markMessageAsRead();
    }, error => {
      console.info('usres error', error);
    });
  }

  setMessagesIfUserDeleted(convo) {
    let returnMsgs = [];
    let deletedFor = convo.deletedFor.filter(item => {
      return item.user == this.userInfo['_id'];
    });
    if (deletedFor.length) {
      let deletedUser = deletedFor[deletedFor.length - 1];
      convo.messages.forEach(msg => {
        if (new Date(msg.createdAt).getTime() > new Date(deletedUser.at).getTime()) {
          returnMsgs.push(msg);
        }
      });
      return returnMsgs;
    } else {
      return convo.messages;
    }
  }

  viewFullImage(image) {
    if (image) {
      let modal = this.modalCtrl.create(ImageFullComponent, { imgeSrc: image.secure_url });
      modal.present();
    }
  }

  sendMessage() {
    if (this.localImage) {
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
          this.addMessage();
          loader.dismiss();
        }, error => {
          console.info('cloudinary error', error);
          loader.dismiss();
        })
    }
    else {
      this.addMessage();
    }
  }
  addMessage() {
    if (this.msgContent && this.recipients.length > 0) {
      let messagesObj: Object = {
        body: this.msgContent,
        createdBy: this.userInfo['_id'],
        createdAt: new Date(),
        recipient: this.recipients[0]['_id'],
      }
      if (this.cloudinaryImageData) messagesObj['image'] = this.cloudinaryImageData;
      if (this.cloudinaryProvider.gif['id']) {
        messagesObj['giphy'] = this.cloudinaryProvider.gif;
      }
      if (this.conversationId) {
        this.messageProvider.putMessage(this.conversationId, { message: messagesObj }, this.userInfo['_id'])
          .subscribe((res: any) => {
            this.isNewConvo = false;
            this.conversation = res;
            this.msgContent = '';
            this.localImage = '';
            this.cloudinaryImageData = null;
          }, error => {
            console.info('putMessage error', error);
          });
      } else {
        let participants = [this.userInfo['_id']];
        this.recipients.forEach(recipient => {
          participants.push(recipient['_id']);
        });
        this.messageProvider.createConversation({
          createdBy: this.userInfo['_id'],
          participants: participants,
          messages: [messagesObj]
        }).subscribe((res: any) => {
          this.isNewConvo = false;
          this.conversation = res;
          this.msgContent = '';
          this.localImage = '';
          this.cloudinaryImageData = null;
        }, error => {
          console.info('createConversation error', error);
        });
      }
    }
  }

  newMessageChange(event) {
    let ele = event.target;
    if (ele.clientHeight < ele.scrollHeight) ele.rows = 2;
    else if (ele.value.length == 0) ele.rows = 1;
  }

  takePicture() {
    this.cloudinaryProvider.presentActionSheet();
  }

  gotoMessageSettings() {
    this.navCtrl.push('MessageSetting', { conversation: this.conversation }, { animate: true, direction: 'forward' });
  }

  getMessageDateFormate(date) {
    return this.messageProvider.httpClient.getDateFormate(date);
  }

  markMessageAsRead() {
    if (this.conversation && this.conversation['messages']) {
      let intervalId = setInterval(() => {
        let msg = this.conversation['messages'].filter(msg => {
          return (!msg.read && msg.recipient['_id'] == this.userInfo['_id'])
        })[0];
        if (msg) {
          this.messageProvider.updateMessage(this.conversationId, msg['_id'], { message: { read: true }, userId: this.userInfo['_id'] })
            .subscribe((res: any) => {
              this.conversation = res;
            }, error => {
              console.info('updateMessage error', error);
            });
        }
        else { clearTimeout(intervalId); }
      }, 2000);
    }
  }

  showGiphyGif() {
    let gifModal = this.modalCtrl.create('GiphyModel');
    gifModal.onDidDismiss(gif => {
      if (gif) {
        // this.cloudinaryProvider.imageLocalPath = gif.images.fixed_height_downsampled.url;
        this.cloudinaryProvider.gif['id'] = gif.id;
        this.cloudinaryProvider.gif['still'] = gif.images.fixed_height_still;
        this.cloudinaryProvider.gif['gif'] = gif.images.fixed_height_downsampled;
      }
    });
    gifModal.present();
  }

  checkIfUserHasLeft() {
    if (this.conversation && this.conversation['leftUser']) {
      let user = this.conversation['leftUser'].filter(user => {
        return user.user == this.userInfo['_id'];
      })
      return user.length > 0;
    } else {
      return false;
    }
  }

  getGroupChatName() {
    if (this.conversation['groupName'])
      return this.conversation['groupName']
    else {
      let groupName = [];
      this.conversation['participants'].forEach(parti => {
        if (parti._id !== this.userInfo['_id'] && groupName.length < 2) {
          groupName.push(parti.firstName + ' ' + parti.lastName);
        }
      });
      return groupName.join(', ');
    }
  }
}

@Pipe({
  name: "participantsearch",
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
      } else return false;
    });
  };

}