import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  frm: FormGroup;

  constructor(private authService: AuthService, private alertController: AlertController) { 
    this.frm = new FormGroup({
      name: new FormControl("", Validators.compose([Validators.required])),
      emailOrphone: new FormControl("", Validators.compose([Validators.required])),
      text: new FormControl("", Validators.compose([Validators.required])),
    });
  }

  ngOnInit() {
  }

  async submit() {
    const frmVal = this.frm.value;

    this.authService.feedback(frmVal)
      .subscribe(result => {
        this.presentAlert(frmVal.name);
        this.frm.reset();
      }, error => {
        console.log("Error in feedback ", error);
      })
  }

  async presentAlert(name) {
    const alert = await this.alertController.create({
      header: 'Hello '+ name,
      message: 'Thank you for your contribution. We will take care of every word from you for improving',
      buttons: ['OK']
    });

    await alert.present();
  }
}
