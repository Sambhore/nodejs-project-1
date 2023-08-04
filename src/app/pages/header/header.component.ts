import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  @Input() pageName!: String;
  @Input() isTriggerEligibility!: boolean;
  @Output("generatePDF") headerGeneratePdf: EventEmitter<any> = new EventEmitter();

  fileNotification:boolean = false;
  logNotification:boolean = false;
  disableSaveDashboard = true
  disableSavePDF = true
  allLogs:any
  lan = ""
  user_name = ""
  userReadOnlyAccess = false
  userReadOnlyAccessOther = false
  xData = 0

  constructor(
    private dashboardService: DashboardService
  ) { }
  
  ngOnInit(): void {
    
    this.dashboardService.disableSaveDashboard.subscribe(
      (message) => {
          this.disableSaveDashboard = message;
      }
    );
    this.dashboardService.disableSavePDF.subscribe(
      (message) => {
          this.disableSavePDF = message;
      }
    );
    let userdetails:any  = JSON.parse( localStorage.getItem("userDetails") || '{}');
    //console.log(userdetails)
    this.lan = userdetails.lan;
    // if(userdetails.access.indexOf("write") !== -1 && userdetails.access.indexOf("modify") !== -1){
    //   this.userReadOnlyAccess = false
    // }
    // this.getLogs();

      if (userdetails.access.includes("read") &&
         userdetails.access.includes("write") &&
         userdetails.access.includes("modify")) {
        // has read, write, modify
        this.userReadOnlyAccess = false
        this.userReadOnlyAccessOther = false
      } else if (userdetails.access.includes("read") &&
                userdetails.access.includes("modify")) {
        // has read, modify
        this.userReadOnlyAccess = true
        this.userReadOnlyAccessOther = false
        this.disableSavePDF = false
      } else if (userdetails.access.includes("read")) {
        // has read
        this.userReadOnlyAccess = true
        this.userReadOnlyAccessOther = true
      } 
    

    this.xData = window.innerWidth / 2;
    
  }

  getLogs(){
    let body = {
      lan:this.lan
    }
    this.dashboardService.getLogs(body).subscribe(res => {
      if (res.data) {
        this.allLogs = res.data.allLogs
      }
    })
  }
  submitEligibility() {
    console.log("submitEligibility");
    //this.disableSaveDashboard = false;
    this.dashboardService.triggerEligibilityForm(true);
  }
  saveDashboard(){
    this.dashboardService.triggerSaveDashboard(true);  
  }

  // generatePdf(){
  //   console.log("header")
  //   this.dashboardService.triggerGeneratePDF(true);  
  // }

  generatePdf(){
    // console.log("header generate pdf")
    this.headerGeneratePdf.emit()
  }

}
