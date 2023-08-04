// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl:"http://172.24.4.232:8081/dev/bl/api/",
  ssoUrl:"https://internal-uat-cp.godrejhf.com:3005/v1/sso/",
  redirectUrl:"http://localhost:4200/dashboard",
  loginUrl:"https://login.microsoftonline.com/bfa3dfb0-91d5-4bf7-9a0c-fbf6ff337187/oauth2/v2.0/authorize?client_id=0245879a-4097-4f2f-b7b5-cdab890428fb&response_type=code &redirect_uri={REDIRECTURL}&response_mode=query&scope=openid Files.ReadWrite.All offline_access&state=12345&sso_reload=true",
  apiUrl:"https://uat-senp.godrejcapital.com/dev/bl/api/", // dev
  // apiUrl:"https://uat-senp.godrejcapital.com/bl/api/" // uat
  // apiUrl:"https://credvue.godrejcapital.com/bl/api/" // prod
  appName: "GC-SENP-LOCAL"
};
