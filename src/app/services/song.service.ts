import { Injectable } from '@angular/core';
import { Configfile } from '../configfile';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private config: Configfile, private http: HttpClient, private storage: Storage) { }

  getRecentlyAdded(reqData): Observable<any>{
    let body = { 
        "query": reqData.query,
        "browserInfo" : "asdf",
        "page": {
          "page" : reqData.page,
          "size" : reqData.size
          }
        };

    return this.http
      .post(this.config.urlGetSongSingelQuery, body).pipe(map(user => {
          return user;
      }));
  }
}
