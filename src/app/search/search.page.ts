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

    this.getSongSingelQuery(this.reqData);

  }

  async presentFilterPrompt() {
    const alert = await this.alertController.create({
      header: 'Search',
      inputs: [
        {
          name: 'Title',
          type: 'text',
          placeholder: 'Title'
        },
        {
          name: 'Album',
          type: 'text',
          placeholder: 'Album'
        },
        {
          name: 'Artist',
          type: 'text',
          placeholder: 'Artist'
        },
        {
          name: 'Chorus',
          type: 'text',
          placeholder: 'Chorus'
        },
      ],
      buttons: [
       {
          text: 'Ok',
          handler: (data) => {
           // this.currentUser.query = data;
            this.bindToCriteria(data);
            //this.searchEmployee(this.currentUser);
          }
        }
      ]
    });

    await alert.present();
  }

  bindToCriteria(data){
    this.searchCriteria = "";

    this.searchCriteria += data.EnrollNumber ? data.EnrollNumber + ",": "";
    this.searchCriteria += data.EmployeeCode ? data.EmployeeCode + ",": "";
    this.searchCriteria += data.EmployeeName ? data.EmployeeName + ",": "";
    this.searchCriteria += data.Department ? data.Department + ",": "";
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

  getSongSingelQuery(reqData){
    this.songService.getRecentlyAdded(reqData)
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
    this.listTitle = "Search Result: "+ this.searchCriteria
    if(this.searchCriteria){
      this.reqData.query = this.searchCriteria;
    }else{
      this.reqData.query = null
    }
    
    this.songService.getRecentlyAdded(this.reqData)
      .subscribe(result => {
      this.items = result.content;
      }, error => {
        console.log("Error in getting song ", error);
      });
  }

}
