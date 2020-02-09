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
    // Refresh Token Subject tracks the current token, or is null if no token is currently
    // available (e.g. refresh pending).
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authService: AuthService,
        private storage: Storage, private config: Configfile){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError(err => {

            if (err.error.error === "invalid_grant") {
                const error = err.error.message || err.statusText;
                //alert("Invalid Grant : "+ error + " }=> "+ JSON.stringify(err.error))
                return throwError(error);
            }

            if (this.refreshTokenInProgress) {
                // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
                // – which means the new token is ready and we can retry the request again

            return this.refreshTokenSubject.pipe(filter( result => result !== null )
                    ,take(1)
                    ,switchMap(() => next.handle(this.addAuthenticationToken(req))))
            }else{
                this.refreshTokenInProgress = true;
    
                // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
                this.refreshTokenSubject.next(null);

                return this.authService
                            .refreshTokenObservable().pipe(switchMap(token => {
                                this.refreshTokenInProgress = false;
    
                             //   ConfigProvider.accessToken = token.access_token;
                             //   ConfigProvider.refreshToken = token.refresh_token;
    
                                this.storage.set(this.config.keyAuth, token);
    
                                this.refreshTokenSubject.next(token);
                                return next.handle(this.addAuthenticationToken(req));
                            }), catchError(err => {
                                this.refreshTokenInProgress = false;
                             //   this.authService.logout();
                                return Observable.throw(err);
                            }))
            }

            return empty();
        }))
    }
    
    addAuthenticationToken(request) {
       
       // const accessToken = ConfigProvider.accessToken;
       const accessToken = ""

        // If access token is null this means that user is not logged in
        // And we return the original request
        if (!accessToken) {
            return request;
        }

        // We clone the request, because the original request is immutable
        return request.clone({
            setHeaders: {
                Authorization: 'Bearer '+ accessToken,
            }
        });
    }
}