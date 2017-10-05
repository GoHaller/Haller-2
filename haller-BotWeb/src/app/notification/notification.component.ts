import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';
import { PostService } from '../../services/post.service';

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
    searchText: string = '';
    usersForNotifications: any = [];
    selectedUserList = [];
    selectedResidense: string = '';
    userInfo: any = [];
    isCustomNotification: Boolean = false;
    toAllstudent: Boolean = false;
    selectOneRecipient: Boolean = false;

    public residenceListForSearch = [
        { name: 'All Residence', value: '' },
        { name: 'Oliver Hall', value: 'Oliver Hall' },
        { name: 'Scholarship Hall', value: 'Scholarship Hall' },
        { name: 'Oswald/Self Hall', value: 'Oswald/Self Hall' },
        { name: 'Ellsworth Halls', value: 'Ellsworth Halls' },
        { name: 'Downs Hall', value: 'Downs Hall' }
    ];

    public posts = [];
    public postIndex: number = 0;

    public isNotification: boolean = true;

    skip = 0;
    limit = 10;
    beingRefresh = false;

    file: File;
    constructor(private location: Location, private modalService: ModalService,
        private notificationService: NotificationService, private postService: PostService) {
        this.userInfo = localStorage.getItem('adminInfo');
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
        document.getElementById('requestloader').removeAttribute("class");
        document.getElementById('requestloader').setAttribute('class','overlayblock');
        if (isValid) {
            if (!this.toAllstudent && this.selectedUserList.length == 0) {
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

    // select-resicense
    changeCustomNotification() {
        console.log('this.isCustomNotification', this.isCustomNotification);
        if (this.isCustomNotification) {
            // $('#select-resicense').selectpicker('refresh');
            setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
            }, 200);
        }
    }

    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }
    showNotification() {
        this.searchText = "";
        this.notificationModal = {};
        this.selectedUserList = [];
        this.selectOneRecipient = false;
        $('#rm-notification-img').click();
        this.modalService.open('notification');
    }

    createNotificationApi(cloudinaryResponse = null) {
        debugger;
        let notificationObj = {
            createdBy: localStorage.getItem('adminid'),
            title: this.title,
            message: this.message,
            createdAt: new Date(),
            isCustom: this.isCustomNotification,
            residence: this.selectedResidense
        };
        if (!this.toAllstudent && this.selectedUserList.length > 0) {
            notificationObj['recipients'] = this.selectedUserList.map(ele => { return ele._id });
        }
        if (cloudinaryResponse) {
            cloudinaryResponse.createdBy = localStorage.getItem('adminid');
            cloudinaryResponse.version = cloudinaryResponse.version.toString();
            notificationObj['file'] = cloudinaryResponse;
        } else {
            notificationObj['file'] = '';
        }
        // console.log('notificationObj', notificationObj);
        this.notificationService.createNotification(notificationObj)
            .subscribe((res: any) => {
                   document.getElementById('requestloader').removeAttribute("class");
        document.getElementById('requestloader').setAttribute('class','overlaynone');
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

    selectUserForNotification(user) {
        this.selectedUserList.push(user);
         this.searchText = "";
    }

    removeSelectedUser(index) {
        this.selectedUserList.splice(index, 1);
        return false;
    }

}

@Pipe({
    name: "peersearch",
    pure: false
})
export class PeerFilterPipe implements PipeTransform {
    transform(items: any, conditions: string[]): any {
        return items.filter(item => {
            if (item[conditions[0]]) {
                if (conditions[4]) {
                    if (conditions[4].indexOf(item) > -1) { return false; }
                }
                if (conditions[3] && item['residence'].toUpperCase() != conditions[3].toUpperCase()) {
                    return false;
                }
                if (conditions[2] && conditions[2].length > 0) {
                    let name = item[conditions[0]] + ' ' + item[conditions[1]];
                    if (name.toUpperCase().startsWith(conditions[2].toUpperCase())) {
                        return true;
                    } else { return false; }
                } else { return false; }
            } else { return false; }
        });
    };
}
