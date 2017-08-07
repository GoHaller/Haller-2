import { Injectable } from '@angular/core';
import { HttpClient } from './http-client';
import 'rxjs/add/operator/catch';

@Injectable()
export class ConvoProvider {

  constructor(public httpClient: HttpClient) {
  }

  getMessageList(userId: string, recipientId: string) {
    return this.httpClient.get('/conversations/users/' + userId + (recipientId ? '?recipient=' + recipientId : '')).map(this.httpClient.extractData)
      .catch(this.httpClient.extractError);
  }

  deleteConvo(convoId: string, userId: string) {
    return this.httpClient.delete('/conversations/' + convoId + '/users/' + userId).map(this.httpClient.extractData)
      .catch(this.httpClient.extractError);
  }

  blockUser(userId: string, blockUserId: string) {
    return this.httpClient.get('/users/' + userId + '/block/' + blockUserId).map(this.httpClient.extractData)
    // .catch(this.httpClient.extractError);
  }

  leaveConvo(convoId: string, userId: string) {
    return this.httpClient.delete('/conversations/' + convoId + '/leave/' + userId).map(this.httpClient.extractData)
  }

  getGroupChatName(userId: string, convo) {
    if (convo.groupName)
      return convo.groupName
    else {
      let groupName = [];
      convo.participants.forEach(parti => {
        if (parti._id !== userId && groupName.length < 2) {
          groupName.push(parti.firstName + ' ' + parti.lastName);
        }
      });
      return groupName.join(', ');
    }
  }

  getUsers(userId, skip, limit) {
    return this.httpClient.get('/users/' + userId + '/list/?skip=' + skip + '&limit=' + limit).map(this.httpClient.extractData)
    // .catch(this.httpClient.extractError);
  }

  getConversation(convoId, userId) {
    return this.httpClient.get('/conversations/' + convoId + '/users/' + userId).map(this.httpClient.extractData)
    // .catch(this.httpClient.extractError);
  }

  updateMessage(convoId, messageId, body) {
    return this.httpClient.put('/conversations/' + convoId + '/messages/' + messageId, body).map(this.httpClient.extractData)
    // .catch(this.httpClient.extractError);
  }

  createConversation(msgObj) {
    return this.httpClient.post('/conversations/', msgObj).map(this.httpClient.extractData)
    // .catch(this.httpClient.extractError);
  }

  putMessage(convoId, msgObj, userId: string) {
    return this.httpClient.put('/conversations/' + convoId + '/users/' + userId, msgObj).map(this.httpClient.extractData)
    // .catch(this.httpClient.extractError);
  }

  getConversationForRecipient(userId, recipientId, bot = false) {
    let q = (recipientId ? ('?recipient=' + recipientId) : '');
    if (q.length == 0) q = '?'; else q = q + '&';
    q = q + 'bot=' + bot;
    return this.httpClient.get('/conversations/users/' + userId + q)
      .map(this.httpClient.extractData)
    // .catch(this.httpClient.extractError);
  }

  getBotUser(email) {
    return this.httpClient.get('/users/bot/' + email).map(this.httpClient.extractData);
  }

  askQuestionToBot(msg) {
    return this.httpClient.get('/bot/' + msg).map(this.httpClient.extractData)
  }

  sendQuestionToBot(convoId: string, msgObj) {
    if (convoId)
      return this.httpClient.put('/conversations/' + convoId + '/bot', msgObj).map(this.httpClient.extractData)
    else
      return this.httpClient.post('/conversations/bot', msgObj).map(this.httpClient.extractData)
  }
}
