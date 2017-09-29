import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BotconvoProvider } from "../../providers/botconvo-provider";
// $IMPORTSTATEMENT

@IonicPage()
@Component({
  selector: 'page-chatbot',
  templateUrl: 'chatbot.html',
})
export class Chatbot {
  private chatBot: any;
  local: Storage;
  public userInfo: any = { _id: '' };
  public conversation: any = {};
  question: string = '';

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, private botconvoProvider: BotconvoProvider,
    storage: Storage, private loadingCtrl: LoadingController) {
    this.local = storage;
  }

  ionViewDidLoad() {
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.getBotData();
    });
  }

  getBotData() {
    this.botconvoProvider.getBotData()
      .subscribe((res: any) => {
        if (res._id) {
          this.chatBot = res;
          this.getUsersConversation();
        }
      }, error => {
        this.botconvoProvider.http.showError(error);
      })
  }

  getUsersConversation() {
    this.botconvoProvider.getConversation(this.userInfo['_id'])
      .subscribe((res: any) => { this.conversation = res; this.parseConversation(); },
      error => { this.botconvoProvider.http.showError(error); });
  }

  gotoSetting() {
    this.navCtrl.push('Settings', {}, { animate: true, direction: 'forward' });
  }

  newMessageChange(event) {
    let ele = event.target;
    let row = ele.rows;
    if (ele.value.length < 100) {
      row = 1;
    } else if (ele.clientHeight < ele.scrollHeight && row < 6) {
      row += 1;
    }
    ele.rows = row;
  }

  sendQuestion() {
    let loader = this.loadingCtrl.create({ content: "Please wait...", dismissOnPageChange: true });
    loader.present();
    // req.body = { message: '', createdBy: '', conversationId: '', participant: '',//is always bot accessToken: '' }
    let postObj = {
      message: this.question.toString(), createdBy: this.userInfo['_id'], participant: this.chatBot['_id'],
      accessToken: this.chatBot['botData']['accessToken']
    }
    this.question = '';
    if (this.conversation['_id']) { postObj['conversationId'] = this.conversation['_id']; }

    this.botconvoProvider.askToBot(this.userInfo['_id'], postObj)
      .subscribe((res: any) => { this.conversation = res; this.parseConversation(); },
      error => { this.botconvoProvider.http.showError(error); },
      () => { loader.dismiss(); })
  }

  openExternalLink(link) {
    if (link.indexOf('http') > 5 || link.indexOf('http') == -1) { link = 'http://' + link; }
    window.open(encodeURI(link), '_system');
  }
  openMap(location) {
    this.navCtrl.push('MapPage', { mapData: location }, { animate: true, direction: 'forward' });
  }

  parseResponse(res) {
    let botConvo = [];
    if (res.result.fulfillment && res.result.fulfillment.messages && res.result.fulfillment.messages.length) {
      // if (res.result.action.indexOf('location') == -1) {
      res.result.fulfillment.messages.forEach(msg => {
        if (!msg.platform) {
          if (msg.type == 0) {
            if (res.result.action.indexOf('location') == -1) {
              // botConvo.push({ id: res['id'], body: msg.speech });
              this.extractLink(msg.speech, botConvo, res['id']);
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
              botConvo.push({ id: res['id'], link: msg.payload.link, linkText: msg.payload.linkText || msg.payload.link });
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
      // botConvo.push({ id: res['id'], body: res.result.fulfillment.speech });
      this.extractLink(res.result.fulfillment.speech, botConvo, res['id']);
    }
    return botConvo;
  }

  extractLink(body, botConvo, id) {
    let exp = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
    let links = exp.exec(body);
    do {
      links = exp.exec(body);
      try {
        if (links && links[0]) {
          let urls = links[0].split(' ');
          urls.forEach(url => {
            if (url && url.trim() && exp.test(url.trim())) {
              let bs = body.split(url);
              botConvo.push({ id: id, body: bs[0] });
              body = bs[1].trim();
              botConvo.push({ id: id, link: url, linkText: url });
            }
          });
        } else {
          botConvo.push({ id: id, body: body });
        }
      } catch (e) {
        console.log('e', e);
        // No content response..
        links = null;
      }
    } while (links);
  }

  parseConversation() {
    this.conversation.messages.forEach(msg => {
      if (msg.botBody) { msg.botBody1 = this.parseResponse(msg.botBody); }
      if (this.conversation.messages.indexOf(msg) == (this.conversation.messages.length - 1)) {
        setTimeout(() => { if (this.content._scroll) this.content.scrollToBottom(0); }, 500);
      }
    });
  }

  getMessageDateFormate(date) { return this.botconvoProvider.http.getDateFormate(date); }

}
