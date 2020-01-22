import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions  } from '@ionic-native/Camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { CommonService } from 'src/app/services/common.service';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Configfile } from '../configfile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  currentUser:any = {};
  profilePicture:any = "";
  isProfilePhotoExist = false;
  private frm: FormGroup;
  file: any = false;
  fileName:string = "";
  fontClass = "";
  sysFont:string = "zg";

  croppedImagepath:any = "";
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  constructor(private service: ProfileService, private commonService: CommonService,
    private storage: Storage,private config: Configfile, private camera: Camera,
    private crop: Crop, public actionSheetController: ActionSheetController,
    private imgFile: File,private transfer: FileTransfer) {

    this.frm = new FormGroup({
      userId: new FormControl("",Validators.compose([])),
      username: new FormControl("", Validators.compose([])),
      name: new FormControl("", Validators.compose([])),
      dob: new FormControl({value: ""}, Validators.compose([])),
      email: new FormControl("", Validators.compose([])),
      phone: new FormControl("", Validators.compose([])),
    });
  }
  
  ionViewDidEnter(){
    // Promise.all([
    //   this.storage.get(this.config.keyToken),
    //   this.storage.get(this.config.keyServiceUrl)
    // ]).then(values => {
    //   this.currentUser.accessToken = values[0].access_token;
    //   this.currentUser.serviceUrl = values[1];
    //   this.sysFont = values[0].sysFont;
    //   this.getEmpReqData(this.currentUser);
    // }).catch(err => console.error(err));
  }

  async getEmpReqData(reqData){
    const loading = await this.commonService.createLoading("Fetching...")
    await loading.present();

    try {
      // this.service.getEmpProfileData(reqData)
      // .then(async res =>{
      //   try {
      //     const data = await res.data[0];
      //     this.currentUser.empId = data.employee_id_f;
      //     this.fetchProfilePhoto(this.currentUser);
      //     this.bindToFields(data);
      //   } catch (error) {
      //     console.error(error);
      //   }
      //   await loading.dismiss();
      // })
    } catch (error) {
      console.error(error);
      await loading.dismiss();
    }
  }

  bindToFields(item){
    if(item){
      this.frm.get("userId").setValue(item.id);
      this.frm.get("name").setValue(item.name);
      this.frm.get("username").setValue(item.username);
      this.frm.get("dob").setValue(item.dob_f);
      this.frm.get("email").setValue(item.email_f);
      this.frm.get("phone").setValue(item.phone_f);
    }
  }

  fetchProfilePhoto(reqData){
    // this.service.getEmpProfilePhoto(reqData)
    // .subscribe(res =>{
    //   this.profilePicture = res;
    //   this.croppedImagepath = res;
    //   this.isProfilePhotoExist = true;
    // }, err => {
    //   this.isProfilePhotoExist = false;
    // })
  }

  onFileChange($event) : void {
    this.file = $event.target.files[0];
    this.fileName = this.file.name;
  }
  
  async submit() {
    const frmVal = this.frm.value;
    const loading = await this.commonService.createLoading("Saving...");
    await loading.present();

    frmVal.accessToken = this.currentUser.accessToken;
    frmVal.serviceUrl = this.currentUser.serviceUrl;
    // this.service.updateProfile(frmVal).subscribe(async res =>{
    //   if(res.data === true){
    //     // if(this.file){
    //     //   this.updateProfilePhoto(this.currentUser);
    //     // }
    //     await this.commonService.presentInfoAlert('Successfully saved');
    //   }else{
    //     await this.commonService.presentInfoAlert(res.data);
    //   }
    //   await loading.dismiss();
    // }, async error => {
    //   console.error("updateProfile, error ",error);
    //   await loading.dismiss();
    // })
  }

  updateProfilePhoto(reqData){
    reqData.file = this.file;
    // this.service.uploadProfilePhoto(reqData)
    //   .subscribe(res => {
    //     console.log("upload profile photo successful");
    //     this.fetchProfilePhoto(this.currentUser);
    //   })

    // this.service.uploadProfileLoginPhoto(reqData)
    // .subscribe(res => {
    //   console.log("upload profile photo successful");
    //   this.fetchProfilePhoto(this.currentUser);
    // })
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.cropImage(imageData)
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 50 })
      .then(newPath => {
         
          this.showCroppedImage(newPath.split('?')[0]);
          let fileName = this.getFileName(newPath.split('?')[0]);
          const token = this.currentUser.accessToken;

          this.currentUser.fileName = fileName;
       //   let url = this.service.getUploadProfilePhotoUrl(this.currentUser);
      //    let loginPhotoUrl = this.service.uploadProfileLoginPhotoUrl(this.currentUser);

          const fileTransfer: FileTransferObject = this.transfer.create();
          const uploadOpts: FileUploadOptions = {
             fileKey: 'file',
             fileName: fileName,
             headers: {
              "Authorization": 'Bearer '+ token,
              "myOrigin": ""
             }
          };
          
          //photo in profile page
          // fileTransfer.upload(newPath, url, uploadOpts)
          //  .then(async data => {
          //   await this.commonService.presentInfoAlert('Successfully uploaded');
          //  })
          // .catch( async error => await this.commonService.presentInfoAlert('Error Upload '+ JSON.stringify(error)));

          //photo in dashboard page
          // fileTransfer.upload(newPath, loginPhotoUrl, uploadOpts)
          // .then(async data => {
          //   //await this.commonService.presentInfoAlert('Successfully uploaded');
          // })
          // .catch( async error => await this.commonService.presentInfoAlert('Error Upload Login photo '+ JSON.stringify(error)));
        },
        error => {
          alert('Error cropping image' + error);
        }
      );
  }

  getFileName(ImagePath): string{
    var splitPath = ImagePath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    return imageName;
  }

  showCroppedImage(ImagePath) {
    this.isLoading = true;
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];

    this.imgFile.readAsDataURL(filePath, imageName).then(base64 => {
      this.croppedImagepath = base64;
      this.isLoading = false;
      this.isProfilePhotoExist = true;
    }, error => {
      alert('Error in showing image' + error);
      this.isLoading = false;
    });
  }

}
