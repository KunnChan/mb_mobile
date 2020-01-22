import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SonglistPageRoutingModule } from './songlist-routing.module';

import { SonglistPage } from './songlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SonglistPageRoutingModule
  ],
  declarations: [SonglistPage]
})
export class SonglistPageModule {}
