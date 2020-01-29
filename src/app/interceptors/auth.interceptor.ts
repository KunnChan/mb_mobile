
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this.authService.currentUserValue;
        console.log("INterceptor ", currentUser);
        
        if (currentUser) {
            req = req.clone({
                setHeaders: { 
                    Authorization: `Basic ${currentUser['access_token']}`
                }
            });
        }

        return next.handle(req);
    }
}