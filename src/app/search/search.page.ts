import { Component, OnInit } from '@angular/core';
import "../../app/mega.js";
import { File as MegaFile } from "../../app/mega.js";

import { AlertController, Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { File } from '@ionic-native/file/ngx';

import { SongService } from '../services/song.service';
import { AuthService } from '../services/auth.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  items: any[] = [];
  searchCriteria: string = "";
  listTitle = "";

  reqData = {
    query: null,
    page: 0,
    size: 10
  }

  playlist = []
  isLastSong: boolean = false;
  isSingleQuerySearch: boolean = true;

  constructor(private alertController: AlertController,private router: Router,
    private songService: SongService, private authService: AuthService, private file: File,
    private androidPermissions: AndroidPermissions, private platform: Platform,
    private route: ActivatedRoute) { 

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const { albumId } = params;
      if(params.albumId){
        this.getSongByAlbumId(albumId)
      }else{
        this.resetData();
        this.getSongSingleQuery(this.reqData);
      }
    });
  }

  async presentFilterPrompt() {
    const alert = await this.alertController.create({
      header: 'Search',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Title'
        },
        {
          name: 'artist',
          type: 'text',
          placeholder: 'Artist'
        },
        {
          name: 'language',
          type: 'text',
          placeholder: 'Language'
        },
        {
          name: 'info',
          type: 'text',
          placeholder: 'Chorus'
        },
      ],
      buttons: [
       {
          text: 'Ok',
          handler: (data) => {
            this.getSongByQuery(data);
          }
        }
      ]
    });

    await alert.present();
  }

  getSongByQuery(data){

    this.searchCriteria = "";
    this.searchCriteria += data.title ? data.title + ",": "";
    this.searchCriteria += data.artist ? data.artist + ",": "";
    this.searchCriteria += data.language ? data.language + ",": "";
    this.searchCriteria += data.info ? data.info + ",": "";
    
    this.resetData();
    data.page = this.reqData.page;
    data.size = this.reqData.size;
    this.reqData = data;
    this.getSongMultiQuery(data);
  }

  onClearSearchCriteria(){
    this.searchCriteria = "";
    this.onSearch();
  }

  getSongSingleQuery(reqData){

    this.isSingleQuerySearch = true;
    this.songService.getRecentlyAdded(reqData)
     .subscribe(result => {
      this.items = this.items.concat(result.content);
      this.listTitle = "Total : " + result.totalElements;
     }, error => {
        console.log("Error in getting song single query ", error);
     });
  }

  getSongMultiQuery(reqData){
    this.isSingleQuerySearch = false;
    this.songService.getSongQuery(reqData)
     .subscribe(result => {
      this.items = this.items.concat(result.content);
      this.listTitle = "Total : " + result.totalElements;
     }, error => {
        console.log("Error in getting song multi query ", error);
     });
  }

  getSongByAlbumId(albumId){
    
    this.songService.getSongByAlbumId(albumId)
     .subscribe(result => {
      this.items = result;
     }, error => {
        console.log("Error in getting song ", error);
     });
  }

  onDownload(item){
    const currentUser = this.authService.currentUserValue();
    if(currentUser.value === null || !currentUser.value.access_token){
      this.router.navigate(['tabs/login']);
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


  onSearch(){
   
    let criteria = this.searchCriteria;
    let query = "";
    if(this.searchCriteria){
      query = this.searchCriteria;
    }else{
      query = null
    }
    this.resetData();
    this.searchCriteria = criteria;
    this.reqData.query = query;
    
    this.getSongSingleQuery(this.reqData);
   
  }

  doRefresh(event) {
    this.resetData();
    this.getSongSingleQuery(this.reqData);
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  loadMore(event) {

    if(this.isLastSong)
      return;
     const { page } = this.reqData;
     this.reqData.page = page + 1;
     if(!this.isSingleQuerySearch){
      this.getSongMultiQuery(this.reqData);
     }else{
      this.getSongSingleQuery(this.reqData);
     }
     setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  resetData(){
    this.searchCriteria = "";
    this.listTitle = "";

    this.reqData = {
      query: null,
      page: 0,
      size: 10
    }

    this.isLastSong = false;
    this.isSingleQuerySearch = true;
    this.items = [];
  }

}
