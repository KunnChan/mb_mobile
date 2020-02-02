import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { SongService } from '../services/song.service';

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

  isLastSong: boolean = false;
  isSingleQuerySearch: boolean = true;

  constructor(private alertController: AlertController,
    private songService: SongService,
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
    let index = this.items.indexOf(item);
    this.items[index]['isOnDownloading'] = true;
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
