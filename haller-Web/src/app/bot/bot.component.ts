import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';
import { Router } from "@angular/router";

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
    botMessageContent: string = '';
    searchkey: string = '';
    body: string = '';
    adderess: string = '';
    link: string = '';
    linkIsValid: Boolean = true;
    selectedResidense: string = '';
    selectOneRecipient: boolean = false;
    toAllstudent: boolean = false;
    botNewMessage: any = { result: { action: 'manual', fulfillment: { messages: [] } } }
    botPayloads: any = { type: 4, payload: { linkText: '', link: '', address: '' } };
    botReply: any = { type: 0, speech: '' };
    urlExp = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");

    constructor(public userService: UserService, private modalService: ModalService, private router: Router) {
        this.userInfo = localStorage.getItem('userInfo');
        this.userInfo = JSON.parse(this.userInfo);
        if (this.userInfo.role != 'admin') {
            this.router.navigate(['/analytics-dashboard']);
        }
    }
    ngOnInit() {
        // this.getAllUserWithFilter();
        this.getBotUser();
        $('.user-section').perfectScrollbar();
        $('.convo-section').perfectScrollbar();
    }

    getAllUserWithFilter() {
        this.userService.getUsesrWhoTalkWith(this.botInfo._id, this.searchkey || null)
            .subscribe((res) => {
                console.log('res', res);
                this.userList = res;
            }, error => {
                console.log('error', error);
            })
    }

    openModal(id: string) {
        this.body = '';
        this.adderess = '';
        this.link = '';
        this.selectedResidense = '';
        this.toAllstudent = false;
        this.modalService.open(id);
        setTimeout(() => {
            $('.selectpicker').selectpicker('refresh');
        }, 200);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }

    save(model, isValid, id) {
        if (this.userInfo.role == 'admin') {
            if (model.adderess || model.body || model.link) {
                let botNewMessage = JSON.parse(JSON.stringify(this.botNewMessage));
                if (model.body) {
                    let botReply = JSON.parse(JSON.stringify(this.botReply));
                    botReply.speech = model.body;
                    botNewMessage.result.fulfillment.messages.push(botReply);
                }
                if (model.adderess) {
                    let botReply = JSON.parse(JSON.stringify(this.botPayloads));
                    botReply.payload.address = model.adderess;
                    delete botReply.payload.link;
                    botNewMessage.result.fulfillment.messages.push(botReply);
                }
                if (model.link) {
                    let botReply = JSON.parse(JSON.stringify(this.botPayloads));
                    this.linkIsValid = this.urlExp.test(model.link);
                    if (this.linkIsValid) {
                        botReply.payload.link = model.link;
                        delete botReply.payload.address;
                        botNewMessage.result.fulfillment.messages.push(botReply);
                    }
                }
                if (this.linkIsValid) {
                    this.closeModal(id);
                    this.userService.replyAsBot(this.conversationId, this.selectedUser._id, this.userInfo._id, botNewMessage)
                        .subscribe((res) => {
                            if (res._id) {
                                this.conversation = res;
                                this.parseConversation();
                            }
                        }, err => {
                            console.log('replyAsBot err', err);
                        })
                }
            }
        }
    }

    getBotUser() {
        this.userService.getBotUser('dev.bot@ku.edu')
            .subscribe((res: any) => {
                if (res) {
                    this.botInfo = res;
                    this.getAllUserWithFilter();
                }
            }, error => {
                console.log('this.botInfo error', error);
            })
    }

    selectUser(user) {
        this.selectedUser = user;
        this.conversationId = '';
        this.conversation = {};
        this.getConversationForRecipient();
    }

    getConversationForRecipient() {
        this.userService.getConversationForRecipient(this.selectedUser['_id'], this.botInfo['_id'], true)
            .subscribe((res: any) => {
                if (res[0]) { this.conversation = res[0]; } else { this.conversation = {}; }
                if (this.conversation) {
                    this.conversationId = this.conversation['_id'];
                    this.parseConversation();
                }
            }, error => {
                console.log('usres error', error);
            });
    }

    parseConversation() {
        if (this.conversation.messages) {
            this.conversation.messages.forEach(msg => {
                if (msg.botBody) {
                    msg.botBody1 = this.parseResponse(msg.botBody);
                }
            });
            setTimeout(() => {
                console.log('$("#convo-section").prop("scrollHeight")', $("#convo-section").prop("scrollHeight"));
                $(".convo-section").scrollTop($(".convo-section").prop("scrollHeight"));
                $('.convo-section').perfectScrollbar('update');
            }, 500);
        }
    }

    parseResponse(res) {
        let botConvo = [];
        if (res.result.fulfillment && res.result.fulfillment.messages && res.result.fulfillment.messages.length) {
            // if (res.result.action.indexOf('location') == -1) {
            res.result.fulfillment.messages.forEach(msg => {
                if (!msg.platform) {
                    if (msg.type == 0) {
                        // console.log('msg.speech', msg.speech);
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
            if (links && links[0]) {
                let urls = links[0].split(' ');
                let newBody = '';
                urls.forEach(url => {
                    if (exp.test(url.trim())) {
                        let bs = body.split(url);
                        botConvo.push({ id: id, body: bs[0] });
                        body = bs[1].trim();
                        botConvo.push({ id: id, link: url, linkText: url });
                    }
                });
            } else {
                botConvo.push({ id: id, body: body });
            }
        } while (links);
    }

    massMessages() {
        this.openModal('mass-bot-reply-form');
    }

    sendMassMessage(model, isValid, id) {
        if (this.userInfo.role == 'admin') {
            if (this.toAllstudent || (!this.toAllstudent && this.selectedResidense)) {
                this.selectOneRecipient = false;
                if (model.adderess || model.body || model.link) {
                    let botNewMessage = JSON.parse(JSON.stringify(this.botNewMessage));
                    if (model.body) {
                        let botReply = JSON.parse(JSON.stringify(this.botReply));
                        botReply.speech = model.body;
                        botNewMessage.result.fulfillment.messages.push(botReply);
                    }
                    if (model.adderess) {
                        let botReply = JSON.parse(JSON.stringify(this.botPayloads));
                        botReply.payload.address = model.adderess;
                        delete botReply.payload.link;
                        botNewMessage.result.fulfillment.messages.push(botReply);
                    }
                    if (model.link) {
                        let botReply = JSON.parse(JSON.stringify(this.botPayloads));
                        this.linkIsValid = this.urlExp.test(model.link);
                        if (this.linkIsValid) {
                            botReply.payload.link = model.link;
                            delete botReply.payload.address;
                            botNewMessage.result.fulfillment.messages.push(botReply);
                        }
                    }
                    if (this.linkIsValid) {
                        this.closeModal(id);
                        if (this.toAllstudent) { this.selectedResidense = '' }
                        this.userService.massReplyAsBot(this.toAllstudent, this.selectedResidense, this.userInfo._id, botNewMessage)
                            .subscribe((res) => {
                                if (res._id) {
                                    this.conversation = res;
                                    this.parseConversation();
                                }
                            }, err => {
                                console.log('replyAsBot err', err);
                            })
                    }
                }
            } else {
                this.selectOneRecipient = true;
            }
        }
    }
}