import { Injectable, Component } from "@angular/core";
import { Storage } from '@ionic/storage';
import { HttpHeaders } from "@angular/common/http";


@Injectable()
@Component({
  selector: 'app-config'
})
export class Configfile {

  auth = null;
  constructor(private storage: Storage){
    this.storage.get(this.keyAuth)
      .then(auth => {
        if(auth) this.auth = auth;
      })
  }

  getAuthHeader() {
    return new HttpHeaders({
      "Authorization": 'Bearer '+ this.auth.access_token
    , "Content-Type":"application/x-www-form-urlencoded"
    });
  }

  getUrlEncodedHeader() {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return headers;
  }

  public endpoint = "http://192.168.101.7:8188/xapiv1";

  public urlToken = this.endpoint + "/oauth/token";

  public keyAuth = "Auth";
  public keyUserName = "USER_NAME";
  public keyPassword = "PASSWORD";
  public keyCurrentTrack = "CURRENT_TRACK";

}
