import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable ,of} from 'rxjs';
import { environment as env } from '../../environments/environment';
import { Subject } from "rxjs";
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  headers = { 'content-type': 'application/json'} 
  
  
  private _triggerEligibility = new Subject<boolean>();
  triggerEligibility = this._triggerEligibility.asObservable();
  triggerEligibilityForm(message: boolean) {
    this._triggerEligibility.next(message);
  }

  private _triggerDashboard = new Subject<boolean>();
  triggerDashboard = this._triggerDashboard.asObservable();
  triggerSaveDashboard(message: boolean) {
    this._triggerDashboard.next(message);
  }

  private _triggerPDF = new Subject<boolean>();
  triggerPDF = this._triggerPDF.asObservable();
  triggerGeneratePDF(message: boolean) {
    console.log("dashboard service", message)
    this._triggerPDF.next(message);
  }


  private _disableSaveDashboard = new Subject<boolean>();
  disableSaveDashboard = this._disableSaveDashboard.asObservable();
  triggerDisableSaveDashboard(message: boolean) {
    this._disableSaveDashboard.next(message);
  }

  private _disableSavePDF = new Subject<boolean>();
  disableSavePDF = this._disableSavePDF.asObservable();
  triggerDisableSavePDF(message: boolean) {
    this._disableSavePDF.next(message);
  }


  getFSADetails(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getFsaDetails', body)
  }

  getITRDetails(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getItrDetails', body)
  }

  getPdNotes(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getPdNotes', body)
  }

  getRemarks(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getRemarks', body)
  }

  getRecommendations(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getrecommendations', body)
  }

  saveRecommendation(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'saveRecommendation', body)
  }

  updateRecommendation(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.put<any>(env.apiUrl + 'updateRecommendation', body)
  }

  saveRemark(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'saveRemark', body)
  }

  updateRemark(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.put<any>(env.apiUrl + 'updateRemark', body)
  }

  deleteRemark(id: string): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.delete<any>(env.apiUrl + 'deleteRemark/' + id)
  }

  savePdnotes(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'savePdnotes', body)
  }

  getFICOInput(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getFicoInput', body)
  } 

  getBasicDetails(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getBasicDetails', body)
  }


  getIncomeDetail(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getIncomeDetail', body)
  }

  
  submitEligibility(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'triggerEligiblity', body)
  }

  getQuaterlyFinalOffer(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getQuaterlyFinalOffer', body)
  }

  getSanctionedConditions(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getSanction', body)
  }


  getGstDetails(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getGstDetails', body)
  }

  getBSADetails(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getBsaData', body)
  }

  saveDashboard(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'saveDashboardVersion', body)
  }
  
  getDashboardVersionList(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getDashboardVersion', body)
  }

  getDashboardTemplate(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(env.apiUrl + 'getDashboardTemplate', body)
  }

  getOtherIntegrations(body, url): Promise<any>{
    return this.http.post<any>(env.apiUrl + url, body).toPromise();
  }
  
  generatePdf(body): Observable<any> {
    // console.log("generate service", body)
    const headers = { "content-type": "application/json" };
    return this.http.post(env.apiUrl + "geneartePdf", body, {
      responseType: "blob",
    });
  }

  getMonthlyObligation(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}
    return this.http.post<any>(env.apiUrl + 'getMonthlyObligation', body)
  }

  getLogs(body): Observable<any>{
    const headers = { 'content-type': 'application/json'}
    return this.http.post<any>(env.apiUrl + 'getLogs', body)
  }
  
  triggerScorecard(body){
    return this.http.post<any>(env.apiUrl + 'triggerScorecard', body);
  }
  
  saveIncomeDetails(body){
    return this.http.post<any>(env.apiUrl + 'saveIncomeDetails', body);
  }
  
  getSTPDetails(body){
    return this.http.post<any>(env.apiUrl + 'getStpStatus', body);
  }

  getManualDeviation(body){
    return this.http.post<any>(env.apiUrl + 'getManualDeviation', body);
  }
  
  getAutoDeviation(body){
    return this.http.post<any>(env.apiUrl + 'triggerAutoDeviation', body);
  }

  getZipFile(body): Observable<any> {
    return this.http.post(env.apiUrl + 'uploadedFiles/download', body,{
      responseType: "blob"
    })
  }

  getExcelFile(body): Observable<any> {
    return this.http.post(env.apiUrl + 'excelreport/download', body, {
      responseType: "blob",
    })
  }

  downloadPDNotes(body): Observable<any> {
    return this.http.post(env.apiUrl + 'download/pdNotes', body, {
      responseType: "blob"
    })
  }

  saveApplicantDetails(body): Observable<any> {
    return this.http.post<any>(env.apiUrl + 'applicantDetails/postdata', body);
  }

  saveMonthlyObligationDetails(body): Observable<any> {
    return this.http.post<any>(env.apiUrl + 'save/saveMonthlyObligation', body);
  }

  getApplicantLastSavedData(body): Observable<any> {
    return this.http.post<any>(env.apiUrl + 'applicantDetails/getSavedData', body);
  }

  crimeCheckDetails(body): Observable<any> {
    return this.http.post<any>(env.apiUrl + 'getCrimeCheckData', body);
  }
  getFSAAnalyticsDetails(body): Observable<any> {
    return this.http.post<any>(env.apiUrl + 'getAnalytcsResult', body);
  }
  getConsumerBureauAnalyticsDetails(body): Observable<any> {
    return this.http.post<any>(env.apiUrl + 'getConsumerBureauAnalytics', body);
  }

  bsaBankingHealth(body): Observable<any> {
    return this.http.post<any>(env.apiUrl + 'getBankingAnalytics', body)
  }

  postPayment(body: any): Observable<any>{ 
    // let url = "http://172.24.4.232:8091/payment/api/payementInput"
    let url = "https://uat-senp.godrejcapital.com/payment/api/payementInput"

    return this.http.post<any>(url, body, {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + localStorage.getItem('accessToken')),
    })
  }

  parseErrorBlob(err: HttpErrorResponse): Observable<any> {
    console.log(err.error.text);
    const reader: any = new FileReader();

    const obs = Observable.create((observer: any) => {
      reader.onloadend = (e) => {
        observer.error(JSON.parse(reader.result));
        observer.complete();
      }
    });
    reader.readAsText(err.error.text);
    return obs;
  }

  search_Products(name: string): Observable<any> {
    name=name.toLowerCase()
    return of(states.filter(x=>x && x.toLowerCase().indexOf(name)>=0)).pipe(map(result=>
    {
      return result.map(x=>({state:x,name:x}))
    }))
  }

  getAllMonthlyObligationBanknameList(): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.get<any>(env.apiUrl + 'getAllMonthlyObligationBanknameList')
    //return this.http.get<any>('https://uat-senp.godrejcapital.com/dev/bl/api/testAllServiceList')
  }

  getAllMonthlyObligationLoanTypeHashMap(): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    return this.http.get<any>(env.apiUrl + 'getAllMonthlyObligationLoanTypeHashMap')
    //return this.http.get<any>('https://uat-senp.godrejcapital.com/dev/bl/api/testAllServiceList')
  }
}

export const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']