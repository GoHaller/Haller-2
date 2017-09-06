import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

declare var swal: any;
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'bot-cmp',
    templateUrl: 'bot.component.html',
    styleUrls: ['./bot.component.css']
})

export class BotComponent implements OnInit {
    userList: any = [];
    selectedUser: any = {};
    botInfo: any = {};
    userInfo: any = {};
    conversation: any = {};
    conversationId: string = '';
    constructor(public userService: UserService) {
        this.userInfo = localStorage.getItem('userInfo');
        this.userInfo = JSON.parse(this.userInfo);
    }
    ngOnInit() {
        this.getAllUserWithFilter(); this.getBotUser();
        // $('.user-section').perfectScrollbar();
        // $('.convo-section').perfectScrollbar();
    }

    getAllUserWithFilter() {
        this.userService.getUsersListWithFilter(0, 50)
            .subscribe((res) => {
                console.log('res', res);
                this.userList = res.data;
            }, error => {
                console.log('error', error);
            })
    }

    getBotUser() {
        this.userService.getBotUser(this.userInfo['email'])
            .subscribe((res: any) => {
                if (res)
                    this.botInfo = res;
            }, error => {
                console.log('this.botInfo error', error);
            })
    }

    selectUser(user) {
        this.selectedUser = user;
        this.getConversationForRecipient();
    }

    getConversationForRecipient() {
        this.userService.getConversationForRecipient(this.selectedUser['_id'], this.botInfo['_id'], true)
            .subscribe((res: any) => {
                if (res[0])
                    this.conversation = res[0];
                else this.conversation = {};
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
        if (links && links[0]) {
            let urls = links[0].split(' ');
            urls.forEach(url => {
                // body = body.replace(url, '');
                let bs = body.split(url);
                botConvo.push({ id: id, body: bs[0] });
                body = bs[1];
                botConvo.push({ id: id, link: url, linkText: url });
            });
            // botConvo.push({ id: id, body: body });
        } else {
            botConvo.push({ id: id, body: body });
        }
    }
}