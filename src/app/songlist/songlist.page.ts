import { Component, OnInit } from '@angular/core';

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
  
  constructor() { }

  ngOnInit() {
  }

}
