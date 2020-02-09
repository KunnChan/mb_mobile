import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  frm: FormGroup;
  errorText = "";

  constructor(private service: AuthService, private route: Router,) { 
    this.frm = new FormGroup({
      username: new FormControl("", Validators.compose([Validators.required])),
      name: new FormControl("", Validators.compose([Validators.required])),
      email: new FormControl("", Validators.compose([])),
      phone: new FormControl("", Validators.compose([Validators.required])),
      confirm: new FormControl("", Validators.compose([Validators.required])),
      password: new FormControl("", Validators.compose([Validators.required])),
      dob: new FormControl("", Validators.compose([Validators.required])),
    });
  }

  ngOnInit() {
  }

  async submit() {
    this.errorText = "";
    const frmVal = this.frm.value;
    if(frmVal.password !== frmVal.confirm){
      this.errorText = "Password not match!"
      return;
    }

    this.service.register(frmVal)
      .subscribe(result => {
        this.route.navigate(['tabs/login']);
      }, error => {
        this.errorText = "Invalid Username or password is too short!"
      })
    
  }

}
