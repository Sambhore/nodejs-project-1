import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';

export const AUTH_HEADER_FLAG = new HttpContextToken(() => 0);

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  getLoginUrl(body) {
    return this.http.post<any>(env.ssoUrl + 'login', body).toPromise();
  }

  generateToken(param) {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');

    const url = `${env.ssoUrl}token/${env.appName}?code=${param}`

    return this.http.post<any>(url, {
      headers: headers,
    }, {
      context: new HttpContext().set(AUTH_HEADER_FLAG, 1)
    }).toPromise();
  }

  validateToken(param) {
    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');

    const url = `${env.ssoUrl}validatetoken/${env.appName}?secretToken=${param}`

    return this.http.get<any>(url, {
      headers: headers,
      context: new HttpContext().set(AUTH_HEADER_FLAG, 1),
    }).toPromise();
  }

  getAccessToken(accessToken) {

    const url = `${env.apiUrl}getAccessToken`

    let body = {
      aceessToken: accessToken,
      tokenId: localStorage.getItem('tokenId'),
      refreshToken: ""
    }
    return this.http.post<any>(url, body).toPromise();
  }

  refreshAccessToken(refreshToken): Observable<any> {
    const url = `${env.apiUrl}getAccessToken`

    let body = {
      aceessToken: "",
      tokenId: localStorage.getItem('tokenId'),
      refreshToken: refreshToken
    }
    return this.http.post<any>(url, body);
  }

  getUserRole(body) {

    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.post<any>(env.apiUrl + 'adlogin', body).toPromise();
  }
}
