import { Injectable } from '@angular/core';
import { Configfile } from '../configfile';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { RequiredValidator } from '@angular/forms';

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

  getSongQuery(reqData): Observable<any>{

    let body = { 
        "id": reqData.id,
        "title" : reqData.title,
        "genre" : reqData.genre,
        "artist" : reqData.artist,
        "album" : reqData.album,
        "language" : reqData.language,
        "info" : reqData.info,
        "page": {
          "page" : reqData.page,
          "size" : reqData.size
          }
        };

    return this.http
      .post(this.config.urlGetSongMultiQuery, body).pipe(map(user => {
          return user;
      }));
  }
}
