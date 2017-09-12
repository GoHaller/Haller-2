import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';
import { PostService } from '../../services/post.service';
import { Ng2PaginationModule } from 'ng2-pagination';


declare var $: any;
declare var swal: any;

@Component({
    selector: 'app-feed',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
    public post: any = {};
    public notification: any = [];
    public notificationModal: any = {};
    public title: any;
    public message: any;
    public admin: boolean = false;
    public recordStatus: boolean = false;
    public displayNotification: any = {};
    usersForNotifications: any = [];
    selectedUserList: any = [];
    userInfo: any = [];
    isCustomNotification: Boolean = false;
    toAllstudent: Boolean = false;
    selectOneRecipient: Boolean = false;


    public posts = [];
    public postIndex: number = 0;

    public isNotification: boolean = true;

    skip = 0;
    limit = 10;
    beingRefresh = false;

    file: File;
    constructor(private location: Location, private modalService: ModalService, private notificationService: NotificationService, private postService: PostService) {
        this.userInfo = localStorage.getItem('userInfo');
        this.userInfo = JSON.parse(this.userInfo);
    }

    ngOnInit() {
        this.notificationService.getUsersForNotification()
            .subscribe((res: any) => {
                // console.log('getUsersForNotification res', res);
                this.usersForNotifications = res;
                setTimeout(() => {
                    $('.selectpicker').selectpicker('refresh');
                }, 200);
            })
        this.getAllNotification();
    }

    getAllNotification() {
        this.notificationService.getNotification(this.userInfo._id).subscribe((res: any) => {
            if (res) {
                this.notification = res;
                if (res.length == 0) {
                    this.recordStatus = true;
                } else {
                    this.recordStatus = false;
                }
            }
        }, error => {
            console.log('getFeedByResidence error', error);
        })
    }

    addNotification(model, isValid, id) {
        if (isValid) {
            if (this.isCustomNotification && !this.toAllstudent && this.selectedUserList.length == 0) {
                // alert('Please select sudent from dropdown');
                this.selectOneRecipient = true;
                return;
            } else {
                this.selectOneRecipient = false;
                this.modalService.close(id);
                this.title = model.title;
                this.message = model.message;
                if (this.file && this.file.size) {
                    if (this.file.type == 'application/pdf') {
                        // Select the very first file from list
                        var fileToLoad = this.file;
                        // FileReader function for read the file.
                        var fileReader = new FileReader();
                        var base64;
                        // Onload of file read the file content
                        fileReader.onload = (fileLoadedEvent) => {
                            // console.log('fileLoadedEvent', fileLoadedEvent);
                            base64 = fileLoadedEvent.target['result'];
                            // Print data in console
                            // console.log(base64);
                            this.postService.cloudinaryUpload(base64, 'profile-covers')
                                .subscribe((res: any) => {
                                    // console.info('cloudinaryUpload res', res);
                                    if (id == 'notification') { this.createNotificationApi(res); }
                                }, error => {
                                    console.log('cloudinaryUpload error', error);
                                });
                        };
                        // Convert data to base64
                        fileReader.readAsDataURL(fileToLoad);
                    } else {
                        this.postService.cloudinaryUpload(this.file['result'], 'profile-covers')
                            .subscribe((res: any) => {
                                // console.info('cloudinaryUpload res', res);
                                if (id == 'notification') { this.createNotificationApi(res); }
                            }, error => {
                                console.log('cloudinaryUpload error', error);
                            });
                    }
                } else {
                    if (id == 'notification') { this.createNotificationApi(null); }
                }
            }
        }
    }

    checkFileIfImageToDisplay(url) {
        console.log(url.endsWith('.pdf'));
        return !url.endsWith('.pdf');
    }

    save(model, isValid, id) {
        this.closeModal(id);
    }


    closeModal(id: string) {
        this.modalService.close(id);
        this.file = null;
        this.post = { details: '', image: null };

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
        // console.log(this.file);
    }

    removeImage() {
        this.file = null;
    }

    selectPost(index) {
        this.postIndex = index;
    }


    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }
    showNotification() {
        this.notificationModal = {};
        $('#rm-notification-img').click();
        this.modalService.open("notification");
    }

    createNotificationApi(cloudinaryResponse = null) {
        let notificationObj = {
            createdBy: localStorage.getItem('uid'),
            title: this.title,
            message: this.message,
            createdAt: new Date(),
            isCustom: this.isCustomNotification
        };
        if (!this.toAllstudent && this.selectedUserList.length > 0) {
            notificationObj['recipients'] = this.selectedUserList;
        }
        if (cloudinaryResponse) {
            cloudinaryResponse.createdBy = localStorage.getItem('uid');
            cloudinaryResponse.version = cloudinaryResponse.version.toString();
            notificationObj['file'] = cloudinaryResponse;
        } else {
            notificationObj['file'] = "";
        }
        this.notificationService.createNotification(notificationObj)
            .subscribe((res: any) => {
                // console.log('createNotification res', res);
                this.file = null;
                // this.userInfo = [];
                this.isCustomNotification = false;
                this.toAllstudent = false;
                setTimeout(() => {
                    $('.selectpicker').selectpicker('refresh');
                }, 200);
                // this.posts[this.postIndex] = res;
                this.getAllNotification();
            }, error => {
                console.log('createNotification error', error);
            })
    }

    changeSegment() {
        this.posts = [];
    }

    openPopToDIsplay(item) {
        this.displayNotification = item;
        this.modalService.open("display-notification");
    }

}
