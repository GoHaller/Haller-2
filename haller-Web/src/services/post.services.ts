import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from 'environments/environment';

@Injectable()
export class PostService {
    private adminApiUrl: string = 'posts/admin/';
    private headers = new Headers();
    public activeToken: String;
    private userId: string = localStorage.getItem('uid');
    private cloudname: string = 'dsgcstnsx';
    private clodinaryApi: string = `https://api.cloudinary.com/v1_1/${this.cloudname}/image/upload`;

    constructor(private http: Http) {
        this.adminApiUrl = environment.ApiBaseUrl + this.adminApiUrl;
        let userInfo = localStorage.getItem('userInfo');
        this.activeToken = userInfo ? JSON.parse(userInfo).status.activeToken : '';
    }

    processFeed(post) {
        let _userLiked = post.liked.filter(l => {
            return l.actedBy._id == this.userId;
        })[0];
        post._userLiked = (_userLiked && _userLiked._id);

        let _userGoing = post.going.filter(g => {
            return g.actedBy._id == this.userId;
        })[0];
        post._userGoing = (_userGoing && _userGoing._id);

        let _userStarred = post.starred.filter(s => {
            return s.actedBy._id == this.userId;
        })[0];
        post._userStarred = (_userStarred && _userStarred._id);

        let _userFlagged = post.flagged.filter(f => {
            return f.actedBy._id == this.userId;
        })[0];
        post._userFlagged = (_userFlagged && _userFlagged._id);

        return post;
    }

    createAuthorizationHeader() {
        this.headers = new Headers();
        if (this.activeToken)
            this.headers.append('Authorization', 'Bearer:' + this.activeToken);
    }

    getFeedByResidence(residence: string, event = false, limit = 50, skip = 0) {
        this.createAuthorizationHeader()
        let q = 'limit=' + limit + '&skip=' + skip + '&event=' + event;
        return this.http.get(this.adminApiUrl + 'residence/' + residence + '?' + q, { headers: this.headers }).map(this.extractData);
    }

    cloudinaryUpload(imageData, preset = 'profile-covers') {
        return this.http.post(this.clodinaryApi, { file: imageData, upload_preset: preset }).map(this.extractData);
    }

    createPost(feedObj: any) {
        this.createAuthorizationHeader()
        return this.http.post(environment.ApiBaseUrl + 'posts', feedObj, { headers: this.headers }).map(this.extractData)
    }

    createComment(postId: string, commentObj: any) {
        this.createAuthorizationHeader()
        return this.http.post(environment.ApiBaseUrl + 'posts/' + postId + '/comments', commentObj, { headers: this.headers }).map(this.extractData)
    }

    likeFeed(feed, userId) {
        feed = this.processFeed(feed);
        if (feed._userLiked) {
            let starObj = feed.liked.filter(like => {
                return (like.actedBy._id == userId) || (like.actedBy === userId);
            })[0];
            return this.deleteLikePost(feed._id, starObj._id)
        } else {
            return this.likePost(feed._id, { actedBy: userId, actionType: 'like' })
        }
    }

    private likePost(postId: String, likeObject) {
        return this.http.post(environment.ApiBaseUrl + 'posts/' + postId + '/likes', likeObject, { headers: this.headers }).map(this.extractData)
    }

    private deleteLikePost(postId: String, likeId: String) {
        return this.http.delete(environment.ApiBaseUrl + 'posts/' + postId + '/likes/' + likeId, { headers: this.headers }).map(this.extractData)
    }

    likeComment(postId: String, commentId: String, flagObject: Object) {
        return this.http.post(environment.ApiBaseUrl + 'posts/' + postId + '/comments/' + commentId + '/likes', flagObject, { headers: this.headers }).map(this.extractData)
    }

    deleteLikeComment(postId: String, commentId: String, likeId: String) {
        return this.http.delete(environment.ApiBaseUrl + 'posts/' + postId + '/comments/' + commentId + '/likes/' + likeId, { headers: this.headers }).map(this.extractData)
    }

    private extractData(res: any) {
        return (typeof res == 'object') ? res.json() : res;
    }
}