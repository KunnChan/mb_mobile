import { Component, OnInit } from '@angular/core';
import "../../app/mega.js";
import { File as MegaFile } from "../../app/mega.js";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CommonService } from '../services/common.service';

import { ModalController, IonFab, AlertController, Platform, NavParams, NavController } from "@ionic/angular";
import { File } from '@ionic-native/file/ngx';
import { Router } from '@angular/router';
import { SongService } from '../services/song.service.js';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  albums: any[] = [];
  items: any[] = [];

  imageUrl = null;

  slideOpts = {
    initialSlide: 1,
    speed: 100
  };

  reqData = {
    query: null,
    page: 0,
    size: 10
  }

  reqAlbum = {
    query: null,
    page: 0,
    size: 10
  }

  isLastAlbum = false;
  isLastSong = false;

constructor(private androidPermissions: AndroidPermissions,
  private commonService: CommonService, private songService: SongService,
  private modalController: ModalController, private route: Router,
  private platform: Platform, private file: File) {

  }

  ngOnInit() {
    this.getAlbums(this.reqAlbum);
    this.getPopularSong(this.reqData);
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
    
    item['isOnDownloading'] = true;
    this.downloadFile(item);
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

    let req = {
      id: item.id,
      userInfo: "Just info, will be update in future"
    }
    this.songService.getDownloadUrl(req)
      .subscribe(item => {
        if(item.downloadLinks[0].linkUrl)
        loading.dismiss();
      }, error => {
        console.log("Get song by Id error ", error);
      })

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
    this.route.navigate(['tabs/search', { albumId: item.id}]);
  }

  getAlbums(reqData){
    this.songService.getAlbums(reqData)
     .subscribe(result => {
       this.isLastAlbum = result.last;
      this.albums = this.albums.concat(result.content);
     }, error => {
        console.log("Error in getting albums ", error);
     });
  }

  getMoreAlbums(){
    let { page } = this.reqAlbum;
    this.reqAlbum.page = page + 1;
    this.getAlbums(this.reqAlbum);
  }

  getPopularSong(reqData){
    this.songService.getPopular(reqData)
     .subscribe(result => {
      this.items = this.items.concat(result.content);
      this.isLastSong = result.last;
     }, error => {
        console.log("Error in getting song ", error);
     });
  }

  doRefresh(event) {
    this.reqAlbum.page = 0;
    this.reqAlbum.size = 10;
    this.reqData.page = 0;
    this.reqData.size = 10;

    this.albums = [];
    this.items = [];
    this.getAlbums(this.reqAlbum);
    this.getPopularSong(this.reqAlbum);
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  loadMore(event) {

    if(this.isLastSong)
      return;
     const { page } = this.reqData;
     this.reqData.page = page + 1;
     this.getPopularSong(this.reqData);
     setTimeout(() => {
      event.target.complete();
    }, 500);
  }

}
