import { Injectable } from '@angular/core';
import { ModalController } from "ionic-angular";
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

import { HttpClient } from './http-client';
import { ImageFullComponent } from '../pages/image.full'
import { CloudinaryProvider } from './cloudinary.provider';

@Injectable()
export class FeedProvider {
    public userId: String = '';
    // private cloudinaryImageData: Object = {};
    // private allowedOutsideEmails = [
    //     'nptvuong2912@gmail.com', 'fines.robert@gmail.com', 'kgohel@gohaller.com',
    //     'mfahda@gohaller.com', 'appstoredemo@ku.edu'];
    constructor(public httpClient: HttpClient, public modalCtrl: ModalController, public cloudinaryProvider: CloudinaryProvider) { }

    isAdmin(email) {
        return true; //this.allowedOutsideEmails.indexOf(email) > -1;
    }

    viewFullImage(image) {
        if (image) {
            let modal = this.modalCtrl.create(ImageFullComponent, { imgeSrc: image.secure_url });
            modal.present();
        }
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

    getFeed(feedId: string) {
        return this.httpClient.get('/posts/' + feedId).map(this.httpClient.extractData);
    }

    addFeed(feedObject) {
        return Observable.create(observer => {
            if (this.cloudinaryProvider.imageLocalPath != null) {
                this.cloudinaryProvider.uploadPicture('profile-covers')
                    .then((data: any) => {
                        let cloud_response = JSON.parse(data.response);
                        cloud_response.createdBy = this.userId;
                        cloud_response.version = cloud_response.version.toString();
                        if (!feedObject['_id']) {
                            feedObject['cover'] = [cloud_response];
                            observer.next(this.createFeed(feedObject));
                        } else {
                            let body = {
                                title: feedObject['title'],
                                details: feedObject['details'],
                                cover: [cloud_response]
                            }
                            observer.next(this.updateFeed(feedObject['_id'], body));
                        }

                    }, error => {
                        console.info('cloudinary error', error);
                    })
            } else {
                if (!feedObject['_id']) {
                    observer.next(this.createFeed(feedObject));
                } else {
                    let body = {
                        title: feedObject['title'],
                        details: feedObject['details'],
                    }
                    observer.next(this.updateFeed(feedObject['_id'], body));
                }
                // observer.next(this.createFeed(feedObject));
            }
        });
    }

    private createFeed(feedObject) {
        return this.httpClient.post('/posts/', feedObject).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    updateFeed(feedId, feedObject) {
        return this.httpClient.put('/posts/' + feedId, feedObject).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    createEvent(eventObject) {
        return Observable.create(observer => {
            if (this.cloudinaryProvider.imageLocalPath != null) {
                this.cloudinaryProvider.uploadPicture('profile-covers')
                    .then((data: any) => {
                        let cloud_response = JSON.parse(data.response);
                        cloud_response.createdBy = this.userId;
                        cloud_response.version = cloud_response.version.toString();
                        eventObject['cover'] = [cloud_response];
                        observer.next(this.httpClient.post('/events/', eventObject).map(this.httpClient.extractData)
                            .catch(this.httpClient.extractError));
                    }, error => {
                        console.info('cloudinary error', error);
                    })
            } else {
                observer.next(this.httpClient.post('/events/', eventObject).map(this.httpClient.extractData)
                    .catch(this.httpClient.extractError));
            }
        });
    }

    updateEvent(eventId, eventObject) {
        return Observable.create(observer => {
            if (this.cloudinaryProvider.imageLocalPath != null) {
                this.cloudinaryProvider.uploadPicture('profile-covers')
                    .then((data: any) => {
                        let cloud_response = JSON.parse(data.response);
                        cloud_response.createdBy = this.userId;
                        cloud_response.version = cloud_response.version.toString();
                        eventObject['cover'] = [cloud_response];
                        observer.next(this.httpClient.put('/posts/' + eventId, eventObject).map(this.httpClient.extractData)
                            .catch(this.httpClient.extractError));
                    }, error => {
                        console.info('cloudinary error', error);
                    })
            } else {
                observer.next(this.httpClient.put('/posts/' + eventId, eventObject).map(this.httpClient.extractData)
                    .catch(this.httpClient.extractError));
            }
        });
    }

    deletePost(postId: String) {
        return this.httpClient.delete('/posts/' + postId).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    listByFeed(userId: String, feed: String, skip, limit, event) {
        let url = '/posts/' + userId + '/feeds/' + feed;
        if (skip > -1 && limit > -1) {
            var query = '?skip=' + skip + '&limit=' + limit + (event !== null ? '&event=' + event : '');
            url += query;
        }
        return this.httpClient.get(url).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    starFeed(feed) {
        if (feed._userStarred) {
            let starObj = feed.starred.filter(star => {
                return (star.actedBy._id == this.userId) || (star.actedBy === this.userId);
            })[0];
            return this.deleteStarPost(feed._id, starObj._id)
        } else {
            return this.starPost(feed._id, { actedBy: this.userId, actionType: 'star' })
        }
    }

    private starPost(postId: String, starObject) {
        return this.httpClient.post('/posts/' + postId + '/stars', starObject).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    private deleteStarPost(postId: String, starId: String) {
        return this.httpClient.delete('/posts/' + postId + '/stars/' + starId).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    likeFeed(feed) {
        if (feed._userLiked) {
            let starObj = feed.liked.filter(like => {
                return (like.actedBy._id == this.userId) || (like.actedBy === this.userId);
            })[0];
            return this.deleteLikePost(feed._id, starObj._id)
        } else {
            return this.likePost(feed._id, { actedBy: this.userId, actionType: 'like' })
        }
    }

    private likePost(postId: String, likeObject) {
        return this.httpClient.post('/posts/' + postId + '/likes', likeObject).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    private deleteLikePost(postId: String, likeId: String) {
        return this.httpClient.delete('/posts/' + postId + '/likes/' + likeId).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    flagPost(postId: String, flagObject) {
        return this.httpClient.post('/posts/' + postId + '/flags', flagObject).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    deleteFlagPost(postId: String, flagId: String) {
        return this.httpClient.delete('/posts/' + postId + '/flags/' + flagId).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    submitComment(feedId: String, comment: String, commentId: String = null) {
        let commentObj = {
            createdBy: this.userId,
            body: comment,
            createdAt: new Date()
        };
        if (this.cloudinaryProvider.gif['id']) {
            commentObj['giphy'] = this.cloudinaryProvider.gif;
        }
        return Observable.create(observer => {
            if (this.cloudinaryProvider.imageLocalPath) {
                this.cloudinaryProvider.uploadPicture('profile-covers')
                    .then((data: any) => {
                        let cloud_response = JSON.parse(data.response);
                        cloud_response.createdBy = this.userId;
                        cloud_response.version = cloud_response.version.toString();
                        commentObj['image'] = cloud_response;
                        if (commentId)
                            observer.next(this.editComment(feedId, commentObj, commentId));
                        else
                            observer.next(this.addComment(feedId, commentObj));
                    }, error => {
                        console.info('cloudinary error', error);
                    })
            } else {
                if (commentId)
                    observer.next(this.editComment(feedId, commentObj, commentId));
                else
                    observer.next(this.addComment(feedId, commentObj));
            }
        });

    }

    private addComment(postId: String, commentObject: Object) {
        return this.httpClient.post('/posts/' + postId + '/comments', commentObject).map(this.httpClient.extractData)
    }

    private editComment(postId: String, commentObject: Object, commentId: String) {
        return this.httpClient.put('/posts/' + postId + '/comments/' + commentId, commentObject).map(this.httpClient.extractData)
    }

    deleteComment(postId: String, commentId: String) {
        return this.httpClient.delete('/posts/' + postId + '/comments/' + commentId).map(this.httpClient.extractData)
    }

    flagComment(postId: String, commentId: String, flagObject: Object) {
        return this.httpClient.post('/posts/' + postId + '/comments/' + commentId + '/flags', flagObject).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    deleteFlagComment(postId: String, commentId: String, flagId: String) {
        return this.httpClient.delete('/posts/' + postId + '/comments/' + commentId + '/flags/' + flagId).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    likeComment(postId: String, commentId: String, flagObject: Object) {
        return this.httpClient.post('/posts/' + postId + '/comments/' + commentId + '/likes', flagObject).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    deleteLikeComment(postId: String, commentId: String, likeId: String) {
        return this.httpClient.delete('/posts/' + postId + '/comments/' + commentId + '/likes/' + likeId).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    joinEvent(postId: String, joiningObject: Object) {
        return this.httpClient.post('/events/' + postId + '/going', joiningObject).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    leaveEvent(postId: String, goingId: String) {
        return this.httpClient.delete('/events/' + postId + '/going/' + goingId).map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

    markNotificationAsRead(notiId: string, userId: string) {
        return this.httpClient.get('/notifications/' + notiId + '/users/' + userId + '/read').map(this.httpClient.extractData)
    }

    listSaved(userId) {
        return this.httpClient.get('/posts/' + userId + '/favorites')
            .map(this.httpClient.extractData)
            .catch(this.httpClient.extractError);
    }

}
