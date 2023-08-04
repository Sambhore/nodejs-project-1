import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  
  constructor(private http: HttpClient) { }
  headers = { 'content-type': 'application/json'} 
    
  getApplicants(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getApplicantDetails', body)
  }
  getBsaInstitutionsId(): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.get<any>(env.apiUrl + 'getBsaInstitutionsId')
  }

  getServices(): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.get<any>(env.apiUrl + 'getAllServiceList')
    //return this.http.get<any>('https://uat-senp.godrejcapital.com/dev/bl/api/testAllServiceList')
  }
  
  getApplicantDetails(body): Observable<any>{
    return this.http.post<any>(env.apiUrl + 'getTriggeredServices', body);
  }

  submitForm(body, url, contentType): Promise<any>{
    let formData;
    if(contentType == "formdata"){
      formData = new FormData();
      for (var field of Object.keys(body.value)) {
        if(body.value[field] == null){
          body.value[field] = "";
        }
        if((typeof body.value[field] === 'object') && !(body.value[field] instanceof File)){
          if(body.value[field][0] instanceof File){
            for(let i = 0; i < body.value[field].length; i++){
              formData.append(field, body.value[field][i]);  
            }
          } else {
            formData.append(field, JSON.stringify(body.value[field]));
          }
        } else {
          formData.append(field, body.value[field]); 
        }
      }
      console.log(formData);
    } else {
      formData = body.value;
    }
    return this.http.post<any>(env.apiUrl + url, formData).toPromise();
  }

  submitGSTConfirmation(body){
    return this.http.post<any>(env.apiUrl + 'gst/patchPdfParsing', body).toPromise();
  }

  submitUDINOtp(body){
    return this.http.post<any>(env.apiUrl + 'kyc/udinverification', body).toPromise();
  }


}
