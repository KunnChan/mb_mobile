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

  endpoint = "http://localhost:8188/xapiv1";

  urlToken = this.endpoint + "/oauth/token";
  urlGetSongSingelQuery = this.endpoint + "/song/q";

  public keyAuth = "Auth";
  public keyUserName = "USER_NAME";
  public keyPassword = "PASSWORD";
  public keyCurrentTrack = "CURRENT_TRACK";

}
