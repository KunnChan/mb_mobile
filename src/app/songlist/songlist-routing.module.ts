import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SonglistPage } from './songlist.page';

const routes: Routes = [
  {
    path: '',
    component: SonglistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SonglistPageRoutingModule {}
