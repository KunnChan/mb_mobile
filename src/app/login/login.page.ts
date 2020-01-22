import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  frm: FormGroup;

  constructor() { 
    this.frm = new FormGroup({
      username: new FormControl("", Validators.compose([Validators.required])),
      password: new FormControl("", Validators.compose([Validators.required])),
    });
  }
  ngOnInit() {
  }

  async submit() {
    const frmVal = this.frm.value;
    console.log("onsubmit ", frmVal);
    
  }

}
