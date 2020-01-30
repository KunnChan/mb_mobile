import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  frm: FormGroup;

  constructor(private authService: AuthService) { 
    this.frm = new FormGroup({
      username: new FormControl("", Validators.compose([Validators.required])),
      password: new FormControl("", Validators.compose([Validators.required])),
    });
  }
  ngOnInit() {
  }

  async submit() {
    const frmVal = this.frm.value;
    this.authService.login(frmVal)
      .subscribe(result => {
        console.log("Respond ", result);
      }, error =>{
        console.log("login error");
        
      })

    console.log("onsubmit ", frmVal);
    
  }

}
