
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
        const information = currentUser.information;
        const infoHeader = {
            "os-version": information.osVersion === null ? "": information.osVersion,
            "model": information.model === null ? "": information.model,
            "manufacturer": information.manufacturer === null ? "": information.manufacturer,
            "platform": information.platform === null ? "": information.platform,
            "uuid": information.uuid === null ? "": information.uuid,
            "lattlonn": information.lattlonn === null ? "": information.lattlonn
        }
        if(req.url.endsWith('/oauth/token')){
            let encryptKey = btoa(this.clientId + ':' + this.clientSecret);
            req = req.clone({
                setHeaders: { 
                    "Authorization": `Basic ${encryptKey}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    ...infoHeader
                }
            });
        } else if (currentUser.value !== null && currentUser.value.access_token) {
            req = req.clone({
                setHeaders: { 
                    "Authorization": `Bearer ${currentUser.value.access_token}`,
                    "Content-Type": "application/json",
                    ...infoHeader
                }
            });
        }else{
            req = req.clone({
                setHeaders: { 
                    "Content-Type": "application/json",
                   ...infoHeader
                }
            });
        }

        // req = req.clone({
        //     setHeaders: { 
        //         "os-version": information.osVersion,
        //         "model": information.model,
        //         "manufacturer": information.manufacturer,
        //         "platform": information.platform,
        //         "uuid": information.uuid,
        //         "lattlonn": information.lattlonn,
        //     }
        // });

        return next.handle(req);
    }
}