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
}
