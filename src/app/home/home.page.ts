import { Component, OnInit } from '@angular/core';
import "../../app/mega.js";
import { File as MegaFile } from "../../app/mega.js";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CommonService } from '../services/common.service';

import { ModalController, IonFab, AlertController, Platform, NavParams, NavController } from "@ionic/angular";
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { SearchPage } from '../search/search.page.js';
import { SearchPageModule } from '../search/search.module.js';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  items: any[] = [
  {
    name: "AAaaaa",
    path: "asdfasdfasd"
  },
  {
    name: "BBbbbb",
    path: "asdfasdfasd"
  },
  {
    name: "CCcccc",
    path: "asdfasdfasd"
  },
  {
    name: "DDdddd",
    path: "asdfasdfasd"
  },
  {
    name: "EEdddd",
    path: "asdfasdfasd"
  },
  {
    name: "FFffff",
    path: "asdfasdfasd"
  }
];

  imageUrl = null;

  slideOpts = {
    initialSlide: 1,
    speed: 100
  };
  fileTransfer: FileTransferObject = this.transfer.create();

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

constructor(private androidPermissions: AndroidPermissions,
  private commonService: CommonService, private transfer: FileTransfer,
  private modalController: ModalController, private route: Router,
  private domSanitizer: DomSanitizer,
  private platform: Platform, private file: File) {

  }

  ngOnInit() {
    
    
  }

  logScrollStart(){
    console.log("item ");
  }

  logScrolling(event){
    console.log("item ", event);
  }

  logScrollEnd(){
    console.log("item ");
  }

  onDownload(item){
    
    let index = this.items.indexOf(item);
    this.items[index]['isOnDownloading'] = true;

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

  getWriteExternalStoragePermission(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
    .then(status => {
      if (status.hasPermission) {
      } 
      else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
          .then(status => {
            if(status.hasPermission) {
            }
          });
      }
    });
  }

  async downloadImage(item:any){

    const loading = await this.commonService.createLoading("Downloading...");
    await loading.present();

    let url = "https://mega.nz/#!U5hw1IJK!nu5H9XhTC3ZejO4mVT-NPu3F9FHyHDiio5U6MtDVyGM";

    // let path = null;
    // if(this.platform.is("ios")){
    //   path = this.file.documentsDirectory;
    // }else{
    //   path = this.file.externalDataDirectory;
    // }

    const megaFile = MegaFile.fromURL(url);

    megaFile.loadAttributes((error, megaFile) => {
      console.log("file name => ", megaFile.name) // file name
      console.log("file size => ", megaFile.size) // file size in bytes
    
      //path = path + megaFile.name;
    
      megaFile.download((err, data) => {
        if (err) throw err

        const stringChar = data.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
          }, '');

        let base64String = btoa(stringChar);
       
        
        this.imageUrl = 'data:image/jpg;base64, ' + base64String;
        loading.dismiss();
        // this.file.writeFile(path, megaFile.name, data.buffer, {replace: true, append: false})
        // .then(res => {
        //   loading.dismiss();
          
        //   this.commonService.presentInfoAlert("Download success "+ res.toURL());
        // }).catch(error => {
        //   loading.dismiss();
        //   this.commonService.presentInfoAlert("Fail to Download "+ JSON.stringify(error));
        // });
      })
    })
  }

  async downloadFile(item:any){

    const loading = await this.commonService.createLoading("Downloading...");
    await loading.present();

   // let url = "https://mega.nz/#!t8pk2SYJ!7Saoz3s5xfvsPln-8BXkqBnK48m9er_hnTg_HnjHw_k";
    let url = "https://mega.nz/#!Mxxk0azQ!I_EN0GZL3OgYwxuIePGYxFt7KcmXL-A9bQoXS3kUcDs";

    let path = null;
    if(this.platform.is("ios")){
      path = this.file.documentsDirectory;
    }else{
      path = this.file.externalDataDirectory;
    }

    const megaFile = MegaFile.fromURL(url);

    megaFile.loadAttributes((error, megaFile) => {
      console.log("file name => ", megaFile.name) // file name
      console.log("file size => ", megaFile.size) // file size in bytes
    
      //path = path + megaFile.name;
      megaFile.download((err, data) => {
        if (err) throw err

        this.file.writeFile(path, megaFile.name, data.buffer, {replace: true, append: false})
        .then(res => {
          loading.dismiss();
          
          this.commonService.presentInfoAlert("Download success "+ res.toURL());
        }).catch(error => {
          loading.dismiss();
          this.commonService.presentInfoAlert("Fail to Download "+ JSON.stringify(error));
        });
      })
    })
  }

  async goToSearch(item){
    this.route.navigate(['tabs/search', { albumId: item}]);
  }

}
