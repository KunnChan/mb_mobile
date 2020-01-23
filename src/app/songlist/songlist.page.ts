import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CommonService } from '../services/common.service';
import { ModalController, IonFab, AlertController, Platform } from "@ionic/angular";
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { ThrowStmt } from '@angular/compiler';



@Component({
  selector: 'app-songlist',
  templateUrl: './songlist.page.html',
  styleUrls: ['./songlist.page.scss'],
})
export class SonglistPage implements OnInit {

  listCardsAdventure = [
    {
      title: "Aaaaaa",
      imageUrl: "../../assets/album.jpg"
    },
    {
      title: "Bbbbbb",
      imageUrl: "../../assets/album.jpg"
    },
    {
      title: "Cccccc",
      imageUrl: "../../assets/album.jpg"
    },
    {
      title: "Dddddd",
      imageUrl: "../../assets/album.jpg"
    },
    {
      title: "Eeeeee",
      imageUrl: "../../assets/album.jpg"
    },
    {
      title: "Ffffff",
      imageUrl: "../../assets/album.jpg"
    },
    {
      title: "Gggggg",
      imageUrl: "../../assets/album.jpg"
    },
    {
      title: "Hhhhhh",
      imageUrl: "../../assets/album.jpg"
    }
  ]
  
  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(private androidPermissions: AndroidPermissions,
    private commonService: CommonService, private transfer: FileTransfer,
    private platform: Platform, private file: File) { }

  ngOnInit() {
  }

  async onDownload(item:any) {

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          this.downloadFile(item);
        } 
        else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
            .then(status => {
              if(status.hasPermission) {
                this.downloadFile(item);
              }
            });
        }
      });
  }

  async downloadFile(item:any){

    const loading = await this.commonService.createLoading("Downloading...");
    await loading.present();

    let options: FileUploadOptions = {
      headers: {
        "Authorization": 'Bearer ',
        "myOrigin": ""
      }
   }
    const url = "https://doc-0k-30-docs.googleusercontent.com/docs/securesc/i4957hkea5365qq8bhm8dp5hifdae9uo/3fg47a3169l2ebg7i3lclhtbahca51pr/1579773600000/17991731165352973490/17991731165352973490/1hnOM0z0jZ8UHon7JTa7KzC9F04NRHXig?e=download&authuser=0&nonce=gspmth2jvqgh0&user=17991731165352973490&hash=piqjhl1o1a336utaq5kov0ejm3i2453e";

    let path = null;
    if(this.platform.is("ios")){
      path = this.file.documentsDirectory;
    }else{
      path = this.file.externalApplicationStorageDirectory;
    }

    let test = "Application dir"+ this.file.applicationDirectory
      + " applicationStorageDirectory : " + this.file.applicationStorageDirectory
      + " cacheDirectory : " + this.file.cacheDirectory
      + " dataDirectory : " + this.file.dataDirectory
      + " externalCacheDirectory : " + this.file.externalCacheDirectory
      + " externalDataDirectory : " + this.file.externalDataDirectory
      + " externalRootDirectory : " + this.file.externalRootDirectory
      + " sharedDirectory : " + this.file.sharedDirectory
      + " syncedDataDirectory : " + this.file.syncedDataDirectory
      + " tempDirectory : " + this.file.tempDirectory
      + " applicationDirectory : " + this.file.applicationDirectory;

      alert("Test directory" +test);
    path = path + item.attach_file_name_f;

    this.fileTransfer.download(url, path, true, options).then(res => {
      loading.dismiss();
      this.commonService.presentInfoAlert("Download success "+ res.toURL());
    }).catch(error => {
      loading.dismiss();
      this.commonService.presentInfoAlert("Fail to Download "+ JSON.stringify(error));
    });
    
  }

}
