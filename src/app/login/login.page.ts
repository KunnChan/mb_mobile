import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Configfile } from '../configfile';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  frm: FormGroup;
  errorText = "";

  constructor(private authService: AuthService,private route: Router,
    private storage: Storage, private config: Configfile) { 
    this.frm = new FormGroup({
      username: new FormControl("", Validators.compose([Validators.required])),
      password: new FormControl("", Validators.compose([Validators.required])),
    });
  }
  ngOnInit() {
  }

  async submit() {
    this.errorText = "";
    const frmVal = this.frm.value;
    this.authService.login(frmVal)
      .subscribe(result => {

        this.authService.getUserInfo(frmVal.username)
          .subscribe(result => {
            this.storage.set(this.config.keyUserInfo, result)
              .then(() => {
                this.errorText = "";
                this.route.navigate(['tabs/profile']);
              })
          }, error => {
            this.errorText = "Cann't get user information"
          })
      }, error =>{
        this.errorText = "Invalid Username or password!"
      })
  }

}
