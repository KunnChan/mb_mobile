import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRange } from '@ionic/angular';
import { Howl } from "howler";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { CommonService } from '../services/common.service';

import { ModalController, IonFab, AlertController, Platform } from "@ionic/angular";
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { SongsComponent } from '../songs/songs.component';

@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
export class MusicPage implements OnInit {

  activeTrack = {};
  player: Howl  = null;
  isPlaying = false;
  progress = 0;
  songLength = 0;

  isRound = true;
  isOne = false;
  isShuffel = false;
  isLike = false;

  playlist = []
  path = null;

  @ViewChild('range', {static: false}) range: IonRange;

  constructor(private androidPermissions: AndroidPermissions,
    private commonService: CommonService, private modalController: ModalController,
    private platform: Platform, private file: File) {

    if(this.platform.is("ios")){
      this.path = this.file.documentsDirectory;
    }else{
      this.path = this.file.externalDataDirectory;
    }

    alert("this "+ this);


    if(this.path){
      this.onGetFiles();
      if(this.playlist.length > 0){
        this.activeTrack = this.playlist[0];
      }
    }
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

    let name = track.name;

    if(this.platform.is("ios")){
      this.path = this.file.documentsDirectory;
    }else{
      this.path = this.file.externalDataDirectory;
    }
    this.file.readAsDataURL(this.path, name)
    .then(data => {
      this.play(track, data)
    }).catch(error => {
      alert("Error in reading file "+ JSON.stringify(error))
    })
  }

  play(track, data){
    this.player = new Howl({
      //src : [track.path],
      src: data,
      html5: true,
      onplay: () =>{
        this.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress();
        this.updateSongLength();
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

  updateSongLength(){
    let duration = this.player.duration();
    this.songLength = Math.round(duration / 60);
  }

  updateProgress(){
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;  
    
    setTimeout(() => {
      this.updateProgress();
    }, 1000);
  }

  onGetFiles(){

    if(this.platform.is("ios")){
      this.path = this.file.documentsDirectory;
    }else{
      this.path = this.file.externalDataDirectory;
    }

    this.file.listDir(this.path, "").then(result => {
      for(let file of result){
        if(file.isFile == true){
          // Code if its a file
          let info = this.commonService.getSongInfo(file.name);
          info['path'] = file.nativeURL;
          info['name'] = file.name;
          this.playlist.push(info);          
        }
      }
    })
  }

  onSwap(){
    if(this.isRound){
      this.isOne = true;
      this.isRound = false;
      this.isShuffel = false;
    }else if(this.isOne){
      this.isShuffel = true;
      this.isOne = false;
      this.isRound = false;
    }else{
      this.isRound = true;
      this.isOne = false;
      this.isShuffel = false;
    }
  }

  onLike(){
    this.isLike = !this.isLike;
  }

  async onOpenSongList(){
    const modal = await this.modalController.create({
      component: SongsComponent,
      componentProps: {
        playlist : this.playlist
      }
    });
    modal.onDidDismiss().then(dataReturned => {
      if (dataReturned !== null && dataReturned.data.isSelected){
        this.start(dataReturned.data)
      }
        
    });
    return await modal.present();
  }
}
