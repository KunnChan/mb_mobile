import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  frm: FormGroup;

  constructor() { 
    this.frm = new FormGroup({
      username: new FormControl("", Validators.compose([Validators.required])),
      name: new FormControl("", Validators.compose([Validators.required])),
      email: new FormControl("", Validators.compose([])),
      phone: new FormControl("", Validators.compose([Validators.required])),
      confirm: new FormControl("", Validators.compose([Validators.required])),
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
