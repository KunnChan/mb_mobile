import { Component, OnInit } from '@angular/core';
import "../../app/mega.js";
import { File as MegaFile } from "../../app/mega.js";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CommonService } from '../services/common.service';
import { File } from '@ionic-native/file/ngx';
import { Router } from '@angular/router';
import { SongService } from '../services/song.service.js';
import { AuthService } from '../services/auth.service.js';
import { Platform } from '@ionic/angular';
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
  playlist = [];
  isLastAlbum = false;
  isLastSong = false;

constructor(private androidPermissions: AndroidPermissions, private platform: Platform,
  private commonService: CommonService, private songService: SongService,
  private route: Router, private authService: AuthService,private file: File) {

  }

  ngOnInit() {
    this.getAlbums(this.reqAlbum);
    this.getPopularSong(this.reqData);

    let path = null;
    if(this.platform.is("ios")){
      path = this.file.documentsDirectory;
    }else{
      path = this.file.externalDataDirectory;
    }
    if(path){
      this.onGetFiles();
    }
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

    const currentUser = this.authService.currentUserValue();
    if(currentUser.value === null || !currentUser.value.access_token){
      this.route.navigate(['tabs/login']);
      return;
    }
    
    item['isOnDownloading'] = true;
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

    let req = {
      id: item.id,
      userInfo: item.title
    }
    this.songService.getDownloadUrl(req)
      .subscribe(data => {
        if(data.downloadLinks[0].linkUrl){
          this.prepareForDownload(item, data.downloadLinks[0].linkUrl)
        }
      }, error => {
        console.log("Get song by Id error ", error);
        item['isOnDownloading'] = false;
      })
  }

  prepareForDownload(item, linkUrl){
    const megaFile = MegaFile.fromURL(linkUrl);
    
    let path = null;
    if(this.platform.is("ios")){
      path = this.file.documentsDirectory;
    }else{
      path = this.file.externalDataDirectory;
    }

    megaFile.loadAttributes((error, megaFile) => {
      console.log("file name => ", megaFile.name) // file name
      const remoteFileName = megaFile.name;
      const index = this.playlist.findIndex(li => li.name == remoteFileName);
      if(index > -1){
        // file already downloaded, no need to download again
        item['isOnDownloading'] = false;
      }else{
        megaFile.download((err, data) => {
          if (err){
            item['isOnDownloading'] = false;
            throw err
          } 
          this.file.writeFile(path, megaFile.name, data.buffer, {replace: true, append: false})
          .then(res => {
            item['isOnDownloading'] = false;
          }).catch(error => {
            item['isOnDownloading'] = false;
          });
        })
      }
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

  onGetFiles(){

    let path = null;
    if(this.platform.is("ios")){
      path = this.file.documentsDirectory;
    }else{
      path = this.file.externalDataDirectory;
    }

    this.file.listDir(path, "").then(result => {
      for(let file of result){
        if(file.isFile == true){
          let info = this.commonService.getSongInfo(file.name);
          info['path'] = file.nativeURL;
          info['name'] = file.name;
          this.playlist.push(info);          
        }
      }
    })
  }

}
