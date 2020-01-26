import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private toast: ToastController, 
    private loadingController: LoadingController,
    private alertController: AlertController) {}

  async presentToast(message:string) {
    const toast = await this.toast.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }

  async presentErrorToast(error) {
    const toast = await this.toast.create({
      message: "Something goes wrong",
      duration: 1000
    });
    toast.present();
  }

  async createLoading(message:string) {
    return await this.loadingController.create({
      spinner: "bubbles",
      message
    });
  }

  async presentInfoAlert(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [ 
        {
        text: 'OK'
      }
    ]
    });

    await alert.present();
  }

  getSongInfo(name){
    //uid _Title _artist _album _length _size
    //1122 _You are the one _Ni Ni Khin Zaw _Red _3.12 _4.5MB.mp3
    let nameWithoutExt = name.split('.').slice(0, -1).join('.');
    let info = nameWithoutExt.split('_');
    let song = {
      uid: info[0] ? info[0] : 0,
      title: info[1] ? info[1] : "Unknown",
      artist: info[2]? info[2] : "Unknown",
      album: info[3]? info[3] : "Unknown",
      songlength: info[4]? info[4].replace(".",":") : "Unknown",
      sizeinMb : info[5]? info[5] : "Unknown"
    }
    return song;
  }
}
