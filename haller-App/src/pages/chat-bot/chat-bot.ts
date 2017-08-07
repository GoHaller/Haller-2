import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConvoProvider } from "../../shared/providers/convo.provider";
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ChatBot page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chat-bot',
  templateUrl: 'chat-bot.html',
})
export class ChatBot {

  private local: Storage;
  question: string = '';
  conversation: any = [];
  public userInfo: Object = {};
  public botInfo: Object = {};
  public conversationId: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private convoProvider: ConvoProvider) {
    this.local = new Storage('localstorage');
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      // console.log('this.userInfo', this.userInfo);
      this.getBotUser();
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ChatBot');
  }

  getBotUser() {
    this.convoProvider.getBotUser(this.userInfo['email'])
      .subscribe((res: any) => {
        if (res)
          this.botInfo = res;
        // console.log('this.botInfo', this.botInfo);
        this.getConversationForRecipient();
      }, error => {
        console.log('this.botInfo error', error);
      })
  }

  newMessageChange(event) {
    let ele = event.target;
    let row = ele.rows;
    if (ele.clientHeight < ele.scrollHeight && row < 6) {
      row += 1;
    }
    ele.rows = row;
  }

  //demo purpose
  askQuestion(followupconfirmation = null) {
    if ((followupconfirmation || this.question) && this.userInfo['_id']) {
      this.conversation.push({ id: this.userInfo['_id'], body: followupconfirmation || this.question });
      this.convoProvider.askQuestionToBot(followupconfirmation || this.question)
        .subscribe((res: any) => {
          this.question = '';
          // console.log('res', res);
          this.parseResponse(res);
        }, error => {
          console.log('error', error);
        })
    }
  }

  //actual message
  sendQuestion(followupconfirmation = null) {
    console.log('followupconfirmation', followupconfirmation);
    if ((followupconfirmation || this.question) && this.userInfo['_id']) {
      let convoObj: Object = {};
      let messageObj: Object = {
        body: followupconfirmation || this.question,
        createdBy: this.userInfo['_id'],
        createdAt: new Date(),
        recipient: this.botInfo['_id'],
      }
      // this.conversation.push({ id: this.userInfo['_id'], body: followupconfirmation || this.question });
      // this.convoProvider.askQuestionToBot(followupconfirmation || this.question)
      convoObj['accessToken'] = this.botInfo['botData'].accessToken;
      if (!this.conversationId) {
        convoObj['messages'] = [messageObj];
        convoObj['participants'] = [];
        convoObj['participants'].push(this.userInfo);
        convoObj['participants'].push(this.botInfo);
        convoObj['createdBy'] = this.userInfo['_id'];
      } else {
        convoObj['message'] = messageObj;
      }
      this.conversation.messages.push(messageObj);
      this.convoProvider.sendQuestionToBot(this.conversationId, convoObj)
        .subscribe((res: any) => {
          this.question = '';
          this.conversation = res;
          this.conversationId = res['_id'];
          // this.parseResponse(res);
        }, error => {
          console.log('error', error);
        })
    }
  }

  parseResponse(res) {
    let botConvo = [];
    if (res.result.fulfillment && res.result.fulfillment.messages && res.result.fulfillment.messages.length) {
      res.result.fulfillment.messages.forEach(msg => {
        if (!msg.platform) {
          if (msg.type == 0) {
            botConvo.push({ id: res['id'], body: msg.speech });
          } else if (msg.type == 3) {
            botConvo.push({ id: res['id'], image: msg.imageUrl });
          } else if (msg.type == 2) {
            botConvo.push({ id: res['id'], body: msg.title });
            botConvo.push({ id: res['id'], replies: msg.replies });
          } else if (msg.type == 1) {
            botConvo.push({ id: res['id'], body: msg.title, image: msg.imageUrl });
          }
        }
      });
    } else if (res.result.fulfillment && res.result.fulfillment.speech) {
      botConvo.push({ id: res['id'], body: res.result.fulfillment.speech });
    }
    return botConvo;
  }


  getConversationForRecipient() {
    this.convoProvider.getConversationForRecipient(this.userInfo['_id'], this.botInfo['_id'], true)
      .subscribe((res: any) => {
        if (res[0])
          this.conversation = res[0];
        if (this.conversation)
          this.conversationId = this.conversation['_id'];
      }, error => {
        console.info('usres error', error);
      });
  }
}
