import { Injectable } from '@angular/core';
import { Events, ActionSheetController, ToastController } from 'ionic-angular';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Camera } from '@ionic-native/camera';
import 'rxjs/add/operator/map';

@Injectable()
export class CloudinaryProvider {
    constructor(public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController,
        private camera: Camera, private event: Events, private transfer: Transfer) { }

    public imageLocalPath: string = null;
    private cloudname: string = 'dsgcstnsx';
    private clodinaryApi: string = `https://api.cloudinary.com/v1_1/${this.cloudname}/image/upload`;
    // public gif: Object = { id: '', still: {}, gif: {} };
    public gif: Object = {};

    public pictureFromPhotoLibrary() {
        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
    }

    public pictureFromCamera() {
        this.takePicture(this.camera.PictureSourceType.CAMERA);
    }

    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Load from Library',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                }
                // {
                //     text: 'Cancel',
                //     role: 'cancel'
                // }
            ]
        });
        actionSheet.present();
    }

    public takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        // Get the data of an image
        this.camera.getPicture(options).then((imagePath) => {
            // Special handling for Android library
            this.imageLocalPath = imagePath;
            this.event.publish('image-loaded');
        }, (err) => {
            console.info('err', err);
            this.presentToast('Error while selecting image.');
        });
    }

    public takePictureFromCamera() {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            allowEdit:true,
            sourceType: this.camera.PictureSourceType.CAMERA,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        // Get the data of an image
        return this.camera.getPicture(options);
    }

    public takePictureFromLibrary() {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            allowEdit:true,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        // Get the data of an image
        return this.camera.getPicture(options);
    }

    public uploadPicture(preset) {
        const fileTransfer: TransferObject = this.transfer.create();
        let uploadOptions = {
            params: { 'upload_preset': preset }
        };
        return fileTransfer.upload(this.imageLocalPath, this.clodinaryApi, uploadOptions)
        // .then((data: any) => {
        //     this.cloudinaryImageData = data;
        // }, error => {
        //     console.info('cloudinary error', error);
        // })
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
}