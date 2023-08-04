import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let userdetails:any  = JSON.parse( localStorage.getItem("userDetails") || '{}');
      // if(userdetails.access.indexOf("write") !== -1 && userdetails.access.indexOf("modify") !== -1){
      //   return true
      // }
      if (userdetails.access.includes("read") &&
         userdetails.access.includes("write") &&
         userdetails.access.includes("modify")) {
        return true
      }
      this.router.navigate(['/dashboard']);
      return false;
  }
  
}
