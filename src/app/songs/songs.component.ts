import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent implements OnInit {
  
  items = []

  activeTrackUid = null;

  constructor( private navParams: NavParams, private modalController: ModalController,
    ) {}

  ngOnInit() {
    this.items = this.navParams.data.playlist;
    this.activeTrackUid = this.navParams.data.activeTrackUid;
    
  }

  async closeModal() {
    const data = {isSelected: false};
    await this.modalController.dismiss(data);
  }

  async onSelect(data) {
    data.isSelected = true;
    await this.modalController.dismiss(data);
  }
}
