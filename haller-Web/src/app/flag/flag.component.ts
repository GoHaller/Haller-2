import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Ng2PaginationModule } from 'ng2-pagination';

declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-flag',
    templateUrl: './flag.component.html',
    styleUrls: ['./flag.component.css']
})
export class FlagComponent implements OnInit {
    public section: string = 'feed';
    public sort: any = 0;
    public postIndex: number = 0;
    public posts = [];
    public postid = '';
    public success = '';
    public flagOfthree = false;
    public noFurtureAction = false;
    searchKeyword: string = '';

    skip = 0;
    limit = 10;
    beingRefresh = false;

    constructor(private postService: PostService) { }

    ngOnInit() {
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

    makeSearch() {
        this.changeSegment();
    }

    getFeeds() {
        this.postService.getFlagedData(this.section, this.sort, this.limit, this.skip, this.searchKeyword).subscribe((res: any) => {
            // console.info('getFlagedData error', res);
            if (res)
                this.posts = res;
            if (this.sort == 1) {
                this.flagOfthree = true;
            }
            else {
                this.flagOfthree = false;
            }
            if (this.sort == 3) {
                this.noFurtureAction = true;
            }
            else {
                this.noFurtureAction = false;
            }

        }, error => {
            console.info('getFlagedData error', error);
        })
    }

    flagAction(action, postId, commentId = null) {
        let obj = { action: action };
        if (commentId)
            obj['commentId'] = commentId;
        this.postService.flaggedAction(postId, obj)
            .subscribe((res: any) => {
                for (var index = 0; index < this.posts.length; index++) {
                    if (this.posts[index]._id == postId) {
                        this.posts[index] = res;
                    }
                }
                // console.info('flaggedAction error', res);
            }, error => {
                console.info('flaggedAction error', error);
            })
    }

    deletePost(postid: any) {
        swal({
            title: '',
            text: "Are you sure want to delete this post?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: 'Yes, delete it!',
            buttonsStyling: false
        }).then(() => {
            this.postService.deletePostApi(postid).subscribe((res: any) => {
                this.success = res;
                console.log("this ", this.success);
                if (this.success == "error") {
                    swal({
                        title: 'Error!',
                        text: 'Error while deleting post.',
                        type: 'error',
                        confirmButtonClass: "btn btn-success",
                        buttonsStyling: false
                    })
                } else {
                    swal({
                        title: 'Deleted!',
                        text: 'Post has been deleted.',
                        type: 'success',
                        confirmButtonClass: "btn btn-success",
                        buttonsStyling: false
                    })
                }
            });
        }, error => {
            console.info('error', error);
        })
    }

    deleteComment(postId, commentId) {
        swal({
            title: '',
            text: "Are you sure want to delete this Comment?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: 'Yes, delete it!',
            buttonsStyling: false
        }).then(() => {
            this.postService.deleteCommentApi(postId, commentId).subscribe((res: any) => {
                this.success = res;
                console.log("this ", this.success);
                if (this.success == "error") {
                    swal({
                        title: 'Error!',
                        text: 'Error while deleting post.',
                        type: 'error',
                        confirmButtonClass: "btn btn-success",
                        buttonsStyling: false
                    })
                } else {
                    swal({
                        title: 'Deleted!',
                        text: 'Comment has been deleted.',
                        type: 'success',
                        confirmButtonClass: "btn btn-success",
                        buttonsStyling: false
                    })
                }
            });
        }, error => {
            console.info('error', error);
        })
    }

    selectPost(index) {
        this.postIndex = index;
    }

    showSwalDelete(postId, commentId) {
        swal({
            title: '',
            text: "Are you sure want to delete this comment?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: 'Yes, delete it!',
            buttonsStyling: false
        }).then(() => {
            this.deleteComment(postId, commentId)
            swal({
                title: 'Deleted!',
                text: 'Comment has been deleted.',
                type: 'success',
                confirmButtonClass: "btn btn-success",
                buttonsStyling: false
            })
        });
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
        this.posts = [];
        this.getFeeds();
    }
}
