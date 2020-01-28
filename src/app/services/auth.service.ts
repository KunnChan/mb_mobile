import { Injectable } from '@angular/core';
import { Configfile } from '../configfile';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private config: Configfile, private http: HttpClient) { }

  login(reqData){
    const headers = this.config.getUrlEncodedHeader();
    let body = "grant_type=password&username=" + reqData.userName + "&password=" + reqData.password;
    this.http
    .post(this.config.urlToken, body, { headers }).pipe(map(res => res));
  }
}
