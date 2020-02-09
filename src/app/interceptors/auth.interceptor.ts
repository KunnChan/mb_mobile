
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    clientId = "kcrock";
    clientSecret = "securekc";
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this.authService.currentUserValue();
        if(req.url.endsWith('/oauth/token')){
            let encryptKey = btoa(this.clientId + ':' + this.clientSecret);
            req = req.clone({
                setHeaders: { 
                    "Authorization": `Basic ${encryptKey}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            });
        } else if (currentUser) {
            req = req.clone({
                setHeaders: { 
                    "Authorization": `Bearer ${currentUser.access_token}`,
                    "Content-Type": "application/json",
                }
            });
        }else{
            req = req.clone({
                setHeaders: { 
                    "Content-Type": "application/json",
                }
            });
        }

        return next.handle(req);
    }
}