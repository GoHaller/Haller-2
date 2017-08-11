import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConvoProvider } from "../../shared/providers/convo.provider";
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the ChatBot page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var google: any;

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
  messages: any = [];


  //, private googleMaps: GoogleMaps
  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor(public navCtrl: NavController, private elementRef: ElementRef, public navParams: NavParams,
    private convoProvider: ConvoProvider, private iab: InAppBrowser) {
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
          // this.parseResponse(res);
        }, error => {
          console.log('error', error);
        })
    }
  }

  //actual message
  sendQuestion(followupconfirmation = null) {
    if ((followupconfirmation || this.question) && this.userInfo['_id']) {
      let convoObj: Object = {};
      let messageObj: Object = {
        body: followupconfirmation || this.question,
        createdBy: this.userInfo['_id'],
        createdAt: new Date(),
        recipient: this.botInfo['_id'],
      }

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
      if (this.conversationId)
        this.conversation.messages.push(messageObj);
      this.convoProvider.sendQuestionToBot(this.conversationId, convoObj)
        .subscribe((res: any) => {
          this.question = '';
          this.conversation = res;
          this.conversationId = res['_id'];
          this.parseConversation();
          // this.parseResponse(res);
        }, error => {
          console.log('error', error);
        })
    }
  }

  parseResponse(res) {
    let botConvo = [];
    if (res.result.fulfillment && res.result.fulfillment.messages && res.result.fulfillment.messages.length) {
      // if (res.result.action.indexOf('location') == -1) {
      res.result.fulfillment.messages.forEach(msg => {
        if (!msg.platform) {
          if (msg.type == 0) {
            if (res.result.action.indexOf('location') == -1) {
              botConvo.push({ id: res['id'], body: msg.speech });
            } else {
              botConvo.push({ id: res['id'], location: msg.speech });
            }
          } else if (msg.type == 3) {
            botConvo.push({ id: res['id'], image: msg.imageUrl });
          } else if (msg.type == 2) {
            botConvo.push({ id: res['id'], body: msg.title });
            botConvo.push({ id: res['id'], replies: msg.replies });
          } else if (msg.type == 1) {
            botConvo.push({ id: res['id'], body: msg.title, image: msg.imageUrl });
          } else if (msg.payload) {
            if (msg.payload.link) {
              botConvo.push({ id: res['id'], link: msg.payload.link, linkText: msg.payload.linkText || "Show on map" });
            }
            if (msg.payload.location) {
              botConvo.push({ id: res['id'], location: msg.payload.location, linkText: msg.payload.linkText || "Show on map" });
            }
            if (msg.payload.address) {
              botConvo.push({ id: res['id'], body: msg.payload.address });
              botConvo.push({ id: res['id'], address: msg.payload.address, linkText: msg.payload.linkText || "Show on map" });
            }
          }
        }
      });
    } else if (res.result.fulfillment && res.result.fulfillment.speech) {
      botConvo.push({ id: res['id'], body: res.result.fulfillment.speech, date: new Date() });
    }
    return botConvo;
  }

  openExternalLink(link) {
    this.iab.create(link, '_system');
  }

  locationUpdate(event, location) {
    location = event.location;
  }

  getConversationForRecipient() {
    this.convoProvider.getConversationForRecipient(this.userInfo['_id'], this.botInfo['_id'], true)
      .subscribe((res: any) => {
        if (res[0])
          this.conversation = res[0];
        if (this.conversation) {
          this.conversationId = this.conversation['_id'];
          this.parseConversation();
        }
      }, error => {
        console.info('usres error', error);
      });
  }

  parseConversation() {
    this.conversation.messages.forEach(msg => {
      if (msg.botBody) {
        msg.botBody1 = this.parseResponse(msg.botBody);
      }
    });
  }

  openMap(location) {
    this.navCtrl.push('MapPage', { mapData: location }, { animate: true, direction: 'forward' });
  }

}
