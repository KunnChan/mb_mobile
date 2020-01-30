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
  listTitle = "Recently Added";

  reqData = {
    query: null,
    page: 0,
    size: 10
  }

  constructor(private alertController: AlertController,
    private songService: SongService,
    private route: ActivatedRoute) { 

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log('Params: ', params);
    });

    this.getSongSingleQuery(this.reqData);

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
          name: 'album',
          type: 'text',
          placeholder: 'Album'
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
    this.searchCriteria += data.album ? data.album + ",": "";
    this.searchCriteria += data.artist ? data.artist + ",": "";
    this.searchCriteria += data.language ? data.language + ",": "";
    this.searchCriteria += data.info ? data.info + ",": "";
    
    data.page = this.reqData.page;
    data.size = this.reqData.size;
    this.songService.getSongQuery(data)
      .subscribe(result => {
      this.items = result.content;
      this.listTitle = "Total Resuls : " + result.totalElements;

      }, error => {
        console.log("Error in getting song ", error);
      });
  }

  onClearSearchCriteria(){
    this.searchCriteria = "";
    this.onSearch();
  }

  async getGetEmployee(employee: any){
    // const loading = await this.commonService.createLoading("Fetching...");
    // await loading.present();

    // this.service.getEmployees(employee).subscribe(async res =>{
    //   this.items = res.data[0];
    //   this.searchItems = this.items;
    //   this.employeeCount =  res.data[1][0] ? res.data[1][0].totalrecord : 0;
    // }, async error => {
    //   await this.commonService.presentErrorToast(error)
    // },async () => await loading.dismiss())
  }

  loadData(event) {
  //  const { curRow, pageSize } = this.currentUser;
 //   this.currentUser.curRow = curRow + pageSize; 
    // this.service.filterEmployee(this.currentUser).subscribe(res =>{
    //   this.items = this.items.concat(res.data[0]);
    //   this.searchItems = this.items;

    //   event.target.complete();

    // }, async error => {
    //   console.error("getLeaveRequests, error ",error);
    // })
   // this.pageComplete = event.target;
    // if (this.items.length >= this.employeeCount) {
    //   event.target.disabled = true;
    // }
  }

  getSongSingleQuery(reqData){
    this.songService.getRecentlyAdded(reqData)
     .subscribe(result => {
      this.items = result.content;
     }, error => {
        console.log("Error in getting song ", error);
     });
  }

  getSongMultiQuery(reqData){
    this.songService.getSongQuery(reqData)
     .subscribe(result => {
      this.items = result.content;
     }, error => {
        console.log("Error in getting song ", error);
     });
  }

  onDownload(item){
    let index = this.items.indexOf(item);
    this.items[index]['isOnDownloading'] = true;
  }

  onSearch(){
    if(this.searchCriteria){
      this.reqData.query = this.searchCriteria;
    }else{
      this.reqData.query = null
    }
    
    this.songService.getRecentlyAdded(this.reqData)
      .subscribe(result => {
      this.items = result.content;
      this.listTitle = "Total Resuls : " + result.totalElements;

      }, error => {
        console.log("Error in getting song ", error);
      });
  }

}
