import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { PostService } from '../../services/post.service';
import { Ng2PaginationModule } from 'ng2-pagination';


declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-feed',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

    public isEvent: boolean = false;
    public clearList: boolean = false;
    public post: any = {};
    public comment: any = {};
    public detail: any;
    public posts = [];
    public postIndex: number = 0;
    public residence: string = 'Oliver';
    public userInfo: any = {};
    public isCampus: boolean = false;
    public selectedResidence: string = '';
    searchKeyword: string = '';
    public residenceList = [{ name: 'Oliver Hall', value: 'Oliver' }, { name: 'Scholarship Hall', value: 'Scholarship Hall' }, { name: 'Oswald/Self Hall', value: 'Self Hall' }, { name: 'Ellsworth Halls', value: 'Ellsworth Halls' }, { name: 'Downs Hall', value: 'Downs Hall' }, { name: 'Campus', value: 'Campus' }];
    public residenceListForPost = [{ name: 'Oliver Hall', value: 'Oliver' }, { name: 'Scholarship Hall', value: 'Scholarship Hall' }, { name: 'Oswald/Self Hall', value: 'Self Hall' }, { name: 'Ellsworth Halls', value: 'Ellsworth Halls' }, { name: 'Downs Hall', value: 'Downs Hall' }];

    skip = 0;
    limit = 10;
    beingRefresh = false;

    file: File;
    ngOnInit() {

    }
    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.value === c2.value : c1 === c2;
    }

    ngAfterViewInit() {
        // console.info('posts', this.posts);
        $('.comment-section').perfectScrollbar();
        this.getFeeds();
        if ($(".selectpicker").length != 0) {
            $(".selectpicker").selectpicker();
            setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
            }, 200);
        }
        $('.ps-container').on('scroll', () => {
            let btm = $($('.ps-container .ps-scrollbar-y')[2]).css('bottom');
            if (parseInt(btm) < 20) {
                if (this.posts.length == (this.skip + this.limit) && this.beingRefresh == false) {
                    this.skip = this.skip + this.limit;
                    this.beingRefresh = true;
                    this.getFeeds();
                }
            }
        })
    }
    constructor(private location: Location, private modalService: ModalService, public postService: PostService) {
        let title = this.location.prepareExternalUrl(this.location.path());
        this.isEvent = title.indexOf('event') > -1;
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        //Campus
        this.selectedResidence = this.userInfo['role'] == 'admin' ? 'Campus' : this.userInfo['residence'];

    }

    save(model, isValid, id) {
        this.closeModal(id);
    }

    openModal(id: string) {
        this.modalService.open(id);
        setTimeout(() => {
            // console.info("$('.datetimepicker')", $('.datetimepicker').length);
            if ($('.datetimepicker').length) {
                $('.datetimepicker').datetimepicker({
                    icons: {
                        time: "fa fa-clock-o",
                        date: "fa fa-calendar",
                        up: "fa fa-chevron-up",
                        down: "fa fa-chevron-down",
                        previous: 'fa fa-chevron-left',
                        next: 'fa fa-chevron-right',
                        today: 'fa fa-screenshot',
                        clear: 'fa fa-trash',
                        close: 'fa fa-remove',
                        done: 'fa fa-check'
                    }
                });
            }

        }, 500);
    }

    closeModal(id: string) {
        this.modalService.close(id);
        this.file = null;
        this.post = { details: '', image: null };
        this.comment = { details: '', image: null };
    }

    setImage(files) {
        this.post.image = files;
    }

    handleInputFile(event: EventTarget) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;
        this.file = files[0];
        this.post['image'] = this.file['result'];
    }

    removeImage() {
        this.file = null;
    }

    selectPost(index) {
        this.postIndex = index;
    }

    makeSearch() {
        this.changeSegment();
    }

    getFeeds() {
        var userId = localStorage.getItem('uid');
        this.postService.getFeedByResidence(userId, this.residence, this.isEvent, this.limit, this.skip, this.searchKeyword).subscribe((res: any) => {
            if (res) {
                if (this.clearList) { this.posts = res; this.clearList = false; }
                else this.posts = this.posts.concat(res);
                this.beingRefresh = false;
            }
        }, error => {
            console.log('getFeedByResidence error', error);
        })
    }

    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }


    addPost(model, isValid, id) {
        if (isValid) {
            this.modalService.close(id);
            this.detail = model.details;

            if (this.file && this.file.size) {
                this.postService.cloudinaryUpload(this.file['result'], 'profile-covers')
                    .subscribe((res: any) => {
                        // console.info('cloudinaryUpload res', res);
                        if (id == 'new-feed-form') { this.createPostToApi(res); }
                        else if (id == 'new-feed-comment-form') { this.createCommentApi(res); }

                    }, error => {
                        console.log('cloudinaryUpload error', error);
                    });
            } else {
                if (id == 'new-feed-form') { this.createPostToApi(null); }
                else if (id == 'new-feed-comment-form') { this.createCommentApi(null); }

            }
        }
    }

    createPostToApi(cloudinaryResponse = null) {
        let feedObject = {};
        if (cloudinaryResponse) {
            cloudinaryResponse.createdBy = localStorage.getItem('uid');
            cloudinaryResponse.version = cloudinaryResponse.version.toString();
            feedObject['cover'] = [cloudinaryResponse];
        }
        feedObject['createdAt'] = new Date();
        feedObject['createdBy'] = localStorage.getItem('uid');
        feedObject['title'] = this.isEvent ? this.post.title : 'Haller';
        feedObject['authorResidence'] = this.userInfo['role'] == 'staff' ? this.userInfo['residence'] : this.selectedResidence; //'University';
        feedObject['discoveryFeed'] = this.isCampus;
        feedObject['residentsFeed'] = !this.isCampus;
        feedObject['details'] = this.detail;
        feedObject['isEvent'] = this.isEvent;
        if (this.isEvent) {
            feedObject['date'] = $('#eventDate').data("DateTimePicker").date()._d;
            feedObject['location'] = this.post.location;
            // feedObject['title'] = this.post.title;
        }
        this.postService.createPost(feedObject)
            .subscribe((res: any) => {
                this.file = null;
                this.clearList = true;
                // this.posts = [];
                this.post.detail = '';
                this.getFeeds();
            }, error => {
                console.log('error', error);
            });
    }

    createCommentApi(cloudinaryResponse = null) {
        let commentObj = {
            createdBy: localStorage.getItem('uid'),
            body: this.detail,
            createdAt: new Date()
        };

        if (cloudinaryResponse) {
            cloudinaryResponse.createdBy = localStorage.getItem('uid');
            cloudinaryResponse.version = cloudinaryResponse.version.toString();
            commentObj['image'] = cloudinaryResponse;
        }

        this.postService.createComment(this.posts[this.postIndex]._id, commentObj)
            .subscribe((res: any) => {
                this.file = null;
                this.posts[this.postIndex] = res;
            }, error => {
                console.log('createComment error', error);
            })
    }

    likePost(feed) {
        this.postService.likeFeed(feed, localStorage.getItem('uid'))
            .subscribe((res: any) => {
                let index = this.posts.indexOf(feed);
                this.posts[index] = res;
            }, error => {
                console.log('likeFeed error', error);
            });
    }

    likeComment(comment) {
        let userId = localStorage.getItem('uid');
        let flagObj = comment.liked.filter(like => { return (like.actedBy._id == userId) || (like.actedBy === userId); })[0];
        if (flagObj) {
            this.postService.deleteLikeComment(this.posts[this.postIndex]['_id'], comment['_id'], flagObj['_id'])
                .subscribe((res: any) => {
                    this.posts[this.postIndex] = this.postService.processFeed(res);
                }, error => {
                    console.log('deleteLikeComment error', error);
                });
        } else {
            this.postService.likeComment(this.posts[this.postIndex]['_id'], comment['_id'], { actedBy: userId, actionType: 'like' })
                .subscribe((res: any) => {
                    this.posts[this.postIndex] = this.postService.processFeed(res);
                }, error => {
                    console.log('likeComment error', error);
                });
        }
    }

    changeSegment() {
        this.skip = 0;
        this.clearList = true;
        // this.posts = [];
        this.getFeeds();
    }

    processPosts(posts) {
        return posts.filter(post => {
            return post.createdBy && post.createdBy.firstName;
        })
    }

}
