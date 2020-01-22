import { Injectable, Component } from "@angular/core";

@Injectable()
@Component({
  selector: 'app-config'
})
export class Configfile {

  constructor(){
    
  }

  public keyAuth = "TOKEN_KEY";
  public keyUserName = "USER_NAME";
  public keyPassword = "PASSWORD";

}
