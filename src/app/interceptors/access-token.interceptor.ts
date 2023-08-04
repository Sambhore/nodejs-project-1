import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { AUTH_HEADER_FLAG, LoginService } from '../services/login.service';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {

  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject(null);
  constructor(private router: Router, private loginService: LoginService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.addAccessToken(request)).pipe(
      catchError((requestError: HttpErrorResponse) => {

        let statusCode = ""
        if (requestError.error.type === "application/json") {

          if (request.responseType === "blob") {
            statusCode = "403"
          }
          
        } else {
          statusCode = requestError.error.statusCode.split("-")[1]
        }

        if (statusCode === "401") {
          // Wrong Access Token

          let navigationExtras: NavigationExtras = {};
          navigationExtras['state'] = {
            statusCode: statusCode,
            message: 'Unauthorized Access!',
          };
          this.router.navigate(['/error'], navigationExtras);

          return throwError(() => requestError);

        } else if (statusCode === "403") {
          // Access Token Expired
          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
              filter((result: any) => result),
              take(1),
              switchMap(() => next.handle(this.addAccessToken(request)))
            );
          } else {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);

            let refreshToken = localStorage.getItem('refreshToken')

            return this.loginService.refreshAccessToken(refreshToken).pipe(
              switchMap((token) => {
                console.log("Refresh token", token)

                let accessToken = token.data.accessToken || ""
                let refreshToken = token.data.refreshToken || ""

                localStorage.setItem("accessToken", accessToken || "")
                localStorage.setItem("refreshToken", refreshToken || "")

                this.refreshTokenSubject.next(refreshToken);
                return next.handle(this.addAccessToken(request));
              }),
              finalize(() => (this.refreshTokenInProgress = false))
            );
          }
        } else {
          // Other Errors
          return throwError(() => requestError);
        }
      })
    );
  }

  addAccessToken(request: HttpRequest<any>) {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      return request;
    }

    const authHeaderFlag = request.context.get(AUTH_HEADER_FLAG);

    if (authHeaderFlag === 0) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      const newHeaders = request.headers.set("Access-Control-Allow-Origin", "*")
      return request.clone({ headers: newHeaders });
    }
  }
}
