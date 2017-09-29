import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController, Content, AlertController } from 'ionic-angular';
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
  canvas: any;
  loader: any;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, private botconvoProvider: BotconvoProvider,
    storage: Storage, private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.local = storage;
  }

  ionViewDidLoad() {
    this.canvas = document.createElement("canvas");
    this.local.get('userInfo').then((val) => {
      this.userInfo = JSON.parse(val);
      this.getBotData();
    });
  }

  getBotData() {
    this.loader = this.loadingCtrl.create({ content: "Please wait...", dismissOnPageChange: true });
    this.loader.present();
    this.botconvoProvider.getBotData()
      .subscribe((res: any) => {
        this.loader.dismiss();
        if (res._id) {
          this.chatBot = res;
          if (this.chatBot['_id']) this.getUsersConversation();
        }
      },
      error => { this.loader.dismiss(); this.botconvoProvider.http.showError(error); },
      () => { })
  }

  getUsersConversation() {
    this.loader = this.loadingCtrl.create({ content: "Please wait...", dismissOnPageChange: true });
    this.loader.present();
    this.botconvoProvider.getConversation(this.userInfo['_id'])
      .subscribe((res: any) => {
        this.loader.dismiss();
        this.conversation = res;
        if (this.conversation) this.parseConversation();
      },
      error => { this.loader.dismiss(); this.botconvoProvider.http.showError(error); },
      () => { });
  }

  gotoSetting() {
    this.navCtrl.push('Settings', {}, { animate: true, direction: 'forward' });
  }

  newMessageChange(event) {
    let ele = event.target;
    let row = ele.rows;
    if (ele.value.length < 50) {
      row = 1;
    } else if (ele.value.length < 100) {
      row = 2;
    } else if (ele.clientHeight < ele.scrollHeight && row < 6) {
      row += 1;
    }
    ele.rows = row;
    // let row = (Math.floor(this.getTextWidth(ele.value) / ele.clientWidth) + 1)
    // ele.rows = row > 4 ? 4 : row;
  }

  getTextWidth(text) {
    var font = "normal 15.5px SofiaPro";
    // re-use canvas object for better performance
    var context = this.canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return parseInt(metrics.width.toString());
  }

  sendQuestion() {
    if (this.chatBot['_id']) {
      this.loader = this.loadingCtrl.create({ content: "Please wait...", dismissOnPageChange: true });
      this.loader.present();
      // req.body = { message: '', createdBy: '', conversationId: '', participant: '',//is always bot accessToken: '' }
      let postObj = {
        message: this.question.toString(), createdBy: this.userInfo['_id'], participant: this.chatBot['_id'],
        accessToken: this.chatBot['botData']['accessToken']
      }
      this.question = '';
      if (this.conversation['_id']) { postObj['conversationId'] = this.conversation['_id']; }

      this.botconvoProvider.askToBot(this.userInfo['_id'], postObj)
        .subscribe((res: any) => { this.loader.dismiss(); this.conversation = res; this.parseConversation(); },
        error => { this.loader.dismiss(); this.botconvoProvider.http.showError(error); },
        () => { })
    } else {
      this.botNotAvailable();
    }
  }

  botNotAvailable() {
    let prompt = this.alertCtrl.create({
      title: 'Sorry! Bot is not available right now.',
      buttons: [{ text: 'Ok', handler: data => { } }]
    });
    prompt.present();
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
