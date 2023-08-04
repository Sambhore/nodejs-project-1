import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { environment as env } from '../../../environments/environment';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private route: Router,
    private activatedroute: ActivatedRoute
  ) { }
  loader: boolean = true;
  ngOnInit(): void {
    console.log(this.route.url);
    let routerUrl = this.route.url.split('?')[0]
    if (routerUrl == "/callback") {
      this.callback()
    } else if (routerUrl == "/") {
      this.login();
    } else {
      console.log(this.route.url);
    }
  }
  login = async () => {
    this.activatedroute.queryParams
      .subscribe(async params => {
        if (params['tokenId'] !== undefined) {
          localStorage.setItem("tokenId", params['tokenId']);
        } else {
          this.route.navigate(['/error']);
        }
      });
    let url = env.loginUrl.replace("{REDIRECTURL}", env.redirectUrl);
    console.log()
    window.location.href = url;
  }

  callback = async () => {
    this.activatedroute.queryParams
      .subscribe(async params => {
        if (params['code'] !== undefined) {
          try {
            let res = await this.loginService.generateToken(params['code']);
            this.validateToken(res);
          } catch (error) {
            console.log(error);
          }

        } else {
          this.route.navigate(['/error']);
        }
      }
      );

  }

  validateToken = async (params) => {
    console.log(params);
    try {
      let res = await this.loginService.validateToken(params.accessToken);
      if (res.status) {

        let accessToken = params.accessToken

        this.getAccessToken(accessToken)
        // let userRoleBody = {
        //   "tokenId": localStorage.getItem("tokenId")
        // }
        // let userDetails = await this.loginService.getUserRole(userRoleBody);
        // localStorage.setItem("userDetails", JSON.stringify(userDetails.data));
        // this.route.navigate(['/dashboard']);
      }
    } catch (error) {
      console.log(error);
    }
  }

  getUserRole = async () => {

    try {
      let userRoleBody = {
        "tokenId": localStorage.getItem("tokenId")
      }
      let userDetails = await this.loginService.getUserRole(userRoleBody);
      localStorage.setItem("userDetails", JSON.stringify(userDetails.data));
      this.route.navigate(['/dashboard']);
    } catch (error) {
      console.log(error)
    }
  }

  getAccessToken = async (params) => {

    try {

      let accessToken = params

      let res = await this.loginService.getAccessToken(accessToken)

      if (res.status) {

        localStorage.setItem("accessToken", res.data.accessToken || "")
        localStorage.setItem("refreshToken", res.data.refreshToken || "")

        this.getUserRole()

      } else {
        console.log("Error: ", res.message)
      }

    } catch (error: any) {
      console.log(error)
    }
  }

}
