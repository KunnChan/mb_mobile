import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CommonService } from '../services/common.service';
import { ModalController, IonFab, AlertController, Platform } from "@ionic/angular";
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';



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
    let name = "1122 _Until You _Shayne Ward _Breathless _04.17 _5.9MB.mp3"  
    let name2  = "2233 _When I Look At You _Miley Cyrus _The Time of Our Lives _04.14 _5.8MB.mp3";
    let info = this.commonService.getSongInfo(name);
    
  }

}
