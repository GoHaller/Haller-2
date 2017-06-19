import { Component, PipeTransform, Pipe } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MessagesProvider } from './messages.provider'
/**
 * Generated class for the Messages page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class Messages {

  private local: Storage;
  public userInfo: Object = {};
  public messageList = [];
  private refresher = null;
  private searchText: String = '';
  private numbers;

  constructor(public navCtrl: NavController, public navParams: NavParams, public messagesProvider: MessagesProvider,
    public actionSheetCtrl: ActionSheetController) {
    this.local = new Storage('localstorage');
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.getMessageList();
    });
    this.numbers = new Array(5).fill(5).map((x, i) => i + 1);//Array(5).fill().map((x,i)=>i); // [0,1,2,3,4]
  }
  ionViewWillEnter() {
    if (this.userInfo['_id']) {
      this.getMessageList();
    }
  }

  getMessageList() {
    this.messagesProvider.getMessageList(this.userInfo['_id'], '').subscribe((res: any) => {
      this.messageList = res;
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }
    }, error => {
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }
      console.info('error', error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Messages');
  }

  composeNewMessage() {
    this.navCtrl.push('Message', {}, { animate: true, direction: 'forward' });
  }

  showConversation(msg) {
    new Promise((resolve, reject) => {
      this.navCtrl.push('Message', { conversationId: msg._id, resolve: resolve }, { animate: true, direction: 'forward' });
    }).then(data => {
      let convo = this.messageList.filter(convo => {
        return convo['_id'] == data['_id'];
      })[0];
      convo.messages = data['messages'];
    });

  }

  getMessageDateFormate(date) {
    return this.messagesProvider.httpClient.getDateFormate(date);
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.getMessageList();
  }

  serachConvo(event) {
    this.searchText = event.target.value;
  }

  checkMsgIfReadByOther(msg) {
    return msg && msg.createdBy._id !== this.userInfo['_id'] && !msg.read ? true : false;
  }

  presentEditActionSheet(convo) {
    let options = [];
    options.push({ text: 'Delete', handler: () => { this.deleteConvo(convo); } });
    options.push({ text: 'Cancel', handler: () => { } });

    let actionSheet = this.actionSheetCtrl.create({ title: '', buttons: options });
    actionSheet.present();
  }

  deleteConvo(convo) {
    this.messagesProvider.deleteConvo(convo['_id'], this.userInfo['_id'])
      .subscribe((res: any) => {
        let index = this.messageList.indexOf(convo);
        this.messageList.splice(index, 1);
      }, error => {
        console.info('deleteConvo error', error);
      });
  }

  getGroupChatName(convo) {
    if (convo.groupName)
      return convo.groupName
    else {
      let groupName = [];
      convo.participants.forEach(parti => {
        if (parti._id !== this.userInfo['_id'] && groupName.length < 2) {
          groupName.push(parti.firstName + ' ' + parti.lastName);
        }
      });
      return groupName.join(', ');
    }
  }
}


@Pipe({
  name: "convosearch",
  pure: false
})
export class ConvoFilterPipe implements PipeTransform {
  transform(items: any, conditions: string[]): any {
    return items.filter(item => {
      if (conditions[2] && conditions[2].length > 0) {
        let participant = item.participants.filter(part => {
          let name = part[conditions[0]] + ' ' + part[conditions[1]];
          if (name.toUpperCase().startsWith(conditions[2].toUpperCase())) {
            return true;
          }
          else return false;
        });
        if (participant.length > 0) return true;
        else false;
      } else return true;
    });
  };

}