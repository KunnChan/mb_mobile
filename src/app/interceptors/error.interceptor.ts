import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, empty, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';
import { Configfile } from '../configfile';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authService: AuthService,
        private storage: Storage, private config: Configfile){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError(err => {
            if(err.status === 401){
                if (this.refreshTokenInProgress) {
                    return this.refreshTokenSubject.pipe(filter( result => result !== null )
                            ,take(1)
                            ,switchMap(() => next.handle(this.addAuthenticationToken(req, null))))
                }else{
                    this.refreshTokenInProgress = true;
                    this.refreshTokenSubject.next(null);
                    return this.authService
                                .refreshTokenObservable().pipe(switchMap(token => {
                                    this.refreshTokenInProgress = false;
                                    this.storage.set(this.config.keyAuth, token);
                                    this.refreshTokenSubject.next(token);
                                    return next.handle(this.addAuthenticationToken(req, token));
                                }), catchError(err => {
                                    this.refreshTokenInProgress = false;
                                    return Observable.throw(err);
                                }))
                }
            }
            return throwError(err);
        }))
    }
    
    addAuthenticationToken(request, token) {
       
        if (!token) {
            return request;
        }
        return request.clone({
            setHeaders: {
                Authorization: 'Bearer '+ token.access_token,
            }
        });
    }
}