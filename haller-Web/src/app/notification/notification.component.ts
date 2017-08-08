import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { PostService } from '../../services/post.services';
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
    public notification:any = [];
    public title:any;
    public message:any;
    public admin: boolean = false;
    
    public posts = [];
    public postIndex: number = 0;
   
    public isNotification: boolean = true;

    skip = 0;
    limit = 10;
    beingRefresh = false;

    file: File;
    ngOnInit() {
    
        var userId =  localStorage.getItem('uid')
        this.postService.getNotification(userId).subscribe((res: any) => {
            if (res) { 
              if(res.admin){
                this.notification = res.allNotification;
                this.admin = true;
              }else{
                this.notification = res.allNotification;
              }
            }
        }, error => {
            console.log('getFeedByResidence error', error);
        })
  }

    constructor(private location: Location, private modalService: ModalService, public postService: PostService) { }
    addNotification(model, isValid, id) {
    
        if (isValid) {
            this.modalService.close(id);
            this.title   = model.title;
            this.message = model.message;
            if (this.file && this.file.size) {
                this.postService.cloudinaryUpload(this.file['result'], 'profile-covers')
                    .subscribe((res: any) => {
                        // console.info('cloudinaryUpload res', res);
                         if(id == 'notification'){this.createNotificationApi(res);}
                    }, error => {
                        console.log('cloudinaryUpload error', error);
                    });
            } else {
                 if (id == 'notification') { this.createNotificationApi(null); }
            }
        }
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
    showNotification(){
        this.modalService.open("notification"); 
    }
    
    

    createNotificationApi(cloudinaryResponse = null) {
        let notificationObj = {
            createdBy: localStorage.getItem('uid'),
            title   : this.title,
            message : this.message,
            createdAt: new Date()
        };
        if (cloudinaryResponse) {            
            cloudinaryResponse.createdBy = localStorage.getItem('uid');
            cloudinaryResponse.version = cloudinaryResponse.version.toString();
            notificationObj['file'] = cloudinaryResponse;
        }else{
            notificationObj['file'] = "";
        }
        this.postService.createNotification(notificationObj)
            .subscribe((res: any) => {
                console.log('createNotification res', res);
                this.file = null;
                this.posts[this.postIndex] = res;
            }, error => {
                console.log('createNotification error', error);
            })
    }

   

    changeSegment() {
        this.posts = [];
    }

}
