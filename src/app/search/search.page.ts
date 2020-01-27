import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  items: any[] = [];
  searchItems: any[] = [];
  searchCriteria: string = "";
  currentUser:any;
  listTitle = "Recently Added";

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

  constructor(private alertController: AlertController,
     private router: Router, private route: ActivatedRoute) { 

  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log('Params: ', params);
    });
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
            this.currentUser.query = data;
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
    this.getGetEmployee(this.currentUser);
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
    const { curRow, pageSize } = this.currentUser;
    this.currentUser.curRow = curRow + pageSize; 
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

  onDownload(item){
    let index = this.listCardsAdventure.indexOf(item);
    this.listCardsAdventure[index]['isOnDownloading'] = true;
  }

  onSearch(){
    this.listTitle = "Search Result for "+ this.searchCriteria
  }

}
