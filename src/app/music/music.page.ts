import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRange } from '@ionic/angular';
import { Howl } from "howler";
import { Storage } from '@ionic/storage';
import { ModalController, Platform } from "@ionic/angular";
import { File } from '@ionic-native/file/ngx';

import { CommonService } from '../services/common.service';
import { SongsComponent } from '../songs/songs.component';
import { Configfile } from '../configfile';

@Component({
  selector: 'app-music',
  templateUrl: './music.page.html',
  styleUrls: ['./music.page.scss'],
})
export class MusicPage implements OnInit {

  activeTrack = {
    title: 'When I Look at you',
    lyrics: `<p>
    <meta charset="utf-8">
  </p>
  <div class="PZPZlf bbVIQb" data-lyricid="Lyricfind002-1482673" style="color: rgb(34, 34, 34); font-family: arial, &quot;Noto Sans Myanmar UI&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">
    <div class="ujudUb" style="margin-bottom: 12px; line-height: 1.57;">Everybody needs inspiration
      <br>Everybody needs a song
      <br>A beautiful melody
      <br>When the night's so long
    </div>
    <div class="ujudUb" style="margin-bottom: 12px; line-height: 1.57;">'Cause there is no guarantee
      <br>That this life is easy
    </div>
    <div class="ujudUb" style="margin-bottom: 12px; line-height: 1.57;">Yeah, when my world is falling apart
      <br>When there's no light to break up the dark
      <br>That's when I, I
      <br>I look at you
    </div>
    <div class="ujudUb" style="margin-bottom: 12px; line-height: 1.57;">When the waves
      <br>Are flooding the shore and I can't
      <br>Find my way home anymore
      <br>That's when I, I
      <br>I look at you
    </div>
    <div class="ujudUb" style="margin-bottom: 12px; line-height: 1.57;">When I look at you, I see forgiveness
      <br>I see the truth
      <br>You love me for who I am
      <br>Like the stars hold the moon
      <br>Right there where they belong
      <br>And I know I'm not alone
    </div>
    <div class="ujudUb" style="margin-bottom: 12px; line-height: 1.57;">Yeah, when my world is falling apart
      <br>When there's no light to break up the dark
      <br>That's when I, I
      <br>I look at you
    </div>
  </div>
  <div class="PZPZlf bbVIQb" style="color: rgb(34, 34, 34); font-family: arial, &quot;Noto Sans Myanmar UI&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">
    <div class="ujudUb u7wWjf" data-mh="-1" style="margin-bottom: 12px; line-height: 1.57;">When the waves
      <br>Are flooding the shore and I can't
      <br>Find my way home anymore
      <br>That's when I, I
      <br>I look at you
    </div>
    <div class="ujudUb xpdxpnd" data-mh="105" data-mhc="1" style="overflow: hidden; transition: max-height 0.3s ease 0s; max-height: 105px; margin-bottom: 12px; line-height: 1.57;">You appear just like a dream to me
      <br>Just like Kaleidoscope colors that
      <br>Cover me, all I need
      <br>Every breath that I breathe
      <br>Don't you know you're beautiful?
    </div>
    <div class="ujudUb xpdxpnd" data-mh="21" data-mhc="1" style="overflow: hidden; transition: max-height 0.3s ease 0s; max-height: 21px; margin-bottom: 12px; line-height: 1.57;">Yeah, yeah, yeah</div>
    <div class="ujudUb xpdxpnd" data-mh="126" data-mhc="1" style="overflow: hidden; transition: max-height 0.3s ease 0s; max-height: 126px; margin-bottom: 12px; line-height: 1.57;">When the waves
      <br>Are flooding the shore and I can't
      <br>Find my way home anymore
      <br>That's when I, I
      <br>I look at you
      <br>I look at you
    </div>
    <div class="ujudUb WRZytc xpdxpnd" data-mh="42" data-mhc="1" style="overflow: hidden; transition: max-height 0.3s ease 0s; max-height: 42px; margin-bottom: 0px; line-height: 1.57;">You appear just like a dream
      <br>To me
    </div>
  </div>`
  };
  player: Howl  = null;
  isPlaying = false;
  progress = 0;
  songLength = "";
  songLengthInSec = 0;

  isRound = true;
  isOne = false;
  isShuffel = false;
  isLike = false;

  playlist = [];
  path = null;
  timer = '00:00';

  @ViewChild('range', {static: false}) range: IonRange;

  constructor(private storage: Storage,
    private commonService: CommonService,
    private modalController: ModalController,
    private config : Configfile,
    private platform: Platform, private file: File) {

    
  }

  ngOnInit() {

    if(this.platform.is("ios")){
      this.path = this.file.documentsDirectory;
    }else{
      this.path = this.file.externalDataDirectory;
    }
    if(this.path){
      this.onGetFiles();
    }

    this.storage.get(this.config.keyCurrentTrack)
      .then(track => {
       if(track){
        this.start(track);
        this.isPlaying = false;
        this.activeTrack = track;
       }
      })
    this.play(this.activeTrack, null);
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
   // track.path = '../../assets/music/When I Look At You.mp3';
    this.player = new Howl({
     // src : [track.path],
      src: data,
      html5: true,
      onplay: () =>{
        this.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress();
        this.updateSongLength();
        this.setCurrentTrackToStorage(track);
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
    this.songLength = this.getMinFromSecond(duration);
  }

  getMinFromSecond(second){
    let minutes = Math.floor(second / 60);
    let seconds = Math.floor(second % 60);
    let min = minutes > 9 ? minutes : '0'+minutes;
    let sec = seconds > 9 ? seconds : '0'+seconds;
    return min + ":" + sec;
  }

  updateProgress(){
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    this.timer = this.getMinFromSecond(seek);
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
        playlist : this.playlist,
        activeTrackUid: this.activeTrack['uid']
      }
    });
    modal.onDidDismiss().then(dataReturned => {
      if (dataReturned !== null && dataReturned.data.isSelected){
        this.start(dataReturned.data)
      }
        
    });
    return await modal.present();
  }

  setCurrentTrackToStorage(track){
    this.storage.set(this.config.keyCurrentTrack, track);
  }
}
