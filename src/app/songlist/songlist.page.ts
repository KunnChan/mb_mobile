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
      }
   }
    const url = "https://drive.google.com/file/d/1hnOM0z0jZ8UHon7JTa7KzC9F04NRHXig/view?usp=sharing";

    let path = null;
    if(this.platform.is("ios")){
      path = this.file.documentsDirectory;
    }else{
      path = this.file.externalDataDirectory;
    }

    path = path + 'kevin.mp3'

    this.fileTransfer.download(url, path, true, options).then(res => {
      loading.dismiss();
      this.commonService.presentInfoAlert("Download success "+ res.toURL());
    }).catch(error => {
      loading.dismiss();
      this.commonService.presentInfoAlert("Fail to Download "+ JSON.stringify(error));
    });
    
  }

}
