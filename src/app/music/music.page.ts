import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRange } from '@ionic/angular';
import {Howl} from "howler";

@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
export class MusicPage implements OnInit {

  activeTrack = null;
  player: Howl  = null;
  isPlaying = false;
  progress = 0;

  playlist = [
    {
      name: "Until You",
      path: "../../assets/music/Until You by Shayne Ward.mp3"
    },
    {
      name: "When I Look At You",
      path: "../../assets/music/When I Look At You.mp3"
    },
    {
      name: "Wrecking Ball",
      path: "../../assets/music/Wrecking Ball by Miley Cyrus.mp3"
    }
  ]

  @ViewChild('range', {static: false}) range: IonRange;

  constructor() {
    this.start(this.playlist[0])
   }

  ngOnInit() {
  }

  togglePlay(pause){
    this.isPlaying = !pause;
    if(pause){
      this.player.pause();
    }else{
      this.player.play();
    }
  }

  start(track){
    if(this.player){
      this.player.stop();
    }
    this.player = new Howl({
      src : [track.path],
      html5: true,
      onplay: () =>{
        this.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress();
      },
      onend: () => {
        console.log("onend");
        this.next();
      }
    })
    this.player.play();
  }

  prev(){
    let index = this.playlist.indexOf(this.activeTrack);
    if(index > 0){
      this.start(this.playlist[index - 1])
    }else{
      this.start(this.playlist[this.playlist.length - 1])
    }
  }

  next(){
    let index = this.playlist.indexOf(this.activeTrack);
    if(index != this.playlist.length - 1){
      this.start(this.playlist[index + 1])
    }else{
      this.start(this.playlist[0])
    }
  }

  seek(){
    let newValue = +this.range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }

  updateProgress(){
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 1000);
  }
}
