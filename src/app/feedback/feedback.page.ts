import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  frm: FormGroup;

  constructor() { 
    this.frm = new FormGroup({
      name: new FormControl("", Validators.compose([Validators.required])),
      emailOrphone: new FormControl("", Validators.compose([Validators.required])),
      feedback: new FormControl("", Validators.compose([Validators.required])),
    });
  }

  ngOnInit() {
  }

}
