export const environment = {
    production: true,
    loginUrl:"https://login.microsoftonline.com/bfa3dfb0-91d5-4bf7-9a0c-fbf6ff337187/oauth2/v2.0/authorize?client_id=0245879a-4097-4f2f-b7b5-cdab890428fb&response_type=code &redirect_uri={REDIRECTURL}&response_mode=query&scope=openid Files.ReadWrite.All offline_access&state=12345&sso_reload=true",
    ssoUrl:"https://internal-uat-cp.godrejhf.com:3005/v1/sso/", // dev/uat
    redirectUrl:"https://uat-senp.godrejcapital.com/dev/bl/ui/dashboard", // dev
    apiUrl:"https://uat-senp.godrejcapital.com/dev/bl/api/", // dev
    appName: "GC-SENP-DEV"
  };
  