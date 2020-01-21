import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 100
  };

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

  logScrollStart(){
    console.log("item ");
  }

  logScrolling(event){
    console.log("item ", event);
  }

  logScrollEnd(){
    console.log("item ");
  }

}
