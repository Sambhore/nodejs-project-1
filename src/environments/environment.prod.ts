export const environment = {
  production: true,
  loginUrl:"https://login.microsoftonline.com/bfa3dfb0-91d5-4bf7-9a0c-fbf6ff337187/oauth2/v2.0/authorize?client_id=0245879a-4097-4f2f-b7b5-cdab890428fb&response_type=code &redirect_uri={REDIRECTURL}&response_mode=query&scope=openid Files.ReadWrite.All offline_access&state=12345&sso_reload=true",
  ssoUrl: "https://internal-msq.godrejhf.com/v1/sso/", // prod
  redirectUrl: "https://credvue.godrejcapital.com/bl/ui/dashboard", // prod
  apiUrl: "https://credvue.godrejcapital.com/bl/api/", // prod
  appName: "GC-SENP"
};
