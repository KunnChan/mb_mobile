import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";


@Component({
  selector: 'app-forget',
  templateUrl: './forget.page.html',
  styleUrls: ['./forget.page.scss'],
})
export class ForgetPage implements OnInit {

  frm: FormGroup;

  constructor() { 
    this.frm = new FormGroup({
      username: new FormControl("", Validators.compose([])),
      emailOrphone: new FormControl("", Validators.compose([Validators.required])),
    });
  }
  ngOnInit() {
  }

  async submit() {
    const frmVal = this.frm.value;
    console.log("onsubmit ", frmVal);
    
  }

}
