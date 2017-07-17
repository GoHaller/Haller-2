import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  public post: any = {};
  public comment: any = {};
  public posts = [];
  public postIndex: number = 0;
  ngOnInit() {
    // console.info('posts', this.posts);
    $('.comment-section').perfectScrollbar();
  }
  constructor(private modalService: ModalService) {
    this.posts = [{
      "_id": "5925450aa0579e3df0bee797",
      "residentsFeed": true,
      "discoveryFeed": false,
      "title": "Haller",
      "details": "Hii....good noon",
      "createdBy": {
        "_id": "58c85aaf4b47110004b11202",
        "email": "a033m771@ku.edu",
        "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
        "__v": 27,
        "verificationSent": "2017-03-14T21:03:43.781Z",
        "firstName": "Alex",
        "lastName": "Moser",
        "major": "Math",
        "residence": "Oliver",
        "graduationYear": "2018",
        "hometown": "Woodstock, IL",
        "bio": "Hi, there are many things right now, right? not now.....",
        "currentProfile": {
          "tags": ["profile-covers"],
          "_id": "59300ef850e4e72c382e793e",
          "createdBy": "58c85aaf4b47110004b11202",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
          "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
          "type": "upload",
          "bytes": 64875,
          "created_at": "2017-06-01T12:56:23.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 313,
          "width": 343,
          "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
          "version": "1496321783",
          "public_id": "tndijzvafvw7feppkhdy",
          "__v": 0
        },
        "device": {
          "token": "",
          "os": "android",
          "createdAt": "2017-06-12T16:19:36.720Z",
          "updatedAt": "2017-06-21T08:08:33.695Z"
        },
        "interests": [{
          "_id": "59314da55d03dd366c0f5133",
          "name": "music",
          "createdAt": "2017-06-02T11:02:29.557Z"
        }, {
          "_id": "59314da55d03dd366c0f5132",
          "name": "cooking",
          "createdAt": "2017-06-02T11:02:29.557Z"
        }, {
          "_id": "5948f25e79b5ae1830f70a43",
          "name": "Hey",
          "createdAt": "2017-06-20T09:14:06.593Z"
        }],
        "blocked": [{
          "user": "58d9ee0174d4f70004196874",
          "_id": "592fd04faa64121c34caef35",
          "at": "2017-06-01T08:29:03.489Z"
        }],
        "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
        "notifications": {
          "deviceToken": "",
          "os": "android",
          "enabled": false
        },
        "createdAt": "2017-03-14T21:03:43.633Z",
        "status": {
          "online": false,
          "lastOnline": "2017-03-14T21:03:43.631Z",
          "currentStatus": "offline",
          "activeToken": null
        },
        "genderPronouns": ["He", "His"],
        "emailVerified": true,
        "isRARequested": false,
        "RAData": {
          "verificationSent": "2017-05-25T15:05:54.594Z",
          "codeUsageCount": 0,
          "resFloor": 0,
          "inviteCode": "REZLIFET1"
        },
        "isRA": false,
        "id": "58c85aaf4b47110004b11202"
      },
      "authorResidence": "Oliver",
      "isEvent": false,
      "__v": 129,
      "deteled": false,
      "createdAt": "2017-05-24T08:32:12.005Z",
      "flagged": [],
      "going": [],
      "starred": [{
        "actedBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "actionType": "star",
        "_id": "594a6656cffafb0cc0c65ef0",
        "actedAt": "2017-06-21T12:28:06.870Z"
      }],
      "liked": [{
        "actedBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "actionType": "like",
        "_id": "5943c06247aae20a6c69aa20",
        "actedAt": "2017-06-16T11:26:26.878Z"
      }, {
        "actedBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "actionType": "like",
        "_id": "594d12524f94232708c4c993",
        "actedAt": "2017-06-23T13:06:25.971Z"
      }],
      "cover": [],
      "comments": [{
        "createdBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "body": "test gif edit too",
        "_id": "592c407ba62d372caced91f4",
        "giphy": {
          "id": "3og0IV89dZOheo6K64",
          "still": {
            "url": "https://media2.giphy.com/media/3og0IV89dZOheo6K64/200_s.gif",
            "width": "356",
            "height": "200",
            "size": "45359"
          },
          "gif": {
            "url": "https://media2.giphy.com/media/3og0IV89dZOheo6K64/200_d.gif",
            "width": "356",
            "height": "200",
            "size": "269756",
            "webp": "https://media2.giphy.com/media/3og0IV89dZOheo6K64/200_d.webp",
            "webp_size": "52012"
          }
        },
        "starred": [],
        "flagged": [],
        "liked": [{
          "actedBy": "58c85aaf4b47110004b11202",
          "actionType": "like",
          "_id": "594267ca6439012c68b0565e",
          "actedAt": "2017-06-15T10:56:10.846Z"
        }, {
          "actedBy": "58c96fcf8b3c3400044cd3c0",
          "actionType": "like",
          "_id": "5947dd373317fd27d45ee11b",
          "actedAt": "2017-06-19T14:18:31.497Z"
        }],
        "createdAt": "2017-05-29T15:38:34.728Z"
      }, {
        "createdBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "body": "Test gif again",
        "_id": "592eb03523a36832d8ec3036",
        "giphy": {
          "id": "xUPGcGgYwrUEFDnzMY",
          "still": {
            "url": "https://media1.giphy.com/media/xUPGcGgYwrUEFDnzMY/200_s.gif",
            "width": "356",
            "height": "200",
            "size": "45970"
          },
          "gif": {
            "url": "https://media1.giphy.com/media/xUPGcGgYwrUEFDnzMY/200_d.gif",
            "width": "356",
            "height": "200",
            "size": "237646",
            "webp": "https://media1.giphy.com/media/xUPGcGgYwrUEFDnzMY/200_d.webp",
            "webp_size": "79954"
          }
        },
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-05-31T11:59:49.009Z"
      }, {
        "createdBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "body": "dancing...",
        "_id": "592ecd8da3916e3a38026920",
        "giphy": {
          "id": "l4FGldBmWWNbGlvnq",
          "still": {
            "url": "https://media4.giphy.com/media/l4FGldBmWWNbGlvnq/200_s.gif",
            "width": "356",
            "height": "200",
            "size": "46548"
          },
          "gif": {
            "url": "https://media4.giphy.com/media/l4FGldBmWWNbGlvnq/200_d.gif",
            "width": "356",
            "height": "200",
            "size": "286360",
            "webp": "https://media4.giphy.com/media/l4FGldBmWWNbGlvnq/200_d.webp",
            "webp_size": "100550"
          }
        },
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-05-31T14:05:01.860Z"
      }, {
        "createdBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "body": "test notification",
        "_id": "593fa1aa0dae9a1e848aaeb3",
        "starred": [],
        "flagged": [],
        "liked": [{
          "actedBy": "58c85aaf4b47110004b11202",
          "actionType": "like",
          "_id": "594267d36439012c68b0565f",
          "actedAt": "2017-06-15T10:56:19.521Z"
        }],
        "createdAt": "2017-06-13T08:26:18.164Z"
      }, {
        "createdBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "body": "test notification 2",
        "_id": "593fa211649d0c3b70515d44",
        "starred": [],
        "flagged": [],
        "liked": [{
          "actedBy": "58c96fcf8b3c3400044cd3c0",
          "actionType": "like",
          "_id": "5947dde33317fd27d45ee125",
          "actedAt": "2017-06-19T14:21:23.399Z"
        }],
        "createdAt": "2017-06-13T08:28:01.323Z"
      }, {
        "createdBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "body": "hello",
        "_id": "593fa21c649d0c3b70515d46",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-06-13T08:28:12.359Z"
      }]
    }, {
      "_id": "5902f5e50231ae3790757a80",
      "title": "Haller",
      "residentsFeed": true,
      "discoveryFeed": false,
      "createdBy": {
        "_id": "58c85aaf4b47110004b11202",
        "email": "a033m771@ku.edu",
        "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
        "__v": 27,
        "verificationSent": "2017-03-14T21:03:43.781Z",
        "firstName": "Alex",
        "lastName": "Moser",
        "major": "Math",
        "residence": "Oliver",
        "graduationYear": "2018",
        "hometown": "Woodstock, IL",
        "bio": "Hi, there are many things right now, right? not now.....",
        "currentProfile": {
          "tags": ["profile-covers"],
          "_id": "59300ef850e4e72c382e793e",
          "createdBy": "58c85aaf4b47110004b11202",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
          "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
          "type": "upload",
          "bytes": 64875,
          "created_at": "2017-06-01T12:56:23.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 313,
          "width": 343,
          "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
          "version": "1496321783",
          "public_id": "tndijzvafvw7feppkhdy",
          "__v": 0
        },
        "device": {
          "token": "",
          "os": "android",
          "createdAt": "2017-06-12T16:19:36.720Z",
          "updatedAt": "2017-06-21T08:08:33.695Z"
        },
        "interests": [{
          "_id": "59314da55d03dd366c0f5133",
          "name": "music",
          "createdAt": "2017-06-02T11:02:29.557Z"
        }, {
          "_id": "59314da55d03dd366c0f5132",
          "name": "cooking",
          "createdAt": "2017-06-02T11:02:29.557Z"
        }, {
          "_id": "5948f25e79b5ae1830f70a43",
          "name": "Hey",
          "createdAt": "2017-06-20T09:14:06.593Z"
        }],
        "blocked": [{
          "user": "58d9ee0174d4f70004196874",
          "_id": "592fd04faa64121c34caef35",
          "at": "2017-06-01T08:29:03.489Z"
        }],
        "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
        "notifications": {
          "deviceToken": "",
          "os": "android",
          "enabled": false
        },
        "createdAt": "2017-03-14T21:03:43.633Z",
        "status": {
          "online": false,
          "lastOnline": "2017-03-14T21:03:43.631Z",
          "currentStatus": "offline",
          "activeToken": null
        },
        "genderPronouns": ["He", "His"],
        "emailVerified": true,
        "isRARequested": false,
        "RAData": {
          "verificationSent": "2017-05-25T15:05:54.594Z",
          "codeUsageCount": 0,
          "resFloor": 0,
          "inviteCode": "REZLIFET1"
        },
        "isRA": false,
        "id": "58c85aaf4b47110004b11202"
      },
      "isEvent": false,
      "authorResidence": "Oliver",
      "details": "Hello test",
      "__v": 0,
      "deteled": false,
      "createdAt": "2017-04-28T07:56:49.388Z",
      "flagged": [],
      "going": [],
      "starred": [],
      "liked": [],
      "cover": [{
        "_id": "5902f5e50231ae3790757a7f",
        "__v": 0,
        "createdBy": "58c85aaf4b47110004b11202",
        "original_filename": "image",
        "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1493365945/image_dwlmhi.jpg",
        "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1493365945/image_dwlmhi.jpg",
        "etag": "be9c0b8807aa1a12304b530c8d177cf7",
        "type": "upload",
        "bytes": 843003,
        "created_at": "2017-04-28T07:52:25.000Z",
        "resource_type": "image",
        "format": "jpg",
        "height": 2322,
        "width": 4128,
        "signature": "c74e1919d3c860e33b3e2e57cab2a5e188a64df8",
        "version": "1493365945",
        "public_id": "image_dwlmhi",
        "tags": ["post-cover"]
      }],
      "comments": []
    }, {
      "_id": "58d9b2b130c282000408b311",
      "title": "Haller",
      "residentsFeed": true,
      "discoveryFeed": false,
      "createdBy": {
        "_id": "58c96fcf8b3c3400044cd3c0",
        "email": "m196f845@ku.edu",
        "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
        "__v": 11,
        "verificationSent": "2017-03-15T16:46:08.482Z",
        "firstName": "Mahdi",
        "lastName": "Fahda",
        "major": "",
        "residence": "Oliver",
        "graduationYear": "2017",
        "bio": "What's good baby",
        "currentProfile": {
          "tags": ["profile"],
          "_id": "58d92fa8bc9179000401d9ce",
          "createdBy": "58c96fcf8b3c3400044cd3c0",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
          "etag": "49955924a0b3aa796ac166cd1569b76b",
          "type": "upload",
          "bytes": 91210,
          "created_at": "2017-03-27T15:28:39.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 750,
          "width": 750,
          "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
          "version": "1490628519",
          "public_id": "image_oarulr",
          "__v": 0
        },
        "currentCover": {
          "tags": ["profile-covers"],
          "_id": "58d9b76830c282000408b322",
          "createdBy": "58c96fcf8b3c3400044cd3c0",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
          "etag": "5575d517cf811c1c5568f045896ce12d",
          "type": "upload",
          "bytes": 28984,
          "created_at": "2017-03-28T01:07:51.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 500,
          "width": 846,
          "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
          "version": "1490663271",
          "public_id": "q0k8udtzz2nrxnm8qw7v",
          "__v": 0
        },
        "device": {
          "createdAt": "2017-06-12T16:16:41.329Z",
          "updatedAt": "2017-06-12T16:16:41.329Z"
        },
        "hometown": "",
        "interests": [],
        "blocked": [{
          "user": "592ec8daa3916e3a3802691a",
          "_id": "595256dc2bab9005f495c5c8",
          "at": "2017-06-27T13:00:12.815Z"
        }],
        "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
        "notifications": {
          "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
          "os": "ios",
          "enabled": true
        },
        "createdAt": "2017-03-15T16:46:07.685Z",
        "status": {
          "online": true,
          "lastOnline": "2017-03-15T16:46:07.682Z",
          "currentStatus": "online",
          "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
        },
        "genderPronouns": [],
        "emailVerified": true,
        "isRARequested": true,
        "RAData": {
          "verificationSent": "2017-03-27T15:29:29.037Z",
          "codeUsageCount": 1,
          "resFloor": 0,
          "inviteCode": "FAHDMAHD0"
        },
        "isRA": true,
        "id": "58c96fcf8b3c3400044cd3c0"
      },
      "isEvent": false,
      "authorResidence": "Oliver",
      "details": "Why doesn't that post have a profile tagged to it? ⬇️... sketch AF",
      "__v": 68,
      "deteled": false,
      "createdAt": "2017-03-28T00:47:45.073Z",
      "flagged": [],
      "going": [],
      "starred": [{
        "actedBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "actionType": "star",
        "_id": "591ad4493788ac144c4172ad",
        "actedAt": "2017-05-16T10:28:25.265Z"
      }],
      "liked": [{
        "actedBy": {
          "_id": "58d9ee0174d4f70004196874",
          "email": "kgohel@ku.edu",
          "password": "$2a$10$SY17/SWe3A3mCRjR5y.aUe.PaqhiOaVQ4dPp8kvj3QLJwX97TTXb6",
          "__v": 2,
          "verificationSent": "2017-03-28T05:00:49.336Z",
          "firstName": "Abhay",
          "lastName": "Gohel",
          "major": "Business",
          "residence": "Oliver",
          "graduationYear": "2019",
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-28T05:00:49.212Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-28T05:00:49.211Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58d9ee0174d4f70004196874"
        },
        "actionType": "like",
        "_id": "59380a1f273e341b3809cd0c",
        "actedAt": "2017-06-07T14:13:51.761Z"
      }],
      "cover": [],
      "comments": [{
        "createdBy": {
          "_id": "58d9ee0174d4f70004196874",
          "email": "kgohel@ku.edu",
          "password": "$2a$10$SY17/SWe3A3mCRjR5y.aUe.PaqhiOaVQ4dPp8kvj3QLJwX97TTXb6",
          "__v": 2,
          "verificationSent": "2017-03-28T05:00:49.336Z",
          "firstName": "Abhay",
          "lastName": "Gohel",
          "major": "Business",
          "residence": "Oliver",
          "graduationYear": "2019",
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-28T05:00:49.212Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-28T05:00:49.211Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58d9ee0174d4f70004196874"
        },
        "body": "Hello there",
        "_id": "59381829e575813cacc4b00a",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-06-07T15:13:45.348Z"
      }, {
        "createdBy": {
          "_id": "58d9ee0174d4f70004196874",
          "email": "kgohel@ku.edu",
          "password": "$2a$10$SY17/SWe3A3mCRjR5y.aUe.PaqhiOaVQ4dPp8kvj3QLJwX97TTXb6",
          "__v": 2,
          "verificationSent": "2017-03-28T05:00:49.336Z",
          "firstName": "Abhay",
          "lastName": "Gohel",
          "major": "Business",
          "residence": "Oliver",
          "graduationYear": "2019",
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-28T05:00:49.212Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-28T05:00:49.211Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58d9ee0174d4f70004196874"
        },
        "body": "There ...",
        "_id": "593818f379feb93698e52520",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-06-07T15:17:06.688Z"
      }]
    }, {
      "_id": "58d9372abc9179000401d9d0",
      "title": "Haller",
      "residentsFeed": true,
      "discoveryFeed": false,
      "createdBy": null,
      "isEvent": false,
      "authorResidence": "Oliver",
      "details": "Yes, I am krutarth",
      "__v": 0,
      "deteled": false,
      "createdAt": "2017-03-27T16:00:42.445Z",
      "flagged": [],
      "going": [],
      "starred": [],
      "liked": [],
      "cover": [],
      "comments": []
    }, {
      "_id": "58d92d47bc9179000401d9bf",
      "title": "Haller",
      "residentsFeed": true,
      "discoveryFeed": false,
      "createdBy": {
        "_id": "58c96fcf8b3c3400044cd3c0",
        "email": "m196f845@ku.edu",
        "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
        "__v": 11,
        "verificationSent": "2017-03-15T16:46:08.482Z",
        "firstName": "Mahdi",
        "lastName": "Fahda",
        "major": "",
        "residence": "Oliver",
        "graduationYear": "2017",
        "bio": "What's good baby",
        "currentProfile": {
          "tags": ["profile"],
          "_id": "58d92fa8bc9179000401d9ce",
          "createdBy": "58c96fcf8b3c3400044cd3c0",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
          "etag": "49955924a0b3aa796ac166cd1569b76b",
          "type": "upload",
          "bytes": 91210,
          "created_at": "2017-03-27T15:28:39.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 750,
          "width": 750,
          "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
          "version": "1490628519",
          "public_id": "image_oarulr",
          "__v": 0
        },
        "currentCover": {
          "tags": ["profile-covers"],
          "_id": "58d9b76830c282000408b322",
          "createdBy": "58c96fcf8b3c3400044cd3c0",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
          "etag": "5575d517cf811c1c5568f045896ce12d",
          "type": "upload",
          "bytes": 28984,
          "created_at": "2017-03-28T01:07:51.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 500,
          "width": 846,
          "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
          "version": "1490663271",
          "public_id": "q0k8udtzz2nrxnm8qw7v",
          "__v": 0
        },
        "device": {
          "createdAt": "2017-06-12T16:16:41.329Z",
          "updatedAt": "2017-06-12T16:16:41.329Z"
        },
        "hometown": "",
        "interests": [],
        "blocked": [{
          "user": "592ec8daa3916e3a3802691a",
          "_id": "595256dc2bab9005f495c5c8",
          "at": "2017-06-27T13:00:12.815Z"
        }],
        "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
        "notifications": {
          "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
          "os": "ios",
          "enabled": true
        },
        "createdAt": "2017-03-15T16:46:07.685Z",
        "status": {
          "online": true,
          "lastOnline": "2017-03-15T16:46:07.682Z",
          "currentStatus": "online",
          "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
        },
        "genderPronouns": [],
        "emailVerified": true,
        "isRARequested": true,
        "RAData": {
          "verificationSent": "2017-03-27T15:29:29.037Z",
          "codeUsageCount": 1,
          "resFloor": 0,
          "inviteCode": "FAHDMAHD0"
        },
        "isRA": true,
        "id": "58c96fcf8b3c3400044cd3c0"
      },
      "isEvent": false,
      "authorResidence": "Oliver",
      "details": "Views",
      "__v": 12,
      "deteled": false,
      "createdAt": "2017-03-27T15:18:31.015Z",
      "flagged": [],
      "going": [],
      "starred": [{
        "actedBy": {
          "_id": "58c85cd34b47110004b11205",
          "email": "kgohel@gohaller.com",
          "password": "$2a$10$abbxZkAaRmqFM7hC8uwmxuZgwt0sH/NhfhRXtKxWQygpDUaHOj5Lu",
          "__v": 1,
          "verificationSent": "2017-03-14T21:12:51.594Z",
          "firstName": "Krutarth",
          "lastName": "Gohel",
          "major": "Finance",
          "residence": "Oliver",
          "graduationYear": "2022",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d87ad01658a40004e6b35e",
            "createdBy": "58c85cd34b47110004b11205",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
            "etag": "bc0a4f284b81783a960dc8da76d8dcf4",
            "type": "upload",
            "bytes": 90117,
            "created_at": "2017-03-27T02:37:03.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 640,
            "width": 640,
            "signature": "28e87ededf8d130e71edbe2c4a9331b731be5346",
            "version": "1490582223",
            "public_id": "image_odqn9y",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d88d0f1658a40004e6b369",
            "createdBy": "58c85cd34b47110004b11205",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
            "etag": "7a42a463ab397b68fb8f47722c5ef186",
            "type": "upload",
            "bytes": 41139,
            "created_at": "2017-03-27T03:54:54.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 375,
            "signature": "a9267fa685d74c8bc98a106f297acbb8a0fb7131",
            "version": "1490586894",
            "public_id": "xdvni1gel32xqogp2m6j",
            "__v": 0
          },
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-14T21:12:51.169Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:12:51.169Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["Him,his,he"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85cd34b47110004b11205"
        },
        "actionType": "star",
        "_id": "58d9624f88f51f0004f37322",
        "actedAt": "2017-03-27T19:04:47.570Z"
      }, {
        "actedBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "actionType": "star",
        "_id": "58d9b3b330c282000408b319",
        "actedAt": "2017-03-28T00:52:03.148Z"
      }],
      "liked": [{
        "actedBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "actionType": "like",
        "_id": "594a6be0cffafb0cc0c65ef8",
        "actedAt": "2017-06-21T12:51:44.337Z"
      }],
      "cover": [{
        "_id": "58d92d47bc9179000401d9be",
        "__v": 0,
        "createdBy": "58c96fcf8b3c3400044cd3c0",
        "original_filename": "image",
        "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490627899/image_syxumj.jpg",
        "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490627899/image_syxumj.jpg",
        "etag": "1d97199b78f7fdfacbe50387e7044bda",
        "type": "upload",
        "bytes": 169452,
        "created_at": "2017-03-27T15:18:19.000Z",
        "resource_type": "image",
        "format": "jpg",
        "height": 750,
        "width": 750,
        "signature": "114d0988d487b4e3987eb51344ac04694baef976",
        "version": "1490627899",
        "public_id": "image_syxumj",
        "tags": ["post-cover"]
      }],
      "comments": [{
        "createdBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "image": {
          "tags": ["profile-covers"],
          "_id": "58ef81997532d100bc0f94ee",
          "createdBy": "58c85aaf4b47110004b11202",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1492091291/ynlclgz6o5pmeyzcsyri.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1492091291/ynlclgz6o5pmeyzcsyri.jpg",
          "etag": "1bc4d69f22a53eedfc78987ebacee7a8",
          "type": "upload",
          "bytes": 1082648,
          "created_at": "2017-04-13T13:48:11.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 2453,
          "width": 2126,
          "signature": "6e3c2cbd5cc488f1f5b4455c3880f2d1a58eb967",
          "version": "1492091291",
          "public_id": "ynlclgz6o5pmeyzcsyri",
          "__v": 0
        },
        "body": "Good",
        "_id": "58ef81997532d100bc0f94ef",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-04-13T13:47:26.992Z"
      }, {
        "createdBy": {
          "_id": "58d9ee0174d4f70004196874",
          "email": "kgohel@ku.edu",
          "password": "$2a$10$SY17/SWe3A3mCRjR5y.aUe.PaqhiOaVQ4dPp8kvj3QLJwX97TTXb6",
          "__v": 2,
          "verificationSent": "2017-03-28T05:00:49.336Z",
          "firstName": "Abhay",
          "lastName": "Gohel",
          "major": "Business",
          "residence": "Oliver",
          "graduationYear": "2019",
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-28T05:00:49.212Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-28T05:00:49.211Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58d9ee0174d4f70004196874"
        },
        "body": "awesome ...",
        "_id": "5938108c7f8c5914683c9b63",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-06-07T14:41:15.995Z"
      }, {
        "createdBy": {
          "_id": "58d9ee0174d4f70004196874",
          "email": "kgohel@ku.edu",
          "password": "$2a$10$SY17/SWe3A3mCRjR5y.aUe.PaqhiOaVQ4dPp8kvj3QLJwX97TTXb6",
          "__v": 2,
          "verificationSent": "2017-03-28T05:00:49.336Z",
          "firstName": "Abhay",
          "lastName": "Gohel",
          "major": "Business",
          "residence": "Oliver",
          "graduationYear": "2019",
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-28T05:00:49.212Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-28T05:00:49.211Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58d9ee0174d4f70004196874"
        },
        "body": "again awesome ...",
        "_id": "5938112bb1f00831d84687b0",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-06-07T14:43:54.596Z"
      }, {
        "createdBy": {
          "_id": "58d9ee0174d4f70004196874",
          "email": "kgohel@ku.edu",
          "password": "$2a$10$SY17/SWe3A3mCRjR5y.aUe.PaqhiOaVQ4dPp8kvj3QLJwX97TTXb6",
          "__v": 2,
          "verificationSent": "2017-03-28T05:00:49.336Z",
          "firstName": "Abhay",
          "lastName": "Gohel",
          "major": "Business",
          "residence": "Oliver",
          "graduationYear": "2019",
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-28T05:00:49.212Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-28T05:00:49.211Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58d9ee0174d4f70004196874"
        },
        "body": "again awesome ...",
        "_id": "5938112bb1f00831d84687b1",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-06-07T14:43:54.527Z"
      }, {
        "createdBy": {
          "_id": "58d9ee0174d4f70004196874",
          "email": "kgohel@ku.edu",
          "password": "$2a$10$SY17/SWe3A3mCRjR5y.aUe.PaqhiOaVQ4dPp8kvj3QLJwX97TTXb6",
          "__v": 2,
          "verificationSent": "2017-03-28T05:00:49.336Z",
          "firstName": "Abhay",
          "lastName": "Gohel",
          "major": "Business",
          "residence": "Oliver",
          "graduationYear": "2019",
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-28T05:00:49.212Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-28T05:00:49.211Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58d9ee0174d4f70004196874"
        },
        "body": "again awesome ...",
        "_id": "5938112bb1f00831d84687b2",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-06-07T14:43:54.630Z"
      }]
    }, {
      "_id": "58d8a5641658a40004e6b36d",
      "title": "Haller",
      "residentsFeed": true,
      "discoveryFeed": false,
      "createdBy": {
        "_id": "58c85cd34b47110004b11205",
        "email": "kgohel@gohaller.com",
        "password": "$2a$10$abbxZkAaRmqFM7hC8uwmxuZgwt0sH/NhfhRXtKxWQygpDUaHOj5Lu",
        "__v": 1,
        "verificationSent": "2017-03-14T21:12:51.594Z",
        "firstName": "Krutarth",
        "lastName": "Gohel",
        "major": "Finance",
        "residence": "Oliver",
        "graduationYear": "2022",
        "currentProfile": {
          "tags": ["profile"],
          "_id": "58d87ad01658a40004e6b35e",
          "createdBy": "58c85cd34b47110004b11205",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
          "etag": "bc0a4f284b81783a960dc8da76d8dcf4",
          "type": "upload",
          "bytes": 90117,
          "created_at": "2017-03-27T02:37:03.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 640,
          "width": 640,
          "signature": "28e87ededf8d130e71edbe2c4a9331b731be5346",
          "version": "1490582223",
          "public_id": "image_odqn9y",
          "__v": 0
        },
        "currentCover": {
          "tags": ["profile-covers"],
          "_id": "58d88d0f1658a40004e6b369",
          "createdBy": "58c85cd34b47110004b11205",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
          "etag": "7a42a463ab397b68fb8f47722c5ef186",
          "type": "upload",
          "bytes": 41139,
          "created_at": "2017-03-27T03:54:54.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 500,
          "width": 375,
          "signature": "a9267fa685d74c8bc98a106f297acbb8a0fb7131",
          "version": "1490586894",
          "public_id": "xdvni1gel32xqogp2m6j",
          "__v": 0
        },
        "interests": [],
        "blocked": [],
        "organizations": [],
        "notifications": {
          "enabled": true
        },
        "createdAt": "2017-03-14T21:12:51.169Z",
        "status": {
          "online": false,
          "lastOnline": "2017-03-14T21:12:51.169Z",
          "currentStatus": "offline",
          "activeToken": null
        },
        "genderPronouns": ["Him,his,he"],
        "emailVerified": true,
        "isRARequested": false,
        "RAData": {
          "codeUsageCount": 0,
          "resFloor": 0,
          "inviteCode": "REZLIFET1"
        },
        "isRA": false,
        "id": "58c85cd34b47110004b11205"
      },
      "isEvent": false,
      "authorResidence": "Oliver",
      "details": "An Image in a post! Yay",
      "__v": 18,
      "deteled": false,
      "createdAt": "2017-03-27T05:38:44.210Z",
      "flagged": [],
      "going": [],
      "starred": [{
        "actedBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "actionType": "star",
        "_id": "58d92dcabc9179000401d9c0",
        "actedAt": "2017-03-27T15:20:41.994Z"
      }, {
        "actedBy": {
          "_id": "58c85cd34b47110004b11205",
          "email": "kgohel@gohaller.com",
          "password": "$2a$10$abbxZkAaRmqFM7hC8uwmxuZgwt0sH/NhfhRXtKxWQygpDUaHOj5Lu",
          "__v": 1,
          "verificationSent": "2017-03-14T21:12:51.594Z",
          "firstName": "Krutarth",
          "lastName": "Gohel",
          "major": "Finance",
          "residence": "Oliver",
          "graduationYear": "2022",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d87ad01658a40004e6b35e",
            "createdBy": "58c85cd34b47110004b11205",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
            "etag": "bc0a4f284b81783a960dc8da76d8dcf4",
            "type": "upload",
            "bytes": 90117,
            "created_at": "2017-03-27T02:37:03.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 640,
            "width": 640,
            "signature": "28e87ededf8d130e71edbe2c4a9331b731be5346",
            "version": "1490582223",
            "public_id": "image_odqn9y",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d88d0f1658a40004e6b369",
            "createdBy": "58c85cd34b47110004b11205",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
            "etag": "7a42a463ab397b68fb8f47722c5ef186",
            "type": "upload",
            "bytes": 41139,
            "created_at": "2017-03-27T03:54:54.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 375,
            "signature": "a9267fa685d74c8bc98a106f297acbb8a0fb7131",
            "version": "1490586894",
            "public_id": "xdvni1gel32xqogp2m6j",
            "__v": 0
          },
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-14T21:12:51.169Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:12:51.169Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["Him,his,he"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85cd34b47110004b11205"
        },
        "actionType": "star",
        "_id": "58d9625288f51f0004f37323",
        "actedAt": "2017-03-27T19:04:50.422Z"
      }],
      "liked": [{
        "actedBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "actionType": "like",
        "_id": "59524a242bab9005f495c5c3",
        "actedAt": "2017-06-27T12:05:56.067Z"
      }],
      "cover": [{
        "_id": "58d8a5641658a40004e6b36c",
        "__v": 0,
        "createdBy": "58c85cd34b47110004b11205",
        "original_filename": "image",
        "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490593079/image_bualyn.jpg",
        "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490593079/image_bualyn.jpg",
        "etag": "74a2b494b5cb798c683d6eb821fde9dd",
        "type": "upload",
        "bytes": 68223,
        "created_at": "2017-03-27T05:37:59.000Z",
        "resource_type": "image",
        "format": "jpg",
        "height": 640,
        "width": 638,
        "signature": "567436beaf9faf5e1da4c5570c1b07ca7c11acf1",
        "version": "1490593079",
        "public_id": "image_bualyn",
        "tags": ["post-cover"]
      }],
      "comments": [{
        "createdBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "body": "Cool pic bro",
        "_id": "58d92bd7bc9179000401d9bc",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-03-27T15:12:20.689Z"
      }, {
        "createdBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "body": "Cool pic bro",
        "_id": "58d92bd9bc9179000401d9bd",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-03-27T15:12:23.122Z"
      }, {
        "createdBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "body": "Sketchy bro",
        "_id": "58d9b3c330c282000408b31a",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-03-28T00:52:18.949Z"
      }]
    }, {
      "_id": "58c98dffb8c1f60004ea2cfc",
      "title": "Haller",
      "residentsFeed": true,
      "discoveryFeed": false,
      "createdBy": {
        "_id": "58c85aaf4b47110004b11202",
        "email": "a033m771@ku.edu",
        "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
        "__v": 27,
        "verificationSent": "2017-03-14T21:03:43.781Z",
        "firstName": "Alex",
        "lastName": "Moser",
        "major": "Math",
        "residence": "Oliver",
        "graduationYear": "2018",
        "hometown": "Woodstock, IL",
        "bio": "Hi, there are many things right now, right? not now.....",
        "currentProfile": {
          "tags": ["profile-covers"],
          "_id": "59300ef850e4e72c382e793e",
          "createdBy": "58c85aaf4b47110004b11202",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
          "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
          "type": "upload",
          "bytes": 64875,
          "created_at": "2017-06-01T12:56:23.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 313,
          "width": 343,
          "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
          "version": "1496321783",
          "public_id": "tndijzvafvw7feppkhdy",
          "__v": 0
        },
        "device": {
          "token": "",
          "os": "android",
          "createdAt": "2017-06-12T16:19:36.720Z",
          "updatedAt": "2017-06-21T08:08:33.695Z"
        },
        "interests": [{
          "_id": "59314da55d03dd366c0f5133",
          "name": "music",
          "createdAt": "2017-06-02T11:02:29.557Z"
        }, {
          "_id": "59314da55d03dd366c0f5132",
          "name": "cooking",
          "createdAt": "2017-06-02T11:02:29.557Z"
        }, {
          "_id": "5948f25e79b5ae1830f70a43",
          "name": "Hey",
          "createdAt": "2017-06-20T09:14:06.593Z"
        }],
        "blocked": [{
          "user": "58d9ee0174d4f70004196874",
          "_id": "592fd04faa64121c34caef35",
          "at": "2017-06-01T08:29:03.489Z"
        }],
        "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
        "notifications": {
          "deviceToken": "",
          "os": "android",
          "enabled": false
        },
        "createdAt": "2017-03-14T21:03:43.633Z",
        "status": {
          "online": false,
          "lastOnline": "2017-03-14T21:03:43.631Z",
          "currentStatus": "offline",
          "activeToken": null
        },
        "genderPronouns": ["He", "His"],
        "emailVerified": true,
        "isRARequested": false,
        "RAData": {
          "verificationSent": "2017-05-25T15:05:54.594Z",
          "codeUsageCount": 0,
          "resFloor": 0,
          "inviteCode": "REZLIFET1"
        },
        "isRA": false,
        "id": "58c85aaf4b47110004b11202"
      },
      "isEvent": false,
      "authorResidence": "Oliver",
      "details": "Posting",
      "__v": 78,
      "updatedAt": "2017-05-23T09:40:55.780Z",
      "deteled": false,
      "createdAt": "2017-03-15T18:54:55.480Z",
      "flagged": [],
      "going": [],
      "starred": [{
        "actedBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "actionType": "star",
        "_id": "58cde4feda0c90000483bda8",
        "actedAt": "2017-03-19T01:55:10.128Z"
      }],
      "liked": [{
        "actedBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "actionType": "like",
        "_id": "5948ef4879b5ae1830f70a41",
        "actedAt": "2017-06-20T09:47:52.086Z"
      }],
      "cover": [],
      "comments": [{
        "createdBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "body": "xczczxczxcz\n\nzxczxc",
        "_id": "58caf0b101f52d0004d78683",
        "image": null,
        "starred": [],
        "flagged": [{
          "actedBy": {
            "_id": "58c85aaf4b47110004b11202",
            "email": "a033m771@ku.edu",
            "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
            "__v": 27,
            "verificationSent": "2017-03-14T21:03:43.781Z",
            "firstName": "Alex",
            "lastName": "Moser",
            "major": "Math",
            "residence": "Oliver",
            "graduationYear": "2018",
            "hometown": "Woodstock, IL",
            "bio": "Hi, there are many things right now, right? not now.....",
            "currentProfile": {
              "tags": ["profile-covers"],
              "_id": "59300ef850e4e72c382e793e",
              "createdBy": "58c85aaf4b47110004b11202",
              "original_filename": "image",
              "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
              "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
              "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
              "type": "upload",
              "bytes": 64875,
              "created_at": "2017-06-01T12:56:23.000Z",
              "resource_type": "image",
              "format": "jpg",
              "height": 313,
              "width": 343,
              "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
              "version": "1496321783",
              "public_id": "tndijzvafvw7feppkhdy",
              "__v": 0
            },
            "device": {
              "token": "",
              "os": "android",
              "createdAt": "2017-06-12T16:19:36.720Z",
              "updatedAt": "2017-06-21T08:08:33.695Z"
            },
            "interests": [{
              "_id": "59314da55d03dd366c0f5133",
              "name": "music",
              "createdAt": "2017-06-02T11:02:29.557Z"
            }, {
              "_id": "59314da55d03dd366c0f5132",
              "name": "cooking",
              "createdAt": "2017-06-02T11:02:29.557Z"
            }, {
              "_id": "5948f25e79b5ae1830f70a43",
              "name": "Hey",
              "createdAt": "2017-06-20T09:14:06.593Z"
            }],
            "blocked": [{
              "user": "58d9ee0174d4f70004196874",
              "_id": "592fd04faa64121c34caef35",
              "at": "2017-06-01T08:29:03.489Z"
            }],
            "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
            "notifications": {
              "deviceToken": "",
              "os": "android",
              "enabled": false
            },
            "createdAt": "2017-03-14T21:03:43.633Z",
            "status": {
              "online": false,
              "lastOnline": "2017-03-14T21:03:43.631Z",
              "currentStatus": "offline",
              "activeToken": null
            },
            "genderPronouns": ["He", "His"],
            "emailVerified": true,
            "isRARequested": false,
            "RAData": {
              "verificationSent": "2017-05-25T15:05:54.594Z",
              "codeUsageCount": 0,
              "resFloor": 0,
              "inviteCode": "REZLIFET1"
            },
            "isRA": false,
            "id": "58c85aaf4b47110004b11202"
          },
          "actionType": "flag",
          "actionStatus": "Pending Review",
          "_id": "58eb77a775233619b80e2f46",
          "actedAt": "2017-04-10T12:16:39.085Z"
        }],
        "liked": [],
        "createdAt": "2017-03-16T20:08:17.608Z"
      }, {
        "createdBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "body": "Hi comment Test",
        "_id": "58eb88b975233619b80e2f4e",
        "image": null,
        "starred": [],
        "flagged": [{
          "actedBy": {
            "_id": "58c85aaf4b47110004b11202",
            "email": "a033m771@ku.edu",
            "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
            "__v": 27,
            "verificationSent": "2017-03-14T21:03:43.781Z",
            "firstName": "Alex",
            "lastName": "Moser",
            "major": "Math",
            "residence": "Oliver",
            "graduationYear": "2018",
            "hometown": "Woodstock, IL",
            "bio": "Hi, there are many things right now, right? not now.....",
            "currentProfile": {
              "tags": ["profile-covers"],
              "_id": "59300ef850e4e72c382e793e",
              "createdBy": "58c85aaf4b47110004b11202",
              "original_filename": "image",
              "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
              "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
              "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
              "type": "upload",
              "bytes": 64875,
              "created_at": "2017-06-01T12:56:23.000Z",
              "resource_type": "image",
              "format": "jpg",
              "height": 313,
              "width": 343,
              "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
              "version": "1496321783",
              "public_id": "tndijzvafvw7feppkhdy",
              "__v": 0
            },
            "device": {
              "token": "",
              "os": "android",
              "createdAt": "2017-06-12T16:19:36.720Z",
              "updatedAt": "2017-06-21T08:08:33.695Z"
            },
            "interests": [{
              "_id": "59314da55d03dd366c0f5133",
              "name": "music",
              "createdAt": "2017-06-02T11:02:29.557Z"
            }, {
              "_id": "59314da55d03dd366c0f5132",
              "name": "cooking",
              "createdAt": "2017-06-02T11:02:29.557Z"
            }, {
              "_id": "5948f25e79b5ae1830f70a43",
              "name": "Hey",
              "createdAt": "2017-06-20T09:14:06.593Z"
            }],
            "blocked": [{
              "user": "58d9ee0174d4f70004196874",
              "_id": "592fd04faa64121c34caef35",
              "at": "2017-06-01T08:29:03.489Z"
            }],
            "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
            "notifications": {
              "deviceToken": "",
              "os": "android",
              "enabled": false
            },
            "createdAt": "2017-03-14T21:03:43.633Z",
            "status": {
              "online": false,
              "lastOnline": "2017-03-14T21:03:43.631Z",
              "currentStatus": "offline",
              "activeToken": null
            },
            "genderPronouns": ["He", "His"],
            "emailVerified": true,
            "isRARequested": false,
            "RAData": {
              "verificationSent": "2017-05-25T15:05:54.594Z",
              "codeUsageCount": 0,
              "resFloor": 0,
              "inviteCode": "REZLIFET1"
            },
            "isRA": false,
            "id": "58c85aaf4b47110004b11202"
          },
          "actionType": "flag",
          "actionStatus": "Pending Review",
          "_id": "58eb8e9075233619b80e2f56",
          "actedAt": "2017-04-10T13:54:24.096Z"
        }],
        "liked": [],
        "createdAt": "2017-04-10T13:29:29.011Z"
      }, {
        "createdBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "body": "Test again from other user",
        "_id": "58eb88bf75233619b80e2f4a",
        "image": null,
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-04-10T13:29:35.266Z"
      }, {
        "createdBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "body": "Image test",
        "image": {
          "tags": ["profile-covers"],
          "_id": "58ee3689bce4c31b0484f9ec",
          "createdBy": "58c85aaf4b47110004b11202",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1492006539/xjca9ng6cr35ygj9q31e.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1492006539/xjca9ng6cr35ygj9q31e.jpg",
          "etag": "ebc876268571ed47bd7de0206d5c9024",
          "type": "upload",
          "bytes": 49703,
          "created_at": "2017-04-12T14:15:39.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 500,
          "width": 888,
          "signature": "1c1ee697d1b2baefa84d210912bd4d39f2ab57f1",
          "version": "1492006539",
          "public_id": "xjca9ng6cr35ygj9q31e",
          "__v": 0
        },
        "_id": "58ee3689bce4c31b0484f9ed",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-04-12T14:15:01.602Z"
      }, {
        "createdBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "body": "",
        "image": {
          "tags": ["profile-covers"],
          "_id": "58ef6fea9fc22934f8ceb03a",
          "createdBy": "58c85aaf4b47110004b11202",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1492086764/zbt6ehbzlrtggmgevr2c.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1492086764/zbt6ehbzlrtggmgevr2c.jpg",
          "etag": "01486388794fe49dea92a9fc2c42f854",
          "type": "upload",
          "bytes": 22817,
          "created_at": "2017-04-13T12:32:44.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 223,
          "width": 1117,
          "signature": "cf27b99896e67a3e3296da4014ab12d24ee43af1",
          "version": "1492086764",
          "public_id": "zbt6ehbzlrtggmgevr2c",
          "__v": 0
        },
        "_id": "58ef6fea9fc22934f8ceb03b",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-04-13T12:32:07.070Z"
      }, {
        "createdBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "image": {
          "tags": ["profile-covers"],
          "_id": "58ef72187532d100bc0f94eb",
          "createdBy": "58c85aaf4b47110004b11202",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1492087322/l7uoiddtsxltxl3tzt9v.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1492087322/l7uoiddtsxltxl3tzt9v.jpg",
          "etag": "78e69dab24aec312f776c269f9fcd9ea",
          "type": "upload",
          "bytes": 21121,
          "created_at": "2017-04-13T12:42:02.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 500,
          "width": 207,
          "signature": "b621c1db9bceffc62c0688e7891f21bb0bb9bba9",
          "version": "1492087322",
          "public_id": "l7uoiddtsxltxl3tzt9v",
          "__v": 0
        },
        "_id": "58ef72187532d100bc0f94ec",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-04-13T12:41:23.418Z"
      }]
    }, {
      "_id": "58c970ef8b3c3400044cd3c4",
      "title": "Haller",
      "residentsFeed": true,
      "discoveryFeed": false,
      "createdBy": {
        "_id": "58c96fcf8b3c3400044cd3c0",
        "email": "m196f845@ku.edu",
        "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
        "__v": 11,
        "verificationSent": "2017-03-15T16:46:08.482Z",
        "firstName": "Mahdi",
        "lastName": "Fahda",
        "major": "",
        "residence": "Oliver",
        "graduationYear": "2017",
        "bio": "What's good baby",
        "currentProfile": {
          "tags": ["profile"],
          "_id": "58d92fa8bc9179000401d9ce",
          "createdBy": "58c96fcf8b3c3400044cd3c0",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
          "etag": "49955924a0b3aa796ac166cd1569b76b",
          "type": "upload",
          "bytes": 91210,
          "created_at": "2017-03-27T15:28:39.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 750,
          "width": 750,
          "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
          "version": "1490628519",
          "public_id": "image_oarulr",
          "__v": 0
        },
        "currentCover": {
          "tags": ["profile-covers"],
          "_id": "58d9b76830c282000408b322",
          "createdBy": "58c96fcf8b3c3400044cd3c0",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
          "etag": "5575d517cf811c1c5568f045896ce12d",
          "type": "upload",
          "bytes": 28984,
          "created_at": "2017-03-28T01:07:51.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 500,
          "width": 846,
          "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
          "version": "1490663271",
          "public_id": "q0k8udtzz2nrxnm8qw7v",
          "__v": 0
        },
        "device": {
          "createdAt": "2017-06-12T16:16:41.329Z",
          "updatedAt": "2017-06-12T16:16:41.329Z"
        },
        "hometown": "",
        "interests": [],
        "blocked": [{
          "user": "592ec8daa3916e3a3802691a",
          "_id": "595256dc2bab9005f495c5c8",
          "at": "2017-06-27T13:00:12.815Z"
        }],
        "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
        "notifications": {
          "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
          "os": "ios",
          "enabled": true
        },
        "createdAt": "2017-03-15T16:46:07.685Z",
        "status": {
          "online": true,
          "lastOnline": "2017-03-15T16:46:07.682Z",
          "currentStatus": "online",
          "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
        },
        "genderPronouns": [],
        "emailVerified": true,
        "isRARequested": true,
        "RAData": {
          "verificationSent": "2017-03-27T15:29:29.037Z",
          "codeUsageCount": 1,
          "resFloor": 0,
          "inviteCode": "FAHDMAHD0"
        },
        "isRA": true,
        "id": "58c96fcf8b3c3400044cd3c0"
      },
      "isEvent": false,
      "authorResidence": "Oliver",
      "details": "Hi",
      "__v": 16,
      "deteled": false,
      "createdAt": "2017-03-15T16:50:55.614Z",
      "flagged": [{
        "actedBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "actionType": "flag",
        "actionStatus": "Pending Review",
        "_id": "58ef86037e365731f018d80a",
        "actedAt": "2017-04-13T14:06:59.453Z"
      }, {
        "actedBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "actionType": "flag",
        "actionStatus": "Pending Review",
        "_id": "58ef869114c86c3668d9dc7b",
        "actedAt": "2017-04-13T14:09:21.424Z"
      }, {
        "actedBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "actionType": "flag",
        "actionStatus": "Pending Review",
        "_id": "58ef870914c86c3668d9dc7d",
        "actedAt": "2017-04-13T14:11:21.278Z"
      }],
      "going": [],
      "starred": [{
        "actedBy": {
          "_id": "58c85cd34b47110004b11205",
          "email": "kgohel@gohaller.com",
          "password": "$2a$10$abbxZkAaRmqFM7hC8uwmxuZgwt0sH/NhfhRXtKxWQygpDUaHOj5Lu",
          "__v": 1,
          "verificationSent": "2017-03-14T21:12:51.594Z",
          "firstName": "Krutarth",
          "lastName": "Gohel",
          "major": "Finance",
          "residence": "Oliver",
          "graduationYear": "2022",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d87ad01658a40004e6b35e",
            "createdBy": "58c85cd34b47110004b11205",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
            "etag": "bc0a4f284b81783a960dc8da76d8dcf4",
            "type": "upload",
            "bytes": 90117,
            "created_at": "2017-03-27T02:37:03.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 640,
            "width": 640,
            "signature": "28e87ededf8d130e71edbe2c4a9331b731be5346",
            "version": "1490582223",
            "public_id": "image_odqn9y",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d88d0f1658a40004e6b369",
            "createdBy": "58c85cd34b47110004b11205",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
            "etag": "7a42a463ab397b68fb8f47722c5ef186",
            "type": "upload",
            "bytes": 41139,
            "created_at": "2017-03-27T03:54:54.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 375,
            "signature": "a9267fa685d74c8bc98a106f297acbb8a0fb7131",
            "version": "1490586894",
            "public_id": "xdvni1gel32xqogp2m6j",
            "__v": 0
          },
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-14T21:12:51.169Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:12:51.169Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["Him,his,he"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85cd34b47110004b11205"
        },
        "actionType": "star",
        "_id": "58d87b2f1658a40004e6b367",
        "actedAt": "2017-03-27T02:38:39.124Z"
      }, {
        "actedBy": {
          "_id": "58d9ee0174d4f70004196874",
          "email": "kgohel@ku.edu",
          "password": "$2a$10$SY17/SWe3A3mCRjR5y.aUe.PaqhiOaVQ4dPp8kvj3QLJwX97TTXb6",
          "__v": 2,
          "verificationSent": "2017-03-28T05:00:49.336Z",
          "firstName": "Abhay",
          "lastName": "Gohel",
          "major": "Business",
          "residence": "Oliver",
          "graduationYear": "2019",
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-28T05:00:49.212Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-28T05:00:49.211Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58d9ee0174d4f70004196874"
        },
        "actionType": "star",
        "_id": "58d9ef7b74d4f70004196875",
        "actedAt": "2017-03-28T05:07:07.236Z"
      }],
      "liked": [],
      "cover": [],
      "comments": [{
        "createdBy": {
          "_id": "58c85cd34b47110004b11205",
          "email": "kgohel@gohaller.com",
          "password": "$2a$10$abbxZkAaRmqFM7hC8uwmxuZgwt0sH/NhfhRXtKxWQygpDUaHOj5Lu",
          "__v": 1,
          "verificationSent": "2017-03-14T21:12:51.594Z",
          "firstName": "Krutarth",
          "lastName": "Gohel",
          "major": "Finance",
          "residence": "Oliver",
          "graduationYear": "2022",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d87ad01658a40004e6b35e",
            "createdBy": "58c85cd34b47110004b11205",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
            "etag": "bc0a4f284b81783a960dc8da76d8dcf4",
            "type": "upload",
            "bytes": 90117,
            "created_at": "2017-03-27T02:37:03.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 640,
            "width": 640,
            "signature": "28e87ededf8d130e71edbe2c4a9331b731be5346",
            "version": "1490582223",
            "public_id": "image_odqn9y",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d88d0f1658a40004e6b369",
            "createdBy": "58c85cd34b47110004b11205",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
            "etag": "7a42a463ab397b68fb8f47722c5ef186",
            "type": "upload",
            "bytes": 41139,
            "created_at": "2017-03-27T03:54:54.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 375,
            "signature": "a9267fa685d74c8bc98a106f297acbb8a0fb7131",
            "version": "1490586894",
            "public_id": "xdvni1gel32xqogp2m6j",
            "__v": 0
          },
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-14T21:12:51.169Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:12:51.169Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["Him,his,he"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85cd34b47110004b11205"
        },
        "body": "test",
        "_id": "58e1329e323f490004a54348",
        "image": null,
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-04-02T17:19:32.112Z"
      }, {
        "createdBy": {
          "_id": "58c85cd34b47110004b11205",
          "email": "kgohel@gohaller.com",
          "password": "$2a$10$abbxZkAaRmqFM7hC8uwmxuZgwt0sH/NhfhRXtKxWQygpDUaHOj5Lu",
          "__v": 1,
          "verificationSent": "2017-03-14T21:12:51.594Z",
          "firstName": "Krutarth",
          "lastName": "Gohel",
          "major": "Finance",
          "residence": "Oliver",
          "graduationYear": "2022",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d87ad01658a40004e6b35e",
            "createdBy": "58c85cd34b47110004b11205",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
            "etag": "bc0a4f284b81783a960dc8da76d8dcf4",
            "type": "upload",
            "bytes": 90117,
            "created_at": "2017-03-27T02:37:03.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 640,
            "width": 640,
            "signature": "28e87ededf8d130e71edbe2c4a9331b731be5346",
            "version": "1490582223",
            "public_id": "image_odqn9y",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d88d0f1658a40004e6b369",
            "createdBy": "58c85cd34b47110004b11205",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
            "etag": "7a42a463ab397b68fb8f47722c5ef186",
            "type": "upload",
            "bytes": 41139,
            "created_at": "2017-03-27T03:54:54.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 375,
            "signature": "a9267fa685d74c8bc98a106f297acbb8a0fb7131",
            "version": "1490586894",
            "public_id": "xdvni1gel32xqogp2m6j",
            "__v": 0
          },
          "interests": [],
          "blocked": [],
          "organizations": [],
          "notifications": {
            "enabled": true
          },
          "createdAt": "2017-03-14T21:12:51.169Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:12:51.169Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["Him,his,he"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85cd34b47110004b11205"
        },
        "body": "est",
        "_id": "58e132bd323f490004a54349",
        "image": null,
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-04-02T17:20:03.264Z"
      }, {
        "createdBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "image": {
          "tags": ["profile-covers"],
          "_id": "58fe225b2631e90af00371ff",
          "createdBy": "58c85aaf4b47110004b11202",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1493049949/cf9k9kc5ubyxpw4blr6r.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1493049949/cf9k9kc5ubyxpw4blr6r.jpg",
          "etag": "389037df3a6e349d67bb14dec59d35b3",
          "type": "upload",
          "bytes": 22817,
          "created_at": "2017-04-24T16:05:49.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 223,
          "width": 1117,
          "signature": "1393e36dde8e77c4a3dd3b26b2cf7e41dc35fe6f",
          "version": "1493049949",
          "public_id": "cf9k9kc5ubyxpw4blr6r",
          "__v": 0
        },
        "_id": "58fe225b2631e90af0037200",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-04-24T16:05:10.463Z"
      }]
    }, {
      "_id": "58c8b6130811b70004e49dbc",
      "title": "Haller",
      "residentsFeed": true,
      "discoveryFeed": false,
      "createdBy": {
        "_id": "58c85aaf4b47110004b11202",
        "email": "a033m771@ku.edu",
        "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
        "__v": 27,
        "verificationSent": "2017-03-14T21:03:43.781Z",
        "firstName": "Alex",
        "lastName": "Moser",
        "major": "Math",
        "residence": "Oliver",
        "graduationYear": "2018",
        "hometown": "Woodstock, IL",
        "bio": "Hi, there are many things right now, right? not now.....",
        "currentProfile": {
          "tags": ["profile-covers"],
          "_id": "59300ef850e4e72c382e793e",
          "createdBy": "58c85aaf4b47110004b11202",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
          "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
          "type": "upload",
          "bytes": 64875,
          "created_at": "2017-06-01T12:56:23.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 313,
          "width": 343,
          "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
          "version": "1496321783",
          "public_id": "tndijzvafvw7feppkhdy",
          "__v": 0
        },
        "device": {
          "token": "",
          "os": "android",
          "createdAt": "2017-06-12T16:19:36.720Z",
          "updatedAt": "2017-06-21T08:08:33.695Z"
        },
        "interests": [{
          "_id": "59314da55d03dd366c0f5133",
          "name": "music",
          "createdAt": "2017-06-02T11:02:29.557Z"
        }, {
          "_id": "59314da55d03dd366c0f5132",
          "name": "cooking",
          "createdAt": "2017-06-02T11:02:29.557Z"
        }, {
          "_id": "5948f25e79b5ae1830f70a43",
          "name": "Hey",
          "createdAt": "2017-06-20T09:14:06.593Z"
        }],
        "blocked": [{
          "user": "58d9ee0174d4f70004196874",
          "_id": "592fd04faa64121c34caef35",
          "at": "2017-06-01T08:29:03.489Z"
        }],
        "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
        "notifications": {
          "deviceToken": "",
          "os": "android",
          "enabled": false
        },
        "createdAt": "2017-03-14T21:03:43.633Z",
        "status": {
          "online": false,
          "lastOnline": "2017-03-14T21:03:43.631Z",
          "currentStatus": "offline",
          "activeToken": null
        },
        "genderPronouns": ["He", "His"],
        "emailVerified": true,
        "isRARequested": false,
        "RAData": {
          "verificationSent": "2017-05-25T15:05:54.594Z",
          "codeUsageCount": 0,
          "resFloor": 0,
          "inviteCode": "REZLIFET1"
        },
        "isRA": false,
        "id": "58c85aaf4b47110004b11202"
      },
      "isEvent": false,
      "authorResidence": "Oliver",
      "details": "Post post",
      "__v": 3,
      "deteled": false,
      "createdAt": "2017-03-15T03:33:39.671Z",
      "flagged": [],
      "going": [],
      "starred": [],
      "liked": [],
      "cover": [],
      "comments": [{
        "createdBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "image": {
          "tags": ["profile-covers"],
          "_id": "58fe14b42631e90af00371f7",
          "createdBy": "58c85aaf4b47110004b11202",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1493046454/ufa9h8aanx3ktdrst7ac.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1493046454/ufa9h8aanx3ktdrst7ac.jpg",
          "etag": "09adfb32700769f0d1e459cb2457929d",
          "type": "upload",
          "bytes": 22817,
          "created_at": "2017-04-24T15:07:34.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 223,
          "width": 1117,
          "signature": "0803fa15bbf778c7dda71d3cf68b855a96ba5c0a",
          "version": "1493046454",
          "public_id": "ufa9h8aanx3ktdrst7ac",
          "__v": 0
        },
        "_id": "58fe14b42631e90af00371f8",
        "starred": [],
        "flagged": [],
        "liked": [],
        "createdAt": "2017-04-24T15:06:54.121Z"
      }]
    }, {
      "_id": "58c8a2600811b70004e49dba",
      "title": "Haller",
      "residentsFeed": true,
      "discoveryFeed": false,
      "createdBy": {
        "_id": "58c85aaf4b47110004b11202",
        "email": "a033m771@ku.edu",
        "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
        "__v": 27,
        "verificationSent": "2017-03-14T21:03:43.781Z",
        "firstName": "Alex",
        "lastName": "Moser",
        "major": "Math",
        "residence": "Oliver",
        "graduationYear": "2018",
        "hometown": "Woodstock, IL",
        "bio": "Hi, there are many things right now, right? not now.....",
        "currentProfile": {
          "tags": ["profile-covers"],
          "_id": "59300ef850e4e72c382e793e",
          "createdBy": "58c85aaf4b47110004b11202",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
          "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
          "type": "upload",
          "bytes": 64875,
          "created_at": "2017-06-01T12:56:23.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 313,
          "width": 343,
          "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
          "version": "1496321783",
          "public_id": "tndijzvafvw7feppkhdy",
          "__v": 0
        },
        "device": {
          "token": "",
          "os": "android",
          "createdAt": "2017-06-12T16:19:36.720Z",
          "updatedAt": "2017-06-21T08:08:33.695Z"
        },
        "interests": [{
          "_id": "59314da55d03dd366c0f5133",
          "name": "music",
          "createdAt": "2017-06-02T11:02:29.557Z"
        }, {
          "_id": "59314da55d03dd366c0f5132",
          "name": "cooking",
          "createdAt": "2017-06-02T11:02:29.557Z"
        }, {
          "_id": "5948f25e79b5ae1830f70a43",
          "name": "Hey",
          "createdAt": "2017-06-20T09:14:06.593Z"
        }],
        "blocked": [{
          "user": "58d9ee0174d4f70004196874",
          "_id": "592fd04faa64121c34caef35",
          "at": "2017-06-01T08:29:03.489Z"
        }],
        "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
        "notifications": {
          "deviceToken": "",
          "os": "android",
          "enabled": false
        },
        "createdAt": "2017-03-14T21:03:43.633Z",
        "status": {
          "online": false,
          "lastOnline": "2017-03-14T21:03:43.631Z",
          "currentStatus": "offline",
          "activeToken": null
        },
        "genderPronouns": ["He", "His"],
        "emailVerified": true,
        "isRARequested": false,
        "RAData": {
          "verificationSent": "2017-05-25T15:05:54.594Z",
          "codeUsageCount": 0,
          "resFloor": 0,
          "inviteCode": "REZLIFET1"
        },
        "isRA": false,
        "id": "58c85aaf4b47110004b11202"
      },
      "isEvent": false,
      "authorResidence": "Oliver",
      "details": "1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7 8 9 1 2 3 4 5 6 7 8 9",
      "__v": 15,
      "deteled": false,
      "createdAt": "2017-03-15T02:09:36.498Z",
      "flagged": [],
      "going": [],
      "starred": [{
        "actedBy": {
          "_id": "58c96fcf8b3c3400044cd3c0",
          "email": "m196f845@ku.edu",
          "password": "$2a$10$jIsGBRAaNkdu5j87Qaacr.iDhGLQCtNyk4HRqbMsHsHrdUm3pPoTG",
          "__v": 11,
          "verificationSent": "2017-03-15T16:46:08.482Z",
          "firstName": "Mahdi",
          "lastName": "Fahda",
          "major": "",
          "residence": "Oliver",
          "graduationYear": "2017",
          "bio": "What's good baby",
          "currentProfile": {
            "tags": ["profile"],
            "_id": "58d92fa8bc9179000401d9ce",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490628519/image_oarulr.jpg",
            "etag": "49955924a0b3aa796ac166cd1569b76b",
            "type": "upload",
            "bytes": 91210,
            "created_at": "2017-03-27T15:28:39.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 750,
            "width": 750,
            "signature": "2659608086fcf7cf803f1b087150009a7902e8d2",
            "version": "1490628519",
            "public_id": "image_oarulr",
            "__v": 0
          },
          "currentCover": {
            "tags": ["profile-covers"],
            "_id": "58d9b76830c282000408b322",
            "createdBy": "58c96fcf8b3c3400044cd3c0",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490663271/q0k8udtzz2nrxnm8qw7v.jpg",
            "etag": "5575d517cf811c1c5568f045896ce12d",
            "type": "upload",
            "bytes": 28984,
            "created_at": "2017-03-28T01:07:51.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 500,
            "width": 846,
            "signature": "9ce996b2d4fc142367881917296c2e6022990f75",
            "version": "1490663271",
            "public_id": "q0k8udtzz2nrxnm8qw7v",
            "__v": 0
          },
          "device": {
            "createdAt": "2017-06-12T16:16:41.329Z",
            "updatedAt": "2017-06-12T16:16:41.329Z"
          },
          "hometown": "",
          "interests": [],
          "blocked": [{
            "user": "592ec8daa3916e3a3802691a",
            "_id": "595256dc2bab9005f495c5c8",
            "at": "2017-06-27T13:00:12.815Z"
          }],
          "organizations": ["58f494ef51cdad23c8674e6f", "58f4955351cdad23c8674e72", "58f495b351cdad23c8674e74", "58f495d051cdad23c8674e75", "58f4961051cdad23c8674e76"],
          "notifications": {
            "deviceToken": "cqxQrAFX8V0:APA91bE2yWXoPbOAYIdYUT2IFM6XK4O2csa1W6hwcKaFf3qVviwmLPPWrwRVurYoh02o64MF8vM4b11IkrnrcilJ0AG2rHGUaEzjyvjQ_KaORAwAq65ZKpHXVsvfw0VxZp5wY9Jmu8ua",
            "os": "ios",
            "enabled": true
          },
          "createdAt": "2017-03-15T16:46:07.685Z",
          "status": {
            "online": true,
            "lastOnline": "2017-03-15T16:46:07.682Z",
            "currentStatus": "online",
            "activeToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im0xOTZmODQ1QGt1LmVkdSIsImlhdCI6MTQ5OTY5MTg1NH0.jwHQ8gB98WHbeeGQgAmFV_kvrBR8ipiC8_jgHarmQWU"
          },
          "genderPronouns": [],
          "emailVerified": true,
          "isRARequested": true,
          "RAData": {
            "verificationSent": "2017-03-27T15:29:29.037Z",
            "codeUsageCount": 1,
            "resFloor": 0,
            "inviteCode": "FAHDMAHD0"
          },
          "isRA": true,
          "id": "58c96fcf8b3c3400044cd3c0"
        },
        "actionType": "star",
        "_id": "58c970c88b3c3400044cd3c2",
        "actedAt": "2017-03-15T16:50:16.214Z"
      }],
      "liked": [],
      "cover": [],
      "comments": []
    }, {
      "_id": "58c877daf150f60004f0c03f",
      "title": "Haller",
      "residentsFeed": true,
      "discoveryFeed": false,
      "createdBy": {
        "_id": "58c85cd34b47110004b11205",
        "email": "kgohel@gohaller.com",
        "password": "$2a$10$abbxZkAaRmqFM7hC8uwmxuZgwt0sH/NhfhRXtKxWQygpDUaHOj5Lu",
        "__v": 1,
        "verificationSent": "2017-03-14T21:12:51.594Z",
        "firstName": "Krutarth",
        "lastName": "Gohel",
        "major": "Finance",
        "residence": "Oliver",
        "graduationYear": "2022",
        "currentProfile": {
          "tags": ["profile"],
          "_id": "58d87ad01658a40004e6b35e",
          "createdBy": "58c85cd34b47110004b11205",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490582223/image_odqn9y.jpg",
          "etag": "bc0a4f284b81783a960dc8da76d8dcf4",
          "type": "upload",
          "bytes": 90117,
          "created_at": "2017-03-27T02:37:03.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 640,
          "width": 640,
          "signature": "28e87ededf8d130e71edbe2c4a9331b731be5346",
          "version": "1490582223",
          "public_id": "image_odqn9y",
          "__v": 0
        },
        "currentCover": {
          "tags": ["profile-covers"],
          "_id": "58d88d0f1658a40004e6b369",
          "createdBy": "58c85cd34b47110004b11205",
          "original_filename": "image",
          "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
          "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1490586894/xdvni1gel32xqogp2m6j.jpg",
          "etag": "7a42a463ab397b68fb8f47722c5ef186",
          "type": "upload",
          "bytes": 41139,
          "created_at": "2017-03-27T03:54:54.000Z",
          "resource_type": "image",
          "format": "jpg",
          "height": 500,
          "width": 375,
          "signature": "a9267fa685d74c8bc98a106f297acbb8a0fb7131",
          "version": "1490586894",
          "public_id": "xdvni1gel32xqogp2m6j",
          "__v": 0
        },
        "interests": [],
        "blocked": [],
        "organizations": [],
        "notifications": {
          "enabled": true
        },
        "createdAt": "2017-03-14T21:12:51.169Z",
        "status": {
          "online": false,
          "lastOnline": "2017-03-14T21:12:51.169Z",
          "currentStatus": "offline",
          "activeToken": null
        },
        "genderPronouns": ["Him,his,he"],
        "emailVerified": true,
        "isRARequested": false,
        "RAData": {
          "codeUsageCount": 0,
          "resFloor": 0,
          "inviteCode": "REZLIFET1"
        },
        "isRA": false,
        "id": "58c85cd34b47110004b11205"
      },
      "isEvent": false,
      "authorResidence": "Oliver",
      "details": "Post 2",
      "__v": 3,
      "deteled": false,
      "createdAt": "2017-03-14T23:08:10.521Z",
      "flagged": [],
      "going": [],
      "starred": [],
      "liked": [{
        "actedBy": {
          "_id": "58c85aaf4b47110004b11202",
          "email": "a033m771@ku.edu",
          "password": "$2a$10$oMBp90KtKdZ4ilcQnYXFbOsUWR3BiG2tDV.wxDPoZo68.ukNpG4yC",
          "__v": 27,
          "verificationSent": "2017-03-14T21:03:43.781Z",
          "firstName": "Alex",
          "lastName": "Moser",
          "major": "Math",
          "residence": "Oliver",
          "graduationYear": "2018",
          "hometown": "Woodstock, IL",
          "bio": "Hi, there are many things right now, right? not now.....",
          "currentProfile": {
            "tags": ["profile-covers"],
            "_id": "59300ef850e4e72c382e793e",
            "createdBy": "58c85aaf4b47110004b11202",
            "original_filename": "image",
            "secure_url": "https://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "url": "http://res.cloudinary.com/dsgcstnsx/image/upload/v1496321783/tndijzvafvw7feppkhdy.jpg",
            "etag": "c6cbbeb0ef7e4303633db13f4451a4be",
            "type": "upload",
            "bytes": 64875,
            "created_at": "2017-06-01T12:56:23.000Z",
            "resource_type": "image",
            "format": "jpg",
            "height": 313,
            "width": 343,
            "signature": "ec83228dfa4ca5b49ed263193dbd2bd0e2bb24c7",
            "version": "1496321783",
            "public_id": "tndijzvafvw7feppkhdy",
            "__v": 0
          },
          "device": {
            "token": "",
            "os": "android",
            "createdAt": "2017-06-12T16:19:36.720Z",
            "updatedAt": "2017-06-21T08:08:33.695Z"
          },
          "interests": [{
            "_id": "59314da55d03dd366c0f5133",
            "name": "music",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "59314da55d03dd366c0f5132",
            "name": "cooking",
            "createdAt": "2017-06-02T11:02:29.557Z"
          }, {
            "_id": "5948f25e79b5ae1830f70a43",
            "name": "Hey",
            "createdAt": "2017-06-20T09:14:06.593Z"
          }],
          "blocked": [{
            "user": "58d9ee0174d4f70004196874",
            "_id": "592fd04faa64121c34caef35",
            "at": "2017-06-01T08:29:03.489Z"
          }],
          "organizations": ["58f495d051cdad23c8674e75", "58f494ef51cdad23c8674e6f", "58f4961051cdad23c8674e76", "58f4959851cdad23c8674e73", "58f497d551cdad23c8674e78", "58f497fa51cdad23c8674e79"],
          "notifications": {
            "deviceToken": "",
            "os": "android",
            "enabled": false
          },
          "createdAt": "2017-03-14T21:03:43.633Z",
          "status": {
            "online": false,
            "lastOnline": "2017-03-14T21:03:43.631Z",
            "currentStatus": "offline",
            "activeToken": null
          },
          "genderPronouns": ["He", "His"],
          "emailVerified": true,
          "isRARequested": false,
          "RAData": {
            "verificationSent": "2017-05-25T15:05:54.594Z",
            "codeUsageCount": 0,
            "resFloor": 0,
            "inviteCode": "REZLIFET1"
          },
          "isRA": false,
          "id": "58c85aaf4b47110004b11202"
        },
        "actionType": "like",
        "_id": "5935829fa534d513e06b888a",
        "actedAt": "2017-06-05T16:11:10.976Z"
      }],
      "cover": [],
      "comments": []
    }];
  }

  addNewPost() {
  }

  save(model, isValid, id) {
    console.info(model, isValid);
    console.info(model.image ? model.image.files : null, isValid);
    console.info('post', this.post);
    this.closeModal(id);
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
    this.post = { details: '', image: null };
    this.comment = { details: '', image: null };
  }

  setImage(files) {
    this.post.image = files;
  }

  selectPost(index) {
    // console.info('index', index);
    this.postIndex = index;
  }

}
