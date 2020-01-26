import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicPageRoutingModule } from './music-routing.module';

import { MusicPage } from './music.page';
import { SongsComponent } from '../songs/songs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusicPageRoutingModule,
  
  ],
  entryComponents: [
    SongsComponent, MusicPage
  ],
  declarations: [SongsComponent, MusicPage]
})
export class MusicPageModule {}
