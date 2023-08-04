import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ViewService } from "../../services/view.service";
import { DashboardService } from "../../services/dashboard.service";
import { MatTableDataSource } from '@angular/material/table';

import {
  Validators,
  FormControl,
  FormGroup,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import { trigger } from "@angular/animations";

import { otherIntegration } from "src/app/utils/otherIntegration";
import { Router, ActivatedRoute } from "@angular/router";
import { ToNumberPipe } from "../../pipes/to-number.pipe";
import { CurrencyPipe } from "@angular/common";

import {v4 as uuid4} from 'uuid';

import { environment as env } from '../../../environments/environment';

@Component({
  selector: "app-dashboard-page",
  templateUrl: "./dashboard-page.component.html",
  styleUrls: ["./dashboard-page.component.scss"],
  providers: [ToNumberPipe],
})
export class DashboardPageComponent implements OnInit {
  Object = Object;
  Array = Array;
  JSON = JSON;
  selectedBanks: any[] =[];
  selectedMonthlyObligationLoanType: string[] =[];
  selectedMonthlyObligationLoanDescription: string[] =[];
  selectedMonthlyObligationLoanTypeList: any[] =[];
  selectedRepaymentBanks: any[] =[];
  bankNames: string[] = [
    'STATE BANK OF INDIA','BANK OF BARODA','STATE BANK OF TRAVANCORE','ICICI Bank'
    ,'IDBI Bank','INDIAN Bank','INDIAN OVERSEASE Bank'
  ];
  monthlyObligationLoanTypes= new Map();

// Initially fill the selectedStates so it can be used in the for loop** 

// Receive user input and send to search method**
selectBankName(event,index) { 
 let value= event.target.value;
 this.monthlyObligationDetails.monthlyObligation[index].bankNameEdited=true;
this.selectedBanks[index] = this.search(value);
}

selectRepaymentBankName(event,index) { 
  let value= event.target.value;
 this.selectedRepaymentBanks[index] = this.search(value);
 }

selectBankNameBlank(event,index) { 
  // event.target.value='';
 this.selectedBanks[index] = this.bankNames;
 }

// Filter the states list and send back to populate the selectedStates**
search(value: string) { 
  let filter = value.toLowerCase();
  return this.bankNames.filter(option => option.toLowerCase().startsWith(filter));
}
  pageName = "dashboardPage";

  displaySnapshotMenu = false;
  Recomendation = false;
  userReadOnlyAccess = false; // for dashboard and trigger
  userReadOnlyAccessOther = false // for remark and recommendation
  PDNotes = false;
  otherIntegration = otherIntegration;
  applicants: any[] = [];
  applicantsBasicDetails: any[] = [];
  services: any[] = [];
  LoanType = "";
  loanPurpose = "";
  currentAppct: any;
  FSA: any = {};
  location: any = "";
  ConsumerBureauAnalytics:consumerBureauAnalyticsRes= ConsumerBureauAnalyticsVariable;
  monthlyObligationSummery = false;
  totalObligation: any = {
    totalMonthlyObligation: 0,
    totalMonthlyObligationBankingSurrogate: 0,
    totalAnnualObligation: 0,
    totalUnsecureExposure: 0,
    totalSecureExposure: 0,
  };
  //fsa_scanned:boolean = true;
  applicantDetails: any;
  lan: String = "";
  users: any = [];
  incomeusers: any = [];
  PDNotesArr: any = [];
  RecommendationArr: any = [];
  newRecommendation: any = "";
  user_name: any = "shiv";
  newPDNote: any = "";
  applicantIncome: any = {};
  applicantIncomeEditable: any = {};
  totalAbbcount = 0;
  applicantIncomeBlankResponse: Object = {
    currentYearData: {
      TypeofFinancials: "",
      ITRFilingDate: "",
      turnoverAsPerFinancials: "",
      turnoverAsPerGST: "",
      grossProfit: "",
      profitAfterTax: "",
      depreciation: "",
      salaryPaidToPartner: "",
      interestPaidToPartner: "",
      directorsRenumeration: "",
      nonOperatingExpense: "",
      nonOperatingIncome: "",
      otherIncome: "",
      otherExpense: "",
      totalincome: "",
      greatestIndividualContributor: "",
    },
    previousYearData: {
      TypeofFinancials: "",
      ITRFilingDate: "",
      turnoverAsPerFinancials: "",
      turnoverAsPerGST: "",
      grossProfit: "",
      profitAfterTax: "",
      depreciation: "",
      salaryPaidToPartner: "",
      interestPaidToPartner: "",
      directorsRenumeration: "",
      nonOperatingExpense: "",
      nonOperatingIncome: "",
      otherIncome: "",
      otherExpense: "",
      totalincome: "",
      greatestIndividualContributor: "",
    },
    GrowthPercentage: {
      growthperTurnoverAsperfinancial: "",
      growthperTurnoverAsperGst: "",
      growthpergrossProfit: "",
      growthperprofitAfterTax: "",
      growthperprofitBeforeTax: "",
      growthperdepreciation: "",
      growthpersalaryPaidToPartner: "",
      growthperinterestPaidToPartner: "",
      growthperdirectorsRenumeration: "",
      growthpernonOperatingExpense: "",
      growthpernonOperatingIncome: "",
      growthperotherIncome: "",
      growthperotherExpense: "",
      growthpertotalincome: "",
    },
    BSADetails: {
      SumofBusinessCreditfor6months: "",
      MonthlyAverageBankBalancefor6months: "",
      MinimumABBfor6months: "",
      "MinimumcreditCountP.M.normfor6Months": "",
      "MinimumCreditAmountP.M.Normfor6months": "",
      BTOfor6months: "",
      SumofBusinessCreditfor12months: "",
      MonthlyAverageBankBalancefor12months: "",
      MinimumABBfor12months: "",
      "MinimumcreditCountP.M.normfor12Months": "",
      "MinimumCreditAmountP.M.Normfor12months": "",
      BTO: "", // 12 months
      IwOwRatio: "",
      MaximumPermissibleLoanAmount: "",
      isLogicUpdated: true
    },
  };
  applicantIncomeDetails: any = JSON.parse(
    JSON.stringify(this.applicantIncomeBlankResponse)
  );
  applicantIncomeDetailsEditable: any = JSON.parse(
    JSON.stringify(this.applicantIncomeBlankResponse)
  );
  FSADetails: any = {
    profitAndLoss: {},
    BalanceSheet: {
      Liabilities: {},
      Assets: {},
    },
    blFields: {},
    RatioAnalysis: {},
  };
  GSTDetails: any = {
    previousQuater: {
      otherQuarterFields: {},
      QuaterData: {
        previousQuarter1: {},
        currentQuarter1: {},
        previousQuarter2: {},
        currentQuarter2: {},
        previousQuarter3: {},
        currentQuarter3: {},
        previousQuarter4: {},
        currentQuarter4: {},
      },
    },
    currentQuater: {
      otherQuarterFields: {},
      QuaterData: {
        previousQuarter1: {},
        currentQuarter1: {},
        previousQuarter2: {},
        currentQuarter2: {},
        previousQuarter3: {},
        currentQuarter3: {},
        previousQuarter4: {},
        currentQuarter4: {},
      },
    },
  };
  selectedIncomeUser = "";
  selectedGSTUser = "";
  selectedBSAUser = "";
  remarkData: any = {
    fsa: [],
    finalOffer: [],
    sanctionCondition: [],
    deviation: [],
    incomeDetails: [],
    bsaSummery: [],
    monthlyObligation: [],
    gstSummery: [],
    basicDetails: [],
    otherIntegration: [],
    applicantDetails: [],
    itrSummery: [],
    crimeCheckSummery: []
  };
  editRemarkData: any = {
    fsa: {},
    finalOffer: {},
    sanctionCondition: {},
    deviation: {},
    incomeDetails: {},
    bsaSummery: {},
    monthlyObligation: {},
    gstSummery: {},
    basicDetails: {},
    otherIntegration: {},
    applicantDetails: {},
    itrSummery: {}
  }
  newremark = {
    fsa: "",
    finalOffer: "",
    sanctionCondition: "",
    deviation: "",
    incomeDetails: "",
    bsaSummery: "",
    monthlyObligation: "",
    gstSummery: "",
    basicDetails: "",
    otherIntegration: "",
    applicantDetails: "",
    itrSummery: "",
    crimeCheckSummery: ""
  };
  isEditRemark = {
    fsa: false,
    finalOffer: false,
    sanctionCondition: false,
    deviation: false,
    incomeDetails: false,
    bsaSummery: false,
    monthlyObligation: false,
    gstSummery: false,
    basicDetails: false,
    otherIntegration: false,
    applicantDetails: false,
    itrSummery: false
  }
  SanctionedConditions: any = [];
  FICOInput: any = [];
  gstDetauls: any = [];
  loader = false;
  GST: any = [];

  manualDeviation: any = [];
  autoDeviation: any = [];
  BSA: any = [];
  natureOfBusinessDropDown: any = "";
  FinalEligibilityLoanAmount: any = {
    12: {},
    24: {},
    36: {},
    48: {},
  };
  BSADetails: any = {
    accountDetails: [],
  };
  BSABankDetails: any = {
    emiAmount: "",
    emiData: [],
  };
  BSABankingAnalysis: any = [];
  BSABankingAnalysisTotalAvg: any = {};
  dashboardVersion: any = "";
  dashboardName: any = "";
  user: any = "";
  userrole: any = "";
  saveDashboardPopup: boolean = false;
  dashboardVersionList: any = [];
  otherIntegrationResult = {};
  otherIntegrationUser: any = {
    Passport: {},
    HSN: {},
    FDA: {},
    FSSAI: {},
    ShopandEstablishment: {},
    // CaMembership:{},
    // ICSI:{},
    // ICWAI:{},
    // UDIN:{},
    VoterID: {},
    DrivingLicense: {},
    Google: {},
    PanProfile: {},
    AadharXML: {},
    PanStatus: {},
    PanAadhar: {},
    // MCi: {},
    Employment: {},
  };
  monthlyObligationDetails: any = {
    monthlyObligation: [],
    totalunsecuredObligation: 0,
    totalsecuredObligation: 0,
    totalMonthlyObligationSurrogateMethod: 0,
  };
  monthlyObligations;
  prevSelect = "";
  prevSelectSurrogateMethod = "";
  judgementalScore = 0;
  judgementalSegment = "--";
  CRIFScore = 0;
  CRIFSegment = "--";
  serviceLogs: any = {
    FSA: [],
    BSA: [],
    ITR: [],
    GST: [],
    OtherIntegration: [],
    FinalOffer: [],
    BasicDetails: [],
    senpGeneratePdf: [],
  };
  allLogs: any = [];
  STP_Status: any = "";
  triggerEligibilityObs: any;
  triggerGenPDF: any;
  eligibilityMethodDropdown = "INCOMEMETHOD";
  isEditRecommendation = false
  editRecommendationData: any = {}
  STP_StatusReason = "";
  
  ITR: any = {}
  ITRDetails: any = {
    ITRVInformation: {},
    IncomeDetails: {},
    TaxCalculation: {},
    itrvGSTInfo: [],
    itrvBankInfo: [],
    itrvKeyPersonInfo: [],
    year: [],
  }
  scoreCard: any = {}
  PD_Type = ""
  isTriggerEligibility = true
  crimeCheckDetails = {}
  crimeCheckTypes: any = ["Company", "Individual"]
  crimeCheckDetail = {
    name: "",
    type: "",
    riskType: "",
    caseRefNo: "",
    riskSummary: "",
  }
  fsaFinancialResult: any = {}

  ConsumerBureauAnalyticsResult: any = [];
  coApplicantUserList: Array<coApplicantUser> =[];
  ConsumerBureauAnalyticsView:boolean=false;
 
  bsaBankingHealth: any[] = []
  bsaBankingHealthResult: any[] = []
  // bsaBankingHealthDetail: any = {
  //   concentrationRisk: {},
  //   ABB: {},
  //   PBB: {},
  //   accountNum: 0,
  //   transactionAnalytics:{}
  // }
  bsaBankingHealthDetail: any = []
  subProduct = "";
  selectLoadDashboard = true
  isPD_TypeMandatory = false

  @ViewChild('form') form!: ElementRef;

  paymentForm!: FormGroup

  accessCode = ""
  encRequest = ""

  constructor(
    public fb: FormBuilder,
    public viewService: ViewService,
    public dashboardService: DashboardService,
    private activatedroute: ActivatedRoute,
    private route: Router,
    private toNumber: ToNumberPipe,
    private currencyPipe: CurrencyPipe,
  ) { }

  ngOnInit(): void {
    let code = "";
    this.activatedroute.queryParams.subscribe((params) => {
      if (params["code"] !== undefined) {
        code = params["code"];
      }
    });
    if (code !== "") {
      this.route.navigate(["/callback"], { queryParams: { code: code } });
    } else {
      let userdetails: any = JSON.parse(
        localStorage.getItem("userDetails") || "{}"
      );
      if (Object.keys(userdetails).length === 0) {
        this.route.navigate(["/"]);
      }
      this.lan = userdetails.lan;
      this.user_name = userdetails.userName;
      let roles = ["BL_CCU_CM", "BL_CCU_ACM", "BL_REGIONAL_CM", "BL_REGIONAL_ACM", "BL_CCU_TL", "BL_ACM"]
      if (roles.includes(userdetails.role)) {
        this.isPD_TypeMandatory = true
      }
      //this.lan = "GFL3000LP0000472";
      // if (
      //   userdetails.access.indexOf("write") === -1 &&
      //   userdetails.access.indexOf("modify") === -1
      // ) {
      //   this.userReadOnlyAccess = true;
      // }
      if (userdetails.access.includes("read") &&
         userdetails.access.includes("write") &&
         userdetails.access.includes("modify")) {
        // has read, write, modify
        this.userReadOnlyAccess = false
        this.userReadOnlyAccessOther = false
        this.selectLoadDashboard = false
      } else if (userdetails.access.includes("read") &&
                userdetails.access.includes("modify")) {
        // has read, modify
        this.userReadOnlyAccess = true
        this.userReadOnlyAccessOther = false
        this.selectLoadDashboard = false
      } else if (userdetails.access.includes("read")) {
        // has read
        this.userReadOnlyAccess = true
        this.userReadOnlyAccessOther = true
        this.selectLoadDashboard = false
      } 
      this.loader = true;
      this.getApplicants(this.lan);
    }

    this.triggerEligibilityObs =
      this.dashboardService.triggerEligibility.subscribe((message) => {
        if (message) {
          console.log("subscribe");

          // if (this.eligibilityMethodDropdown === "BL- Pre-computed" || this.eligibilityMethodDropdown === "BL- Pre-Filtered" || this.eligibilityMethodDropdown === "X-SELL INSTA" || this.eligibilityMethodDropdown === "X-SELL Qualified" || this.eligibilityMethodDropdown === "D2C - Banking LTS Program") {
          //   this.dashboardService.triggerDisableSaveDashboard(false);
          //   this.isTriggerEligibility = false
          // } else {
          //   this.dashboardService.triggerDisableSaveDashboard(true);
          //   this.isTriggerEligibility = true
          //   this.setIncomDetailsForEligibility(this.applicantIncomeDetailsEditable);
          // }
          this.setIncomDetailsForEligibility(
            this.applicantIncomeDetailsEditable
          );
        }
      });

    // this.triggerGenPDF = this.dashboardService.triggerPDF.subscribe(
    //   (message) => {
    //     if (message) {
    //       console.log("pdf subscribe")
    //       this.generatePdf()
    //     }
    //   }
    // )

    this.dashboardService.triggerPDF.subscribe((message) => {
      console.log("dashboard trigger", message);
      if (message) {
        console.log("dashboard trigger message", message);
        this.generatePdf();
      }
    });

    this.dashboardService.triggerDashboard.subscribe((message) => {
      if (message) {
        this.saveDashboardPopup = true;
      }
    });

    this.paymentForm = this.fb.group({
      amount: ["", Validators.required],
    })
    this.accessCode = 'AVAQ57KE47AH67QAHA';
   
  }
  ngOnDestroy(): void {
    if (this.triggerEligibilityObs) {
      this.triggerEligibilityObs.unsubscribe();
    }

    // if(this.triggerGenPDF){
    //   console.log("unsubscribe pdf")
    //   this.triggerGenPDF.unsubscribe()
    // }
  }
  @ViewChild("applicantsElm") applicantsElm: any;
  @ViewChild("applicantsElmFSA") applicantsElmFSA: any;
  @ViewChild("applicantsConsumerBureauAnalytics") applicantsConsumerBureauAnalytics: any;
  @ViewChild("applicantsElmIncome") applicantsElmIncome: any;
  @ViewChild("applicantsElmGST") applicantsElmGST: any;
  @ViewChild("applicantsElmBSA") applicantsElmBSA: any;
  @ViewChild("applicantsElmITR") applicantsElmITR: any;
  @ViewChild("dashboardPage") dashboardPage: any;
  @ViewChild("applicantsElmMonthlyObligation")
  applicantsElmMonthlyObligation: any;
  @ViewChild("applicantsElmOtherIntegration")
  applicantsElmOtherIntegration: any;
  @ViewChild("applicantsElmBSAacc") applicantsElmBSAacc: any;
  @ViewChild("applicantsElmCrimeCheck") applicantsElmCrimeCheck: any;
  @ViewChild("applicantsElmBSABankHealth") applicantsElmBSABankHealth!: any;
  @ViewChild("applicantsElmBSABankHealthacc") applicantsElmBSABankHealthacc!: any;

  onSubmit() {
    console.log('click');

    let body = {
      order_id: uuid4(),
      currency: 'INR',
      amount: this.paymentForm.get("amount")?.value,
      app_name: "SENP",
      redirect_url: env.redirectUrl,
      cancel_url: 'www.google.com',
      language: 'EN',
      callback_url:
        'https://webhook.site/2a44053a-c84d-46b2-b1b7-5ce9f71e66be',
    };

    console.log("body", body)

    this.dashboardService.postPayment(body).subscribe({
      next: (res) => {
        console.log("res", res)

        if (res.status){
          let str = res.data.paymentgatewaydetails.paymentgatewayRequest

          console.log("form", this.paymentForm.value)
          this.encRequest = str
          console.log(this.encRequest, this.accessCode)
          setTimeout(() => {
            this.form.nativeElement.submit();
          }, 300);
        }
      },
      error: (err) => {
        console.log('error', err);
      },
    });
  }

  async getOtherIntegrations() {
    for (let i = 0; i < this.users.length; i++) {
      this.otherIntegrationResult[this.users[i].applicantShortName] = {
        PanStatus: {},
        ShopandEstablishment: {},
        DrivingLicense: {},
        // "CaMembership":{},
        // "ICSI":{},
        // "ICWAI":{},
        Employment: {},
        // "MCi":{},
        // "CIBIL":{},
        Passport: {},
        FDA: {},
        FSSAI: {},
        HSN: {},
        VoterID: {},
        PanAadhar: {},
        PanProfile: {},
        // "UDIN":{},
        AadharXML: {},
        Google: {},
      };
    }
    for (var key of Object.keys(this.otherIntegration)) {
      let form = {
        lan: this.lan,
      };
      let url = this.otherIntegration[key].url;
      try {
        let res = await this.dashboardService.getOtherIntegrations(form, url);
        // console.log("ot",res)
        if (key == "VoterID") {
          // Voter ID Details
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].UserDetails.user_name][
              key
            ] = res.data[i].VoterIdResponse.data.result;
          }
        } else if (key == "DrivingLicense") {
          // Driving  License Details
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].executionDetails.user_name][
              key
            ] = res.data[i].drivingLicenceDetails.result;
          }
        } else if (key == "Passport") {
          // Passport Details
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].executionDetails.user_name][
              key
            ] = res.data[i].passportDetails.result;
          }
          // if(res.data.length){
          //   for(let i = 0; i < res.data.length; i++){
          //     this.otherIntegrationResult[res.data[i].executionDetails.user_name][key] = res.data[i].passportDetails.result;
          //   }
          // } else {
          //   for(let i = 0; i < this.applicants.length; i++){
          //     this.otherIntegrationResult[this.applicants[i].custshrtname][key] = {
          //       passportNumber:{},
          //       name:{},
          //       dateOfIssue:{}
          //     }
          //   }
          // }
        } else if (key == "HSN") {
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].UserDetails.user_name][
              key
            ] = res.data[i].HsnCodeResponse.data.result;
          }
        } else if (key == "Google") {
          // Google Search Results
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].executionDetails.user_name][
              key
            ] = res.data[i].googleResult;
          }
        } else if (key == "FDA") {
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].UserDetails.user_name][
              key
            ] = res.data[i].FdaResponse.result;
          }
        } else if (key == "FSSAI") {
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].UserDetails.user_name][
              key
            ] = res.data[i].FssaiResponse.data.result;
          }
        } else if (key == "ShopandEstablishment") {
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].executionDetails.user_name][
              key
            ] = res.data[i].shoppingAndEstablistmentDetails.result;
          }
          // } else if(key == "CaMembership"){
          //   for(let i = 0; i < res.data.length; i++){
          //     this.otherIntegrationResult[res.data[i].executionDetails.user_name][key] = res.data[i].caMembershipDetails.result;
          //   }
          // } else if(key == "ICSI"){
          //   for(let i = 0; i < res.data.length; i++){
          //     this.otherIntegrationResult[res.data[i].executionDetails.user_name][key] = res.data[i].icsiDetails.result[0];
          //   }
        } else if (key === "PanProfile") {
          // Pan Profile Details
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].UserDetails.user_name][
              key
            ] = res.data[i].panProfileResponse.data.result;
          }
        } else if (key === "AadharXML") {
          // Aadhar XML Details
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].UserDetails.user_name][
              key
            ] = res.data[i].AadharXmlResponse.data.result;
          }
          // } else if (key === "UDIN") {
          //   for(let i = 0; i < res.data.length; i++){
          //     this.otherIntegrationResult[res.data[i].UserDetails.user_name][key] = res.data[i].UdinResponse.data.result;
          //   }
        } else if (key === "PanStatus") {
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].executionDetails.user_name][
              key
            ] = res.data[i].panResponse.result;
          }
        } else if (key === "PanAadhar") {
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].UserDetails.user_name][
              key
            ] = res.data[i].PanAadharResponse.data.result;
          }
          // } else if (key === "MCi") {
          //   for(let i = 0; i < res.data.length; i++){
          //     this.otherIntegrationResult[res.data[i].executionDetails.user_name][key] = res.data[i].mciDetails.result;
          //   }
        } else if (key === "Employment") {
          for (let i = 0; i < res.data.length; i++) {
            this.otherIntegrationResult[res.data[i].executionDetails.user_name][
              key
            ] = res.data[i].employeDetails.result;
          }
        }
        // else if (key === "ICWAI") {
        //   for(let i = 0; i < res.data.length; i++){
        //     this.otherIntegrationResult[res.data[i].UserDetails.user_name][key] = res.data[i].AadharXmlResponse.data.result;
        //   }
        // }
      } catch (err: any) {
        // if(key == "Passport"){
        //   for(let i = 0; i < this.applicants.length; i++){
        //     this.otherIntegrationResult[this.applicants[i].custshrtname][key] = {
        //       passportNumber:{},
        //       name:{},
        //       dateOfIssue:{}
        //     }
        //   }
        // }
      }
    }
    this.otherIntegrationUser = this.otherIntegrationResult[this.users[0].applicantShortName];
    setTimeout(() => {
      this.applicantsElmOtherIntegration.nativeElement
        .querySelectorAll(".btn:first-child")
        .forEach((applicant) => {
          applicant.click();
        });
    }, 0);
    // console.log(this.otherIntegrationResult)
    // console.log("this.otherIntegrationUser", this.otherIntegrationUser)
  }

  getDashboardVersionList() {
    this.dashboardService
      .getDashboardVersionList({ lan: this.lan })
      .subscribe((data) => {
        if (data.data) {
          this.dashboardVersionList = data.data.version;
        }
      });
  }

  getApplicants(lan) {
    this.getServices();
    this.viewService.getApplicants({ lan: lan }).subscribe((data) => {
      let dataHFC = data.data.HFC;
      let dataNBFC = data.data.NBFC;

      if (dataHFC.applicant && dataHFC.applicant.length > 0) {
        console.log("HFC");
        this.applicants = dataHFC.applicant;
      } else if (dataNBFC.applicant && dataNBFC.applicant.length > 0) {
        console.log("NBFC");
        this.applicants = dataNBFC.applicant;
      } else {
        console.log("No Applicants");
      }
      // if (data.data.HFC.applicant.length > 0) {
      //   this.applicants = data.data.HFC.applicant;
      // } else {
      //   this.applicants = data.data.NBFC.applicant;
      // }
      setTimeout(() => {
        this.applicantsElm.nativeElement
          .querySelectorAll(".card:first-child")
          .forEach((applicant) => {
            applicant.click();
          });
      }, 0);
      for (let i = 0; i < this.applicants.length; i++) {
        this.applicants[i]["relationshiptokm"] = ""
        if (this.applicants[i].applicant_type == "mainapp") {
          this.LoanType = this.applicants[i].fintype;
          this.location = this.applicants[i].finbranch;
          this.loanPurpose = this.applicants[i].loanPurpose;
          this.subProduct = this.applicants[i].custsubproduct;
        }
        if (this.applicants[i].applicant_type == "co-app") {
          this.applicants[i]["CRIFScore"] = {
            Category: "--",
            Score: "0",
            ScoreName: "BL_CRIF_Score_Card"
          }
        }
        if (
          !this.applicants[i].shareholding &&
          this.applicants[i].applicant_type == "co-app"
        ) {
          this.applicants[i].shareholding = 0;
        }
        // if(!this.applicants[i].keyApplicant && this.applicants[i].applicant_type == 'co-app'){
        //   this.applicants[i].keyApplicant = "NO";
        // }
        // this.users.push(this.applicants[i].custshrtname);
        this.users.push({
          applicantFullName: this.applicants[i].custfname,
          applicantShortName: this.applicants[i].custshrtname
        });
      }

      this.getLogs();
      this.triggerScorecard();
      this.getBasicDetails(this.lan);
      this.getFSADetails();
      this.getRecommendations();
      this.getPdNotes();
      this.getRemarks();
      this.getFICOInput(this.lan);
      this.getIncomeDetail(this.lan);
      this.getSanctionedConditions(this.lan);
      // this.getGstDetails();
      this.getBSADetails();
      this.getITRDetails();
      this.getDashboardVersionList();
      this.getMonthlyObligation();
      this.getAllMonthlyObligationBanknameList();
      this.getAllMonthlyObligationLoanTypeHashMap();
      this.getCrimeCheckDetails()
      this.getOtherIntegrations();
      // this.getLogs();
      this.getSTPDetails();
      this.getManualDeviation();
      this.setCoApplicationDetails();
      this.loader = false;
    });
  }

  updateKeyPerson(e, app) {
    let value = e.target.value
    for (let i = 0; i < this.applicants.length; i++) {
      // console.log("applicant", this.applicants[i], app)
      if (app.custcif === this.applicants[i].custcif) {
        // console.log("true", this.applicants[i])
        if (app.applicant_type === "mainapp") {
          this.applicants[i].corpkeyperson = e.target.value;
        } else {
          this.applicants[i].retailkeyperson = e.target.value;
        }
      } else {
        // console.log("false", this.applicants[i])
        if (e.target.value === "YES") {
          this.applicants[i].retailkeyperson = "NO";
          this.applicants[i].corpkeyperson = "NO";
        }
      }
      // if(app.custshrtname !== this.applicants[i].custshrtname){
      //   console.log("true", this.applicants[i])
      //   this.applicants[i].retailkeyperson = "NO"
      //   console.log("change", this.applicants[i])
      // }
    }
  }

  getBasicDetails(lan) {
    this.dashboardService.getBasicDetails({ lan: lan }).subscribe((data) => {
      let dataHFC = data.data.HFC;
      let dataNBFC = data.data.NBFC;

      if (dataHFC.applicant && dataHFC.applicant.length > 0) {
        console.log("HFC");
        this.applicantsBasicDetails = dataHFC.applicant;
      } else if (dataNBFC.applicant && dataNBFC.applicant.length > 0) {
        console.log("NBFC");
        this.applicantsBasicDetails = dataNBFC.applicant;
      } else {
        console.log("No Applicants");
      }
      // if (data.data.HFC.applicant.length > 0) {
      //   this.applicantsBasicDetails = data.data.HFC.applicant;
      // } else {
      //   this.applicantsBasicDetails = data.data.NBFC.applicant;
      // }
      for (let i = 0; i < this.applicants.length; i++) {
        for (let j = 0; j < this.applicantsBasicDetails.length; j++) {
          if (
            this.applicants[i].custcif == this.applicantsBasicDetails[j].custcif
          ) {
            this.applicants[i].totalworkexp =
              this.applicantsBasicDetails[j].totalworkexp || "";
            this.applicants[i].custsector =
              this.applicantsBasicDetails[j].custsector || "";
            // this.applicants[i].custemptype =
            //   this.applicantsBasicDetails[j].custemptype || "";
            this.applicants[i].qualification =
              this.applicantsBasicDetails[j].qualification || "";
            this.applicants[i].custindustry =
              this.applicantsBasicDetails[j].custindustry || "";
            this.applicants[i].custsubsector =
              this.applicantsBasicDetails[j].custsubsector || "";
            this.applicants[i].addressOwnerShip =
              this.applicantsBasicDetails[j].addressOwnerShip;
          }
        }
      }

      this.getApplicantLastSavedData();
      console.log("this.applicants", this.applicants);
    });
  }

  getFICOInput(lan) {
    this.dashboardService.getFICOInput({ lan: this.lan }).subscribe((res) => {
      let extra = {
        EligibleLoanAount: "",
        // finalEligibleLoanAmountBankingMethod: "",
        // finalEligibleLoanAmountGSTProgram: "",
        // finalEligibleLoanAmountIncomeMethod: "",
        finalEligibilityLoanAmount: {},
        finalEmiAmount: "",
        roiAsPerPolicy: ""
      };

      if (res.data) {
        let dataHFC = res.data.HFC;
        let dataNBFC = res.data.NBFC;

        if (dataHFC.applicant && dataHFC.applicant.length > 0) {
          console.log("HFC");
          this.FICOInput = dataHFC.applicant;
        } else if (dataNBFC.applicant && dataNBFC.applicant.length > 0) {
          console.log("NBFC");
          this.FICOInput = dataNBFC.applicant;
        } else {
          console.log("No Applicants");
        }
        this.FICOInput[0] = {
          ...this.FICOInput[0],
          ...extra,
        };
      } else {
        this.FICOInput[0] = {};
      }

    });
  }

  getIncomeDetail(lan) {
    this.dashboardService.getIncomeDetail({ lan: lan }).subscribe((res) => {
      // console.log("income", res)
      if (res.status && res.data.length) {
        let data = res.data;
        let temp = {};
        let tempEditable = {};
        let extra = {
          ITRFilingDate: "",
          TypeofFinancials: "Audited",
          otherIncome: "",
          otherExpense: "",
        };
        let users: any = [];
        for (let i = 0; i < data.length; i++) {
          let user = data[i].ExecutionDetails.user_name;
          if (this.incomeusers.indexOf(user) == -1) {
            this.incomeusers.push(user);
          }

          if (Object.keys(data[i].AplicantDataUpdated).length !== 0) {
            // console.log("adu not empty", data[i].AplicantDataUpdated)

            // Remove comma, and any character other than digits
            // currentYear
            data[i].AplicantDataUpdated.currentYearData.turnoverAsPerFinancials = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.turnoverAsPerFinancials)
            data[i].AplicantDataUpdated.currentYearData.turnoverAsPerGST = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.turnoverAsPerGST)
            data[i].AplicantDataUpdated.currentYearData.grossProfit = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.grossProfit)
            data[i].AplicantDataUpdated.currentYearData.profitAfterTax = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.profitAfterTax)
            data[i].AplicantDataUpdated.currentYearData.depreciation = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.depreciation)
            data[i].AplicantDataUpdated.currentYearData.salaryPaidToPartner = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.salaryPaidToPartner)
            data[i].AplicantDataUpdated.currentYearData.interestPaidToPartner = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.interestPaidToPartner)
            data[i].AplicantDataUpdated.currentYearData.directorsRenumeration = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.directorsRenumeration)
            data[i].AplicantDataUpdated.currentYearData.nonOperatingExpense = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.nonOperatingExpense)
            data[i].AplicantDataUpdated.currentYearData.nonOperatingIncome = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.nonOperatingIncome)
            data[i].AplicantDataUpdated.currentYearData.otherIncome = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.otherIncome)
            data[i].AplicantDataUpdated.currentYearData.otherExpense = this.removeCurrency(data[i].AplicantDataUpdated.currentYearData.otherExpense)

            // Calculate currentYearData total income
            data[i].AplicantDataUpdated.currentYearData.totalincome = (
              data[i].AplicantDataUpdated.currentYearData.profitAfterTax +
              data[i].AplicantDataUpdated.currentYearData.depreciation +
              data[i].AplicantDataUpdated.currentYearData.salaryPaidToPartner +
              data[i].AplicantDataUpdated.currentYearData.interestPaidToPartner +
              data[i].AplicantDataUpdated.currentYearData.directorsRenumeration +
              data[i].AplicantDataUpdated.currentYearData.otherIncome -
              data[i].AplicantDataUpdated.currentYearData.otherExpense
            ).toFixed(2);

            // Remove comma, and any character other than digits
            // previousYear
            data[i].AplicantDataUpdated.previousYearData.turnoverAsPerFinancials = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.turnoverAsPerFinancials)
            data[i].AplicantDataUpdated.previousYearData.turnoverAsPerGST = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.turnoverAsPerGST)
            data[i].AplicantDataUpdated.previousYearData.grossProfit = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.grossProfit)
            data[i].AplicantDataUpdated.previousYearData.profitAfterTax = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.profitAfterTax)
            data[i].AplicantDataUpdated.previousYearData.depreciation = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.depreciation)
            data[i].AplicantDataUpdated.previousYearData.salaryPaidToPartner = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.salaryPaidToPartner)
            data[i].AplicantDataUpdated.previousYearData.interestPaidToPartner = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.interestPaidToPartner)
            data[i].AplicantDataUpdated.previousYearData.directorsRenumeration = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.directorsRenumeration)
            data[i].AplicantDataUpdated.previousYearData.nonOperatingExpense = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.nonOperatingExpense)
            data[i].AplicantDataUpdated.previousYearData.nonOperatingIncome = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.nonOperatingIncome)
            data[i].AplicantDataUpdated.previousYearData.otherIncome = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.otherIncome)
            data[i].AplicantDataUpdated.previousYearData.otherExpense = this.removeCurrency(data[i].AplicantDataUpdated.previousYearData.otherExpense)

            // Calculate previousYearData total income
            data[i].AplicantDataUpdated.previousYearData.totalincome = (
              data[i].AplicantDataUpdated.previousYearData.profitAfterTax +
              data[i].AplicantDataUpdated.previousYearData.depreciation +
              data[i].AplicantDataUpdated.previousYearData.salaryPaidToPartner +
              data[i].AplicantDataUpdated.previousYearData.interestPaidToPartner +
              data[i].AplicantDataUpdated.previousYearData.directorsRenumeration +
              data[i].AplicantDataUpdated.previousYearData.otherIncome -
              data[i].AplicantDataUpdated.previousYearData.otherExpense
            ).toFixed(2);

            // bsa details
            data[i].AplicantDataUpdated.BSADetails.SumofBusinessCreditfor12months = this.removeCurrency(data[i].AplicantDataUpdated.BSADetails.SumofBusinessCreditfor12months)
            data[i].AplicantDataUpdated.BSADetails.MonthlyAverageBankBalancefor6months = this.removeCurrency(data[i].AplicantDataUpdated.BSADetails.MonthlyAverageBankBalancefor6months)
            data[i].AplicantDataUpdated.BSADetails.MonthlyAverageBankBalancefor12months = this.removeCurrency(data[i].AplicantDataUpdated.BSADetails.MonthlyAverageBankBalancefor12months)
            data[i].AplicantDataUpdated.BSADetails.MinimumABBfor12months = this.removeCurrency(data[i].AplicantDataUpdated.BSADetails.MinimumABBfor12months)
            data[i].AplicantDataUpdated.BSADetails["MinimumCreditAmountP.M.Normfor12months"] = this.removeCurrency(data[i].AplicantDataUpdated.BSADetails["MinimumCreditAmountP.M.Normfor12months"])

            // Non Currency fields
            // bsa bto
            data[i].AplicantDataUpdated.BSADetails.BTO = this.removeCurrencyStr(data[i].AplicantDataUpdated.BSADetails.BTO)
            data[i].AplicantDataUpdated.BSADetails["MinimumcreditCountP.M.normfor12Months"] = this.removeCurrencyStr(data[i].AplicantDataUpdated.BSADetails["MinimumcreditCountP.M.normfor12Months"])

            // Non Currency fields
            data[i].AplicantDataUpdated.BSADetails.IwOwRatio = this.removeCurrencyStr(data[i].AplicantDataUpdated.BSADetails.IwOwRatio)

            // growth percentage
            data[
              i
            ].AplicantDataUpdated.GrowthPercentage.growthperTurnoverAsperfinancial =
              (
                ((data[i].AplicantDataUpdated.currentYearData
                  .turnoverAsPerFinancials -
                  data[i].AplicantDataUpdated.previousYearData
                    .turnoverAsPerFinancials) /
                  data[i].AplicantDataUpdated.previousYearData
                    .turnoverAsPerFinancials) *
                100
              ).toFixed(2);
            data[
              i
            ].AplicantDataUpdated.GrowthPercentage.growthperTurnoverAsperGst = (
              ((data[i].AplicantDataUpdated.currentYearData.turnoverAsPerGST -
                data[i].AplicantDataUpdated.previousYearData.turnoverAsPerGST) /
                data[i].AplicantDataUpdated.previousYearData.turnoverAsPerGST) *
              100
            ).toFixed(2);
            data[i].AplicantDataUpdated.GrowthPercentage.growthperdepreciation =
              (
                ((data[i].AplicantDataUpdated.currentYearData.depreciation -
                  data[i].AplicantDataUpdated.previousYearData.depreciation) /
                  data[i].AplicantDataUpdated.previousYearData.depreciation) *
                100
              ).toFixed(2);
            data[
              i
            ].AplicantDataUpdated.GrowthPercentage.growthperdirectorsRenumeration =
              (
                ((data[i].AplicantDataUpdated.currentYearData
                  .directorsRenumeration -
                  data[i].AplicantDataUpdated.previousYearData
                    .directorsRenumeration) /
                  data[i].AplicantDataUpdated.previousYearData
                    .directorsRenumeration) *
                100
              ).toFixed(2);
            data[i].AplicantDataUpdated.GrowthPercentage.growthpergrossProfit =
              (
                ((data[i].AplicantDataUpdated.currentYearData.grossProfit -
                  data[i].AplicantDataUpdated.previousYearData.grossProfit) /
                  data[i].AplicantDataUpdated.previousYearData.grossProfit) *
                100
              ).toFixed(2);
            data[
              i
            ].AplicantDataUpdated.GrowthPercentage.growthperinterestPaidToPartner =
              (
                ((data[i].AplicantDataUpdated.currentYearData
                  .interestPaidToPartner -
                  data[i].AplicantDataUpdated.previousYearData
                    .interestPaidToPartner) /
                  data[i].AplicantDataUpdated.previousYearData
                    .interestPaidToPartner) *
                100
              ).toFixed(2);
            data[
              i
            ].AplicantDataUpdated.GrowthPercentage.growthpernonOperatingExpense =
              (
                ((data[i].AplicantDataUpdated.currentYearData
                  .nonOperatingExpense -
                  data[i].AplicantDataUpdated.previousYearData
                    .nonOperatingExpense) /
                  data[i].AplicantDataUpdated.previousYearData
                    .nonOperatingExpense) *
                100
              ).toFixed(2);
            data[
              i
            ].AplicantDataUpdated.GrowthPercentage.growthpernonOperatingIncome =
              (
                ((data[i].AplicantDataUpdated.currentYearData
                  .nonOperatingIncome -
                  data[i].AplicantDataUpdated.previousYearData
                    .nonOperatingIncome) /
                  data[i].AplicantDataUpdated.previousYearData
                    .nonOperatingIncome) *
                100
              ).toFixed(2);
            data[
              i
            ].AplicantDataUpdated.GrowthPercentage.growthperprofitAfterTax = (
              ((data[i].AplicantDataUpdated.currentYearData.profitAfterTax -
                data[i].AplicantDataUpdated.previousYearData.profitAfterTax) /
                data[i].AplicantDataUpdated.previousYearData.profitAfterTax) *
              100
            ).toFixed(2);
            data[
              i
            ].AplicantDataUpdated.GrowthPercentage.growthpersalaryPaidToPartner =
              (
                ((data[i].AplicantDataUpdated.currentYearData
                  .salaryPaidToPartner -
                  data[i].AplicantDataUpdated.previousYearData
                    .salaryPaidToPartner) /
                  data[i].AplicantDataUpdated.previousYearData
                    .salaryPaidToPartner) *
                100
              ).toFixed(2);
            data[i].AplicantDataUpdated.GrowthPercentage.growthpertotalincome =
              (
                ((data[i].AplicantDataUpdated.currentYearData.totalincome -
                  data[i].AplicantDataUpdated.previousYearData.totalincome) /
                  data[i].AplicantDataUpdated.previousYearData.totalincome) *
                100
              ).toFixed(2);
            data[i].AplicantDataUpdated.GrowthPercentage.growthperotherExpense =
              (
                ((data[i].AplicantDataUpdated.currentYearData.otherExpense -
                  data[i].AplicantDataUpdated.previousYearData.otherExpense) /
                  data[i].AplicantDataUpdated.previousYearData.otherExpense) *
                100
              ).toFixed(2);
            data[i].AplicantDataUpdated.GrowthPercentage.growthperotherIncome =
              (
                ((data[i].AplicantDataUpdated.currentYearData.otherIncome -
                  data[i].AplicantDataUpdated.previousYearData.otherIncome) /
                  data[i].AplicantDataUpdated.previousYearData.otherIncome) *
                100
              ).toFixed(2);

            // add currency format
            // currentYear
            data[i].AplicantDataUpdated.currentYearData.turnoverAsPerFinancials = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.turnoverAsPerFinancials)
            data[i].AplicantDataUpdated.currentYearData.turnoverAsPerGST = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.turnoverAsPerGST)
            data[i].AplicantDataUpdated.currentYearData.grossProfit = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.grossProfit)
            data[i].AplicantDataUpdated.currentYearData.profitAfterTax = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.profitAfterTax)
            data[i].AplicantDataUpdated.currentYearData.depreciation = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.depreciation)
            data[i].AplicantDataUpdated.currentYearData.salaryPaidToPartner = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.salaryPaidToPartner)
            data[i].AplicantDataUpdated.currentYearData.interestPaidToPartner = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.interestPaidToPartner)
            data[i].AplicantDataUpdated.currentYearData.directorsRenumeration = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.directorsRenumeration)
            data[i].AplicantDataUpdated.currentYearData.nonOperatingExpense = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.nonOperatingExpense)
            data[i].AplicantDataUpdated.currentYearData.nonOperatingIncome = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.nonOperatingIncome)
            data[i].AplicantDataUpdated.currentYearData.otherIncome = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.otherIncome)
            data[i].AplicantDataUpdated.currentYearData.otherExpense = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.otherExpense)
            data[i].AplicantDataUpdated.currentYearData.totalincome = this.addCurrency(data[i].AplicantDataUpdated.currentYearData.totalincome)

            // previousYear
            data[i].AplicantDataUpdated.previousYearData.turnoverAsPerFinancials = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.turnoverAsPerFinancials)
            data[i].AplicantDataUpdated.previousYearData.turnoverAsPerGST = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.turnoverAsPerGST)
            data[i].AplicantDataUpdated.previousYearData.grossProfit = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.grossProfit)
            data[i].AplicantDataUpdated.previousYearData.profitAfterTax = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.profitAfterTax)
            data[i].AplicantDataUpdated.previousYearData.depreciation = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.depreciation)
            data[i].AplicantDataUpdated.previousYearData.salaryPaidToPartner = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.salaryPaidToPartner)
            data[i].AplicantDataUpdated.previousYearData.interestPaidToPartner = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.interestPaidToPartner)
            data[i].AplicantDataUpdated.previousYearData.directorsRenumeration = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.directorsRenumeration)
            data[i].AplicantDataUpdated.previousYearData.nonOperatingExpense = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.nonOperatingExpense)
            data[i].AplicantDataUpdated.previousYearData.nonOperatingIncome = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.nonOperatingIncome)
            data[i].AplicantDataUpdated.previousYearData.otherIncome = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.otherIncome)
            data[i].AplicantDataUpdated.previousYearData.otherExpense = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.otherExpense)
            data[i].AplicantDataUpdated.previousYearData.totalincome = this.addCurrency(data[i].AplicantDataUpdated.previousYearData.totalincome)

            // bsa details

            if (data[i].AplicantDataUpdated.BSADetails.isLogicUpdated){

              // bsa 6 months
              data[i].AplicantDataUpdated.BSADetails.SumofBusinessCreditfor6months = this.addCurrency(data[i].AplicantDataUpdated.BSADetails.SumofBusinessCreditfor6months)
              data[i].AplicantDataUpdated.BSADetails.MinimumABBfor6months = this.addCurrency(data[i].AplicantDataUpdated.BSADetails.MinimumABBfor6months)

              data[i].AplicantDataUpdated.BSADetails["MinimumCreditAmountP.M.Normfor6months"] = this.addCurrency(data[i].AplicantDataUpdated.BSADetails["MinimumCreditAmountP.M.Normfor6months"])
            }

            // bsa 6 months
            data[i].AplicantDataUpdated.BSADetails.MonthlyAverageBankBalancefor6months = this.addCurrency(data[i].AplicantDataUpdated.BSADetails.MonthlyAverageBankBalancefor6months)

            // bsa 12 months
            data[i].AplicantDataUpdated.BSADetails.SumofBusinessCreditfor12months = this.addCurrency(data[i].AplicantDataUpdated.BSADetails.SumofBusinessCreditfor12months)
            data[i].AplicantDataUpdated.BSADetails.MonthlyAverageBankBalancefor12months = this.addCurrency(data[i].AplicantDataUpdated.BSADetails.MonthlyAverageBankBalancefor12months)
            data[i].AplicantDataUpdated.BSADetails.MinimumABBfor12months = this.addCurrency(data[i].AplicantDataUpdated.BSADetails.MinimumABBfor12months)
            data[i].AplicantDataUpdated.BSADetails["MinimumCreditAmountP.M.Normfor12months"] = this.addCurrency(data[i].AplicantDataUpdated.BSADetails["MinimumCreditAmountP.M.Normfor12months"])

            tempEditable[data[i].ExecutionDetails.user_name] = {
              currentYearData: {
                ...data[i].AplicantDataUpdated.currentYearData,
              },
              previousYearData: {
                ...data[i].AplicantDataUpdated.previousYearData,
              },
            };

            if (!tempEditable[data[i].ExecutionDetails.user_name].currentYearData.hasOwnProperty("TypeofFinancials")) {
              tempEditable[data[i].ExecutionDetails.user_name].currentYearData["TypeofFinancials"] = ""
            }

            if (!tempEditable[data[i].ExecutionDetails.user_name].previousYearData.hasOwnProperty("TypeofFinancials")) {
              tempEditable[data[i].ExecutionDetails.user_name].previousYearData["TypeofFinancials"] = ""
            }

            if (!tempEditable[data[i].ExecutionDetails.user_name].currentYearData.hasOwnProperty("ITRFilingDate")) {
              tempEditable[data[i].ExecutionDetails.user_name].currentYearData["ITRFilingDate"] = ""
            }

            if (!tempEditable[data[i].ExecutionDetails.user_name].previousYearData.hasOwnProperty("ITRFilingDate")) {
              tempEditable[data[i].ExecutionDetails.user_name].previousYearData["ITRFilingDate"] = ""
            }

            // currentYear
            if (tempEditable[data[i].ExecutionDetails.user_name].currentYearData.ITRFilingDate !== "") {

              tempEditable[data[i].ExecutionDetails.user_name].currentYearData.ITRFilingDate = this.removeCurrencyStr(tempEditable[data[i].ExecutionDetails.user_name].currentYearData.ITRFilingDate)

              tempEditable[data[i].ExecutionDetails.user_name].currentYearData.ITRFilingDate = this.formatDate(tempEditable[data[i].ExecutionDetails.user_name].currentYearData.ITRFilingDate, "")
            }

            // previousYear
            if (tempEditable[data[i].ExecutionDetails.user_name].previousYearData.ITRFilingDate !== "") {

              tempEditable[data[i].ExecutionDetails.user_name].previousYearData.ITRFilingDate = this.removeCurrencyStr(tempEditable[data[i].ExecutionDetails.user_name].previousYearData.ITRFilingDate)

              tempEditable[data[i].ExecutionDetails.user_name].previousYearData.ITRFilingDate = this.formatDate(tempEditable[data[i].ExecutionDetails.user_name].previousYearData.ITRFilingDate, "")
            }

          }

          if (Object.keys(data[i].Applicantdata).length !== 0) {
            // console.log("ad not empty", data[i].Applicantdata)
            data[i].Applicantdata.IncomeData.map((obj) => {
              obj.totalincome =
                this.toNumber.transform(obj.profitAfterTax) +
                this.toNumber.transform(obj.depreciation) +
                this.toNumber.transform(obj.salaryPaidToPartner) +
                this.toNumber.transform(obj.interestPaidToPartner) +
                this.toNumber.transform(obj.directorsRenumeration) +
                this.toNumber.transform(obj.otherIncome) +
                this.toNumber.transform(obj.otherExpense);
            });

            if (
              data[i].Applicantdata.IncomeData[0].year >
              data[i].Applicantdata.IncomeData[1].year
            ) {
              temp[data[i].ExecutionDetails.user_name] = {
                currentYearData: {
                  ...data[i].Applicantdata.IncomeData[0],
                  ...extra,
                },
                previousYearData: {
                  ...data[i].Applicantdata.IncomeData[1],
                  ...extra,
                },
              };
            } else {
              temp[data[i].ExecutionDetails.user_name] = {
                currentYearData: {
                  ...data[i].Applicantdata.IncomeData[1],
                  ...extra,
                },
                previousYearData: {
                  ...data[i].Applicantdata.IncomeData[0],
                  ...extra,
                },
              };
            }

            // BTO for 12 months
            data[i].Applicantdata.BSADetails["BTO"] =
              (this.toNumber.transform(
                data[i].Applicantdata.BSADetails.SumofBusinessCreditfor12months
              ) /
                this.toNumber.transform(
                  temp[data[i].ExecutionDetails.user_name].currentYearData
                    .turnoverAsPerGST
                )) *
              100;

            data[i].Applicantdata.BSADetails["BTOfor6months"] =
              (this.toNumber.transform(
                data[i].Applicantdata.BSADetails.SumofBusinessCreditfor6months
              ) /
                this.toNumber.transform(
                  temp[data[i].ExecutionDetails.user_name].currentYearData
                    .turnoverAsPerGST
                )) *
              100;

            // console.log(data[i].Applicantdata.BSADetails["BTO"])
          }

          if (Object.keys(data[i].Applicantdata).length === 0) {
            temp[data[i].ExecutionDetails.user_name] = JSON.parse(
              JSON.stringify(this.applicantIncomeBlankResponse)
            );
          } else {

            if (data[i].Applicantdata.BSADetails.isLogicUpdated) {
              data[i].Applicantdata.BSADetails["isLogicUpdated"] = true

            } else {

              data[i].Applicantdata.BSADetails["SumofBusinessCreditfor6months"] = data[i].Applicantdata.BSADetails.SumofBusinessCreditfor12months
              data[i].Applicantdata.BSADetails.SumofBusinessCreditfor12months = "0"

              data[i].Applicantdata.BSADetails["MonthlyAverageBankBalancefor6months"] = data[i].Applicantdata.BSADetails.MonthlyAverageBankBalancefor12months
              data[i].Applicantdata.BSADetails.MonthlyAverageBankBalancefor12months = "0"

              data[i].Applicantdata.BSADetails["BTOfor6months"] = data[i].Applicantdata.BSADetails.BTO
              data[i].Applicantdata.BSADetails.BTO = "0"

              data[i].Applicantdata.BSADetails["MinimumABBfor6months"] = data[i].Applicantdata.BSADetails.MinimumABBfor12months
              data[i].Applicantdata.BSADetails.MinimumABBfor12months = "0"

              data[i].Applicantdata.BSADetails["MinimumcreditCountP.M.normfor6Months"] = data[i].Applicantdata.BSADetails["MinimumcreditCountP.M.normfor12Months"]
              data[i].Applicantdata.BSADetails["MinimumcreditCountP.M.normfor12Months"] = "0"

              data[i].Applicantdata.BSADetails["MinimumCreditAmountP.M.Normfor6months"] = data[i].Applicantdata.BSADetails["MinimumCreditAmountP.M.Normfor12months"]
              data[i].Applicantdata.BSADetails["MinimumCreditAmountP.M.Normfor12months"] = "0"

              data[i].Applicantdata.BSADetails["isLogicUpdated"] = true
            }

            temp[data[i].ExecutionDetails.user_name] = {
              ...temp[data[i].ExecutionDetails.user_name],
              ...{ GrowthPercentage: data[i].Applicantdata.GrowthPercentage },
              ...{ BSADetails: data[i].Applicantdata.BSADetails },
            };
          }

          if (Object.keys(data[i].AplicantDataUpdated).length === 0) {
            tempEditable[data[i].ExecutionDetails.user_name] = JSON.parse(
              JSON.stringify(this.applicantIncomeBlankResponse)
            );
          } else {

            if (data[i].AplicantDataUpdated.BSADetails.isLogicUpdated) {
              data[i].AplicantDataUpdated.BSADetails["isLogicUpdated"] = true

            } else {

              data[i].AplicantDataUpdated.BSADetails["SumofBusinessCreditfor6months"] = data[i].AplicantDataUpdated.BSADetails.SumofBusinessCreditfor12months
              data[i].AplicantDataUpdated.BSADetails.SumofBusinessCreditfor12months = "0"

              data[i].AplicantDataUpdated.BSADetails["MonthlyAverageBankBalancefor6months"] = data[i].AplicantDataUpdated.BSADetails.MonthlyAverageBankBalancefor12months
              data[i].AplicantDataUpdated.BSADetails.MonthlyAverageBankBalancefor12months = "0"

              data[i].AplicantDataUpdated.BSADetails["BTOfor6months"] = data[i].AplicantDataUpdated.BSADetails.BTO
              data[i].AplicantDataUpdated.BSADetails.BTO = "0"

              data[i].AplicantDataUpdated.BSADetails["MinimumABBfor6months"] = data[i].AplicantDataUpdated.BSADetails.MinimumABBfor12months
              data[i].AplicantDataUpdated.BSADetails.MinimumABBfor12months = "0"

              data[i].AplicantDataUpdated.BSADetails["MinimumcreditCountP.M.normfor6Months"] = data[i].AplicantDataUpdated.BSADetails["MinimumcreditCountP.M.normfor12Months"]
              data[i].AplicantDataUpdated.BSADetails["MinimumcreditCountP.M.normfor12Months"] = "0"

              data[i].AplicantDataUpdated.BSADetails["MinimumCreditAmountP.M.Normfor6months"] = data[i].AplicantDataUpdated.BSADetails["MinimumCreditAmountP.M.Normfor12months"]
              data[i].AplicantDataUpdated.BSADetails["MinimumCreditAmountP.M.Normfor12months"] = "0"

              data[i].AplicantDataUpdated.BSADetails["isLogicUpdated"] = true
            }

            tempEditable[data[i].ExecutionDetails.user_name] = {
              ...tempEditable[data[i].ExecutionDetails.user_name],
              ...{
                GrowthPercentage: data[i].AplicantDataUpdated.GrowthPercentage,
              },
              ...{ BSADetails: data[i].AplicantDataUpdated.BSADetails },
            };
          }
        }
        console.log(tempEditable);
        console.log(temp)
        this.applicantIncome = temp;
        this.applicantIncomeEditable = tempEditable;
        // console.log("income", this.applicantIncome)
        // console.log("income edit", this.applicantIncomeEditable)
        for (let i = 0; i < this.users.length; i++) {
          if (this.applicantIncome[this.users[i].applicantShortName] === undefined) {
            // console.log("undefined")
            this.applicantIncome[this.users[i].applicantShortName] = JSON.parse(
              JSON.stringify(this.applicantIncomeBlankResponse)
            );
            this.applicantIncomeEditable[this.users[i].applicantShortName] = JSON.parse(
              JSON.stringify(this.applicantIncomeBlankResponse)
            );
          }
        }
      } else {
        for (let i = 0; i < this.users.length; i++) {
          this.applicantIncome[this.users[i].applicantShortName] = JSON.parse(
            JSON.stringify(this.applicantIncomeBlankResponse)
          );
          this.applicantIncomeEditable[this.users[i].applicantShortName] = JSON.parse(
            JSON.stringify(this.applicantIncomeBlankResponse)
          );
        }
      }
      setTimeout(() => {
        this.applicantsElmIncome.nativeElement
          .querySelectorAll("button:first-child")
          .forEach((applicant) => {
            applicant.click();
          });
      }, 0);
      this.getGstDetails();
      this.calculateBTOfor6months()
      this.calculateBTOfor12months()
    });
  }

  formatNumber(n, type) {
    if (n === "") {
      n = "0"
    }

    if (type === "currency") {
      // format number 1000000 to 1,234,567
      return n.replace(/[^0-9-]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    } else if (type === "string") {
      // format number
      return n.replace(/[^0-9-]/g, "")
    }
  }

  addCurrency(value) {
    value = String(value)
    return this.currencyPipe.transform(value, "USD", "")!
  }

  removeCurrency(value): number {
    value = String(value)
    return Number(value.replace(/[^0-9.-]+/g, ""));
  }

  removeCurrencyStr(value): string {
    value = String(value)
    return value.replace(/[^0-9.-]+/g, "");
  }

  formatCurrency(event: any, blur, keyField, dataField) {

    const input = event.target as HTMLInputElement;

    let input_val = input.value;
    if (input_val === '') { return; }

    if (input_val.indexOf('.') >= 0) {

      const decimal_pos = input_val.indexOf('.');

      let left_side = input_val.substring(0, decimal_pos);
      let right_side = input_val.substring(decimal_pos);

      left_side = this.formatNumber(left_side, "currency");
      right_side = this.formatNumber(right_side, "currency");

      if (blur === 'blur') {
        right_side += '00';
      }

      right_side = right_side.substring(0, 2);

      input_val = left_side + '.' + right_side;

    } else {

      input_val = this.formatNumber(input_val, "currency");
      input_val = input_val;

      if (blur === 'blur') {
        input_val += '.00';
      }
    }

    input.value = input_val;
    this.applicantIncomeDetailsEditable[keyField][dataField] = input_val
  }

  formatString(event: any, blur, keyField, dataField) {

    const input = event.target as HTMLInputElement;

    let input_val = input.value;
    if (input_val === '') { return; }

    if (dataField === "IwOwRatio") {

      input_val = this.formatNumber(input_val, "string");
      input_val = input_val;

    } else {
      if (input_val.indexOf('.') >= 0) {

        const decimal_pos = input_val.indexOf('.');

        let left_side = input_val.substring(0, decimal_pos);
        let right_side = input_val.substring(decimal_pos);

        left_side = this.formatNumber(left_side, "string");
        right_side = this.formatNumber(right_side, "string");

        if (blur === 'blur') {
          right_side += '00';
        }

        right_side = right_side.substring(0, 2);

        input_val = left_side + '.' + right_side;

      } else {

        input_val = this.formatNumber(input_val, "string");
        input_val = input_val;

        if (blur === 'blur') {
          input_val += '.00';
        }
      }
    }

    input.value = input_val;
    this.applicantIncomeDetailsEditable[keyField][dataField] = input_val
  }

  formatDate(date, value) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    // if (value === "eligibility") {
    //   return [day, month, year].join('-');
    // } 
    // else {
    return [year, month, day].join('-');
    // }
  }

  calculateGrowthPercentage(key, field) {
    // console.log("growth",key, field)

    for (let i = 0; i < this.applicants.length; i++) {
      if (this.applicantIncomeEditable[this.applicants[i].custshrtname]) {
        let user =
          this.applicantIncomeEditable[this.applicants[i].custshrtname];

        let keyField = `growthper${field}`;

        if (key === "financials") {
          user.GrowthPercentage.growthperTurnoverAsperfinancial = (
            ((this.removeCurrency(user.currentYearData[field]) - this.removeCurrency(user.previousYearData[field])) /
              this.removeCurrency(user.previousYearData[field])) *
            100
          ).toFixed(2);
        } else if (key === "gst") {
          user.GrowthPercentage.growthperTurnoverAsperGst = (
            ((this.removeCurrency(user.currentYearData[field]) - this.removeCurrency(user.previousYearData[field])) /
              this.removeCurrency(user.previousYearData[field])) *
            100
          ).toFixed(2);
        } else {
          user.GrowthPercentage[keyField] = (
            ((this.removeCurrency(user.currentYearData[field]) - this.removeCurrency(user.previousYearData[field])) /
              this.removeCurrency(user.previousYearData[field])) *
            100
          ).toFixed(2);
        }
      }
    }
  }

  calculateIncomeTotal(val) {
    //console.log("here");
    let obj: any = {};
    let total = 0;

    obj = this.applicantIncomeDetailsEditable[val];
    total = Number(
      (
        this.removeCurrency(obj.profitAfterTax) +
        this.removeCurrency(obj.depreciation) +
        this.removeCurrency(obj.salaryPaidToPartner) +
        this.removeCurrency(obj.interestPaidToPartner) +
        this.removeCurrency(obj.directorsRenumeration) +
        this.removeCurrency(obj.otherIncome) -
        this.removeCurrency(obj.otherExpense)
      ).toFixed(2)
    );

    obj.totalincome = this.addCurrency(total);

    this.calculateGrowthPercentage("", 'totalincome')
    //console.log(this.applicantIncomeDetailsEditable.previousYearData.totalincome);
  }

  calculateBTOfor12months() {
    for (let i = 0; i < this.applicants.length; i++) {
      if (this.applicantIncomeEditable[this.applicants[i].custshrtname]) {
        let user =
          this.applicantIncomeEditable[this.applicants[i].custshrtname];
        user.BSADetails.BTO = (
          (this.removeCurrency(user.BSADetails.SumofBusinessCreditfor12months) /
            this.removeCurrency(user.currentYearData.turnoverAsPerGST)) *
          100
        ).toFixed(2);
      }
    }
  }

  calculateBTOfor6months() {
    for (let i = 0; i < this.applicants.length; i++) {
      if (this.applicantIncomeEditable[this.applicants[i].custshrtname]) {
        let user =
          this.applicantIncomeEditable[this.applicants[i].custshrtname];
        user.BSADetails.BTOfor6months = (
          (this.removeCurrency(user.BSADetails.SumofBusinessCreditfor6months) /
            this.removeCurrency(user.currentYearData.turnoverAsPerGST)) *
          100
        ).toFixed(2);
      }
    }
  }

  removeCommaIncomeDetails(applicantIncomeEditable): any {

    let tempEditable = {}

    Object.keys(applicantIncomeEditable).map((user) => {
      tempEditable[user] = {}

      let userData = applicantIncomeEditable[user]

      Object.keys(userData).map((data) => {

        if (data === "currentYearData") {

          tempEditable[user]["currentYearData"] = {}

          Object.keys(userData[data]).map((key) => {
            if (key === "ITRFilingDate" || key === "TypeofFinancials" || key === "greatestIndividualContributor") {
              tempEditable[user]["currentYearData"][key] = userData[data][key]
            } else {
              tempEditable[user]["currentYearData"][key] = this.removeCurrencyStr(userData[data][key])
            }
          })
        } else if (data === "previousYearData") {

          tempEditable[user]["previousYearData"] = {}

          Object.keys(userData[data]).map((key) => {
            if (key === "ITRFilingDate" || key === "TypeofFinancials" || key === "greatestIndividualContributor") {
              tempEditable[user]["previousYearData"][key] = userData[data][key]
            } else {
              tempEditable[user]["previousYearData"][key] = this.removeCurrencyStr(userData[data][key])
            }
          })

        } else if (data === "BSADetails") {

          tempEditable[user]["BSADetails"] = {}

          Object.keys(userData[data]).map((key) => {
            if (key === "MinimumcreditCountP.M.normfor12Months" || key === "BTO" || key === "MinimumcreditCountP.M.normfor6Months" || key === "BTOfor6months" || key === "IwOwRatio" || key === "isLogicUpdated") {
              tempEditable[user]["BSADetails"][key] = userData[data][key]
            } else {
              tempEditable[user]["BSADetails"][key] = this.removeCurrencyStr(userData[data][key])
            }
          })
        } else {
          tempEditable[user]["GrowthPercentage"] = { ...userData["GrowthPercentage"] }
        }

      })
    })

    // console.log(tempEditable)
    return tempEditable
  }

  getServices() {
    this.viewService.getServices().subscribe((data) => {
      this.services = data.data;
      setTimeout(() => {
        this.applicantsElm.nativeElement
          .querySelectorAll(".card:first-child")
          .forEach((applicant) => {
            applicant.click();
          });
      }, 0);
    });
  }

  getFSADetails() {
    this.dashboardService.getFSADetails({ lan: this.lan }).subscribe((res) => {
      let data = res.data;
      let tempFSA = {};
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let user = data[i].executionDetails.user_name;
          console.log("data[i]", data[i]);
          for (const property in data[i].profitAndLoss) {
            if (tempFSA.hasOwnProperty(user)) {
              if (tempFSA[user].profitAndLoss.hasOwnProperty(property)) {
                tempFSA[user].profitAndLoss[property].push(
                  data[i].profitAndLoss[property]
                );
              } else {
                tempFSA[user].profitAndLoss[property] = [
                  data[i].profitAndLoss[property],
                ];
              }
            } else {
              tempFSA[user] = {};
              tempFSA[user]["profitAndLoss"] = {};
              tempFSA[user].profitAndLoss[property] = [
                data[i].profitAndLoss[property],
              ];
            }
          }
          for (const property in data[i].RatioAnalysis) {
            let pro = property.replace("/", "_");
            if (
              tempFSA.hasOwnProperty(user) &&
              tempFSA[user].hasOwnProperty("RatioAnalysis")
            ) {
              if (tempFSA[user].RatioAnalysis.hasOwnProperty(pro)) {
                tempFSA[user].RatioAnalysis[pro].push(
                  data[i].RatioAnalysis[property]
                );
              } else {
                tempFSA[user].RatioAnalysis[pro] = [
                  data[i].RatioAnalysis[property],
                ];
              }
            } else {
              tempFSA[user]["RatioAnalysis"] = {};
              tempFSA[user].RatioAnalysis[pro] = [
                data[i].RatioAnalysis[property],
              ];
            }
          }
          for (const property in data[i].BalanceSheet) {
            for (const p1 in data[i].BalanceSheet[property]) {
              if (tempFSA[user].hasOwnProperty("BalanceSheet")) {
                if (
                  tempFSA[user].BalanceSheet.hasOwnProperty(property) &&
                  tempFSA[user].BalanceSheet[property].hasOwnProperty(p1)
                ) {
                  tempFSA[user].BalanceSheet[property][p1].push(
                    data[i].BalanceSheet[property][p1]
                  );
                } else {
                  if (!tempFSA[user].BalanceSheet.hasOwnProperty(property)) {
                    tempFSA[user].BalanceSheet[property] = {};
                  }
                  tempFSA[user].BalanceSheet[property][p1] = [
                    data[i].BalanceSheet[property][p1],
                  ];
                }
              } else {
                tempFSA[user]["BalanceSheet"] = {};
                tempFSA[user]["BalanceSheet"][property] = {};
                tempFSA[user].BalanceSheet[property][p1] = [
                  data[i].BalanceSheet[property][p1],
                ];
              }
            }
          }

          for (const property in data[i].blFields) {
            let pro = property.replace("/", "_");
            if (
              tempFSA.hasOwnProperty(user) &&
              tempFSA[user].hasOwnProperty("blFields")
            ) {
              if (tempFSA[user].blFields.hasOwnProperty(pro)) {
                tempFSA[user].blFields[pro].push(data[i].blFields[property]);
              } else {
                tempFSA[user].blFields[pro] = [data[i].blFields[property]];
              }
            } else {
              tempFSA[user]["blFields"] = {};
              tempFSA[user].blFields[pro] = [data[i].blFields[property]];
            }
          }
          if (
            tempFSA.hasOwnProperty(user) &&
            tempFSA[user].hasOwnProperty("year")
          ) {
            tempFSA[user].year.push(data[i].year);
          } else {
            tempFSA[user]["year"] = [data[i].year];
          }
        }
        console.log("this.FSA", this.FSA, tempFSA);
        this.FSA = tempFSA;
        this.setFSAUser(this.users[0].applicantShortName);

        // console.log("fsa", this.FSA)
        // console.log("fsa user", this.FSADetails)
      }

      setTimeout(() => {
        this.applicantsElmFSA.nativeElement
          .querySelectorAll(".btn:first-child")
          .forEach((applicant) => {
            applicant.click();
          });
      }, 0);
    });
  }

  getITRDetails() {
    this.dashboardService.getITRDetails({ lan: this.lan }).subscribe((res) => {
      console.log("ITR",res)

      let data = res.data
      let tempITR = {};
      if (data) {
        for (let i = 0; i < data.length; i++) {
          let user = data[i].executionDetails.user_name;
          console.log("data[i]", data[i]);

          if (Object.keys(data[i].ITRVInformation).length!==0) {
            for (const property in data[i].ITRVInformation) {
              if (tempITR.hasOwnProperty(user)) {
                if (tempITR[user].ITRVInformation.hasOwnProperty(property)) {
                  tempITR[user].ITRVInformation[property].push(
                    data[i].ITRVInformation[property]
                  );
                } else {
                  tempITR[user].ITRVInformation[property] = [
                    data[i].ITRVInformation[property],
                  ];
                }
              } else {
                tempITR[user] = {};
                tempITR[user]["ITRVInformation"] = {};
                tempITR[user].ITRVInformation[property] = [
                  data[i].ITRVInformation[property],
                ];
              }
            }
          } else {
            tempITR[user] = {};
            tempITR[user]["ITRVInformation"] = {};
          }

          if (Object.keys(data[i].IncomeDetails).length!==0) {
            for (const property in data[i].IncomeDetails) {
              if (
                tempITR.hasOwnProperty(user) &&
                tempITR[user].hasOwnProperty("IncomeDetails")
              ) {
                if (tempITR[user].IncomeDetails.hasOwnProperty(property)) {
                  tempITR[user].IncomeDetails[property].push(
                    data[i].IncomeDetails[property]
                  );
                } else {
                  tempITR[user].IncomeDetails[property] = [
                    data[i].IncomeDetails[property],
                  ];
                }
              } else {
                tempITR[user]["IncomeDetails"] = {};
                tempITR[user].IncomeDetails[property] = [
                  data[i].IncomeDetails[property],
                ];
              }
            }
          } else {
            tempITR[user]["IncomeDetails"] = {};
          }

          if (Object.keys(data[i].itrTaxCalculation).length!==0) {
            for (const property in data[i].itrTaxCalculation) {
              console.log(property)
              if (
                tempITR.hasOwnProperty(user) &&
                tempITR[user].hasOwnProperty("TaxCalculation")
              ) {
                if (tempITR[user].TaxCalculation.hasOwnProperty(property)) {
                  tempITR[user].TaxCalculation[property].push(
                    data[i].itrTaxCalculation[property]
                  );
                } else {
                  tempITR[user].TaxCalculation[property] = [
                    data[i].itrTaxCalculation[property],
                  ];
                }
              } else {
                tempITR[user]["TaxCalculation"] = {};
                tempITR[user].TaxCalculation[property] = [
                  data[i].itrTaxCalculation[property],
                ];
              }
            }
          } else {
            tempITR[user]["TaxCalculation"] = {};
          }

          if (data[i].itrvGSTInfo) {
            if (Object.keys(data[i].itrvGSTInfo).length!==0){
              if (
                tempITR.hasOwnProperty(user) &&
                tempITR[user].hasOwnProperty("itrvGSTInfo")
              ) {
                let GSTInfo =  {
                  ...data[i].itrvGSTInfo,
                  year: data[i].year,
                }
                tempITR[user].itrvGSTInfo.push(GSTInfo);
              } else {
                let GSTInfo =  {
                  ...data[i].itrvGSTInfo,
                  year: data[i].year,
                }
                tempITR[user]["itrvGSTInfo"] = [GSTInfo];
              }
            } else {
              tempITR[user]["itrvGSTInfo"] = []
            }
          }

          if (data[i].itrvBankInfo){
            if (data[i].itrvBankInfo.length!==0){
              if (
                tempITR.hasOwnProperty(user) &&
                tempITR[user].hasOwnProperty("itrvBankInfo")
              ) {
                let bankInfo = data[i].itrvBankInfo
                bankInfo.map((bank) => {
                  let BankInfo = {
                    ...bank,
                    year: data[i].year,
                  }
                  tempITR[user].itrvBankInfo.push(BankInfo);
                })
              } else {
                tempITR[user]["itrvBankInfo"] = []
                let bankInfo = data[i].itrvBankInfo
                bankInfo.map((bank) => {
                  let BankInfo = {
                    ...bank,
                    year: data[i].year,
                  }
                  tempITR[user].itrvBankInfo.push(BankInfo);
                })
              }
            } else {
              tempITR[user]["itrvBankInfo"] = []
            }
          }

          if (data[i].itrvKeyPersonInfo){
            if (data[i].itrvKeyPersonInfo.length!==0){
              if (
                tempITR.hasOwnProperty(user) &&
                tempITR[user].hasOwnProperty("itrvKeyPersonInfo")
              ) {
                let keyPersonInfo = data[i].itrvKeyPersonInfo
                keyPersonInfo.map((bank) => {
                  let KeyPersonInfo = {
                    ...bank,
                    year: data[i].year,
                  }
                  tempITR[user].itrvKeyPersonInfo.push(KeyPersonInfo);
                })
              } else {
                tempITR[user]["itrvKeyPersonInfo"] = []
                let keyPersonInfo = data[i].itrvKeyPersonInfo
                keyPersonInfo.map((bank) => {
                  let KeyPersonInfo = {
                    ...bank,
                    year: data[i].year,
                  }
                  tempITR[user].itrvKeyPersonInfo.push(KeyPersonInfo);
                })
              }
            } else {
              tempITR[user]["itrvKeyPersonInfo"] = []
            }
          }

          if (
            tempITR.hasOwnProperty(user) &&
            tempITR[user].hasOwnProperty("year")
          ) {
            tempITR[user].year.push(data[i].year);
          } else {
            tempITR[user]["year"] = [data[i].year];
          }
        }

        // console.log("this.ITR", this.ITR, tempITR);
        this.ITR = tempITR;
        this.setITRUser(this.users[0]);
      }

      setTimeout(() => {
        this.applicantsElmITR.nativeElement
          .querySelectorAll(".btn:first-child")
          .forEach((applicant) => {
            applicant.click();
          });
      }, 0);
    })
  }

  setFSAUser(user) {
    console.log(this.FSA[user]);
    if (this.FSA[user]) {
      this.FSADetails = this.FSA[user];
    } else {
      this.FSADetails = {
        profitAndLoss: {},
        BalanceSheet: {
          Liabilities: {},
          Assets: {},
        },
        blFields: {},
        RatioAnalysis: {},
        year: [],
      };
    }
  }

  getFSAAnalyticDetails(){
    this.loader = true
    let userDetails = this.getApplicantDetailsForEquility();
    let body = {
      revenue: this.FSADetails.profitAndLoss.totalSale[0]/100000000,
      grossProfitMargin: this.FSADetails.blFields.Gross_Profit_Annualized_Turnover_Annualized[0] === "Infinity" || this.FSADetails.blFields.Gross_Profit_Annualized_Turnover_Annualized[0] === "NaN" ? "0" : this.FSADetails.blFields.Gross_Profit_Annualized_Turnover_Annualized[0],
      eBITDAMargin: (this.FSADetails.profitAndLoss.operatingProfit[0]/this.FSADetails.profitAndLoss.totalSale[0])*100,
      currentRatio: this.FSADetails.blFields.Current_Ratio[0] === "Infinity" || this.FSADetails.blFields.Current_Ratio[0] === "NaN" ? "0" : this.FSADetails.blFields.Current_Ratio[0],
      quickRatio: this.FSADetails.blFields.Quick_AcidTest_Liquid_Ratio[0] === "Infinity" || this.FSADetails.blFields.Quick_AcidTest_Liquid_Ratio[0] === "NaN" ? "0" : this.FSADetails.blFields.Quick_AcidTest_Liquid_Ratio[0],
      debtEquityRatio: this.FSADetails.blFields.Debt_Equity_Ratio[0] === "Infinity" || this.FSADetails.blFields.Debt_Equity_Ratio[0] === "NaN" ? "0" : this.FSADetails.blFields.Debt_Equity_Ratio[0],
      interestCoverageRatio: this.FSADetails.blFields.Interest_Coverage_Ratio[0] === "Infinity" || this.FSADetails.blFields.Interest_Coverage_Ratio[0] === "NaN" ? "0" : this.FSADetails.blFields.Interest_Coverage_Ratio[0],
      debtServiceCoverageRatio: this.FSADetails.blFields.Debt_Service_Coverage_Ratio[0] === "Infinity" || this.FSADetails.blFields.Debt_Service_Coverage_Ratio[0] === "NaN" ? "0" : this.FSADetails.blFields.Debt_Service_Coverage_Ratio[0],
      debtorsDays: this.FSADetails.blFields.Debtors_Days_Debtors_Collection[0] === "Infinity" || this.FSADetails.blFields.Debtors_Days_Debtors_Collection[0] === "NaN" ? "0" : this.FSADetails.blFields.Debtors_Days_Debtors_Collection[0],
      creditorsDays: this.FSADetails.blFields.CreditorsDay_CreditorPayment[0] === "Infinity" || this.FSADetails.blFields.CreditorsDay_CreditorPayment[0] === "NaN" ? "0" : this.FSADetails.blFields.CreditorsDay_CreditorPayment[0],
      lan: this.lan,
      ...userDetails
    }
    console.log("fsa analysis",body)
    this.dashboardService.getFSAAnalyticsDetails(body).subscribe({
      next: (res) => {
        console.log(res)

        if (res.status) {
          if (res.data) {
            this.fsaFinancialResult = res.data
          } else {
            this.fsaFinancialResult = {}
          }
        } else {
          this.fsaFinancialResult = {}
        }
        this.loader = false
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  setITRUser(user) {
    console.log(this.ITR[user]);
    if (this.ITR[user]) {
      this.ITRDetails = this.ITR[user];
    } else {
      this.ITRDetails = {
        ITRVInformation: {},
        IncomeDetails: {},
        TaxCalculation: {},
        itrvGSTInfo: [],
        itrvBankInfo: [],
        itrvKeyPersonInfo: [],
        year: [],
      };
    }
  }

  setCoApplicationDetails(){
    for(let i=0; i < this.applicants.length ;i++){
      if( this.applicants[i].applicant_type == "co-app"){
        let user:coApplicantUser={
          name: "",
          entityId: 0
        };
        user.name= this.applicants[i].custshrtname;
        user.entityId =this.applicants[i].custcif;
        this.coApplicantUserList.push(user);
      }
    }
    console.log('this.coApplicantUserList: '+this.coApplicantUserList);
  }



  getColorForConsumerBureauAnalytics(color){
    switch (color) {
      case 'Red':
        return '#df4747';
      case 'Green':
        return '#83C775';
      case 'Yellow':
        return '#FFDE17';
        default:
          return 'parent';
    }
  }
  getCoApplicantWiseConsumerBureauAnalyticsDetails(event,customer){
    this.loader = true
   
    if(this.ConsumerBureauAnalyticsResult.length >0){
      for(let i=0; i< this.ConsumerBureauAnalyticsResult.length ;i++){
        if(customer.entityId == this.ConsumerBureauAnalyticsResult[i].entityId){
          this.ConsumerBureauAnalytics= this.ConsumerBureauAnalyticsResult[i].consumerBureauAnalytics;
        }
      }
      console.log('this.ConsumerBureauAnalytics'+ this.ConsumerBureauAnalytics)
      console.log('this.ConsumerBureauAnalyticsResult'+ this.ConsumerBureauAnalyticsResult)
      this.ConsumerBureauAnalyticsView=true;
      this.loader = false
    }else{
      this.ConsumerBureauAnalytics=ConsumerBureauAnalyticsVariable;
      this.loader = false;
    }
    this.applicantsConsumerBureauAnalytics.nativeElement
    .querySelectorAll(".btn.btn-primary")
    .forEach((applicant) => {
      applicant.classList.remove("btn-primary");
      applicant.classList.add("btn-light");
    });
  event.currentTarget.classList.add("btn-primary");
  }

  getConsumerBureauAnalyticsDetails(){
    this.loader = true

    if(this.ConsumerBureauAnalyticsResult.length >0){
      this.ConsumerBureauAnalytics= this.ConsumerBureauAnalyticsResult[0].consumerBureauAnalytics;
      setTimeout(() => {
        this.applicantsConsumerBureauAnalytics.nativeElement
          .querySelectorAll(".btn:first-child")
          .forEach((applicant) => {
            applicant.click();
          });
      }, 0);

      this.ConsumerBureauAnalyticsView=true;
      console.log('this.ConsumerBureauAnalytics'+ this.ConsumerBureauAnalytics)
      console.log('this.ConsumerBureauAnalyticsResult'+ this.ConsumerBureauAnalyticsResult)
      this.loader = false;
    }else{
      let userDetails = this.getApplicantDetailsForEquility();
      let body = {
        lan: this.lan,
        ...userDetails
      }
      console.log("Consumer Bureau analysis",body)
      this.dashboardService.getConsumerBureauAnalyticsDetails(body).subscribe({
        next: (res) => {
          console.log(res)
  
          if (res.status) {
            if (res.data) {
              this.ConsumerBureauAnalyticsResult = res.data.output
              if(this.ConsumerBureauAnalyticsResult.length >0){
                    this.ConsumerBureauAnalytics= this.ConsumerBureauAnalyticsResult[0].consumerBureauAnalytics;
              }
              this.ConsumerBureauAnalyticsView=true;
              console.log('this.ConsumerBureauAnalytics'+ this.ConsumerBureauAnalytics)
              console.log('this.ConsumerBureauAnalyticsResult'+ this.ConsumerBureauAnalyticsResult)
            } else {
              this.ConsumerBureauAnalyticsResult = [] ;  
              this.ConsumerBureauAnalyticsView=true;
              this.ConsumerBureauAnalytics=ConsumerBureauAnalyticsVariable;
            }
          } else {
            this.ConsumerBureauAnalyticsResult = [];
            this.ConsumerBureauAnalyticsView=true;
            this.ConsumerBureauAnalytics=ConsumerBureauAnalyticsVariable;
          }
          setTimeout(() => {
            this.applicantsConsumerBureauAnalytics.nativeElement
              .querySelectorAll(".btn:first-child")
              .forEach((applicant) => {
                applicant.click();
              });
          }, 0);
          this.loader = false;
        },
        error: (err) => {
          console.log(err)
          this.ConsumerBureauAnalyticsResult = [];
          this.ConsumerBureauAnalyticsView=true;
          this.ConsumerBureauAnalytics=ConsumerBureauAnalyticsVariable;
          setTimeout(() => {
            this.applicantsConsumerBureauAnalytics.nativeElement
              .querySelectorAll(".btn:first-child")
              .forEach((applicant) => {
                applicant.click();
              });
          }, 0);
          this.loader = false;
        }
      })
    }
   

  }

  setIncomeUser(user) {
    if (this.applicantIncome[user] !== undefined) {
      this.applicantIncomeDetails = this.applicantIncome[user];
      this.applicantIncomeDetailsEditable = this.applicantIncomeEditable[user];
      //console.log("this.applicantIncomeDetailsEditable",this.applicantIncomeDetailsEditable);
      this.calculateBTOfor12months();
      this.calculateBTOfor6months();
    } else {
      this.applicantIncomeDetails = JSON.parse(
        JSON.stringify(this.applicantIncomeBlankResponse)
      );
      this.applicantIncomeDetailsEditable = JSON.parse(
        JSON.stringify(this.applicantIncomeBlankResponse)
      );
    }
  }

  switchUserData(event, user, module) {
    if (module == "fsa") {
      this.applicantsElmFSA.nativeElement
        .querySelectorAll(".btn.btn-primary")
        .forEach((applicant) => {
          applicant.classList.remove("btn-primary");
          applicant.classList.add("btn-light");
        });
      event.currentTarget.classList.add("btn-primary");
      this.setFSAUser(user);
    }
    if (module == "income_details") {
      this.applicantsElmIncome.nativeElement
        .querySelectorAll(".btn.btn-primary")
        .forEach((applicant) => {
          applicant.classList.remove("btn-primary");
          applicant.classList.add("btn-light");
        });
      event.currentTarget.classList.add("btn-primary");
      this.setIncomeUser(user);
      this.selectedIncomeUser = user;
    }
    if (module == "gst") {
      this.applicantsElmGST.nativeElement
        .querySelectorAll(".btn.btn-primary")
        .forEach((applicant) => {
          applicant.classList.remove("btn-primary");
          applicant.classList.add("btn-light");
        });
      if (this.GST[user]) {
        this.GSTDetails = this.GST[user];

        console.log("gst", this.GST, this.GSTDetails);
      } else {
        this.GSTDetails = {
          previousQuater: {
            otherQuarterFields: {},
            QuaterData: {
              previousQuarter1: {},
              currentQuarter1: {},
              previousQuarter2: {},
              currentQuarter2: {},
              previousQuarter3: {},
              currentQuarter3: {},
              previousQuarter4: {},
              currentQuarter4: {},
            },
          },
          currentQuater: {
            otherQuarterFields: {},
            QuaterData: {
              previousQuarter1: {},
              currentQuarter1: {},
              previousQuarter2: {},
              currentQuarter2: {},
              previousQuarter3: {},
              currentQuarter3: {},
              previousQuarter4: {},
              currentQuarter4: {},
            },
          },
        };
      }
      event.currentTarget.classList.add("btn-primary");
      //this.GSTDetails = this.GST[user];
      this.selectedGSTUser = user;
    }
    if (module == "bsa") {
      this.applicantsElmBSA.nativeElement
        .querySelectorAll(".btn.btn-primary")
        .forEach((applicant) => {
          applicant.classList.remove("btn-primary");
          applicant.classList.add("btn-light");
        });

      // this.BSADetails = {}

      if (this.BSA[user]) {
        this.BSADetails = this.BSA[user];
      } else {
        this.BSADetails = {
          accountDetails: [],
        };
        this.BSABankDetails = {
          emiData: [],
          emiAmount: 0,
        };
      }
      this.BSABankingAnalysis = [];
      this.BSABankingAnalysisTotalAvg = {};

      // console.log("bsa", this.BSADetails)

      event.currentTarget.classList.add("btn-primary");
      //this.BSADetails = this.BSA[user];
      this.selectedBSAUser = user;
    }
    if (module == "bsaBankHealth") {
      if (user === 4) {
        this.bsaBankingHealth.map((data: any) => {
          if (data.accountNum === 4) {
            this.bsaBankingHealthDetail = data
          }
        })
      } else {
        this.bsaBankingHealthDetail = this.bsaBankingHealth[user-1]
      }
      console.log("bsa acc",this.bsaBankingHealthDetail)
      this.applicantsElmBSABankHealthacc.nativeElement
        .querySelectorAll(".btn.btn-primary")
        .forEach((applicant) => {
          applicant.classList.remove("btn-primary");
          applicant.classList.add("btn-light");
        });

      event.currentTarget.classList.add("btn-primary");

    }
    if (module == "otherIntegration") {
      this.applicantsElmOtherIntegration.nativeElement
        .querySelectorAll(".btn.btn-primary")
        .forEach((applicant) => {
          applicant.classList.remove("btn-primary");
          applicant.classList.add("btn-light");
        });
      event.currentTarget.classList.add("btn-primary");
      this.otherIntegrationUser = this.otherIntegrationResult[user];
      // console.log("switch",this.otherIntegrationUser)
    }
    if (module == "MonthlyObligation") {
      this.monthlyObligationSummery = false;
      this.applicantsElmMonthlyObligation.nativeElement
        .querySelectorAll(".btn.btn-primary")
        .forEach((applicant) => {
          applicant.classList.remove("btn-primary");
          applicant.classList.add("btn-light");
        });
      event.currentTarget.classList.add("btn-primary");
      // console.log(user, this.monthlyObligations[user]);
      this.monthlyObligationDetails = this.monthlyObligations[user]
        ? this.monthlyObligations[user]
        : {
          totalunsecuredObligation: 0,
          totalsecuredObligation: 0,
          totalMonthlyObligationSurrogateMethod: 0,
          totalMonthlyObligation: 0,
          totalAnnualObligation: 0,
          monthlyObligation: [],
        };
      // this.updateMonthlyObligation()
      // this.updateMonthlyObligationSurrogateMethod()
      // this.updateConsiderForObligationMethod()
      // this.updateTotalMonthlyObligationAllUser();
      // this.monthlyObligationDetails.totalsecuredObligation = 0;
      // this.monthlyObligationDetails.totalunsecuredObligation = 0;
      // this.monthlyObligationDetails.totalMonthlyObligationSurrogateMethod = 0;

      console.log(this.monthlyObligationDetails);
    }

    if (module === "itr") {
      console.log("itr", user)

      this.applicantsElmITR.nativeElement
        .querySelectorAll(".btn.btn-primary")
        .forEach((applicant) => {
          applicant.classList.remove("btn-primary");
          applicant.classList.add("btn-light");
        });
      event.currentTarget.classList.add("btn-primary");
      this.setITRUser(user);
    }

    if (module === "crimeCheck") {
      this.applicantsElmCrimeCheck.nativeElement
        .querySelectorAll(".btn.btn-primary")
        .forEach((applicant) => {
          applicant.classList.remove("btn-primary");
          applicant.classList.add("btn-light");
        });
      event.currentTarget.classList.add("btn-primary");

      this.crimeCheckDetail = this.crimeCheckDetails[user] ? this.crimeCheckDetails[user] : {
        name: "",
        type: "",
        riskType: "",
        caseRefNo: "",
        riskSummary: "",
      }
      
    }
  }

  updateObligationSummery(event) {
    this.monthlyObligationSummery = true;
    this.applicantsElmMonthlyObligation.nativeElement
      .querySelectorAll(".btn.btn-primary")
      .forEach((applicant) => {
        applicant.classList.remove("btn-primary");
        applicant.classList.add("btn-light");
      });
    event.currentTarget.classList.add("btn-primary");
  }

  getApplicantDetails(event, appct) {
    this.currentAppct = appct;
    let body = {
      lan: this.lan,
      user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
      user_name: this.currentAppct.custshrtname,
      user_id: this.currentAppct.user_id,
    };
    this.viewService.getApplicantDetails(body).subscribe((res) => {
      let tempService = JSON.parse(JSON.stringify(this.services));
      if (res.data !== null) {
        this.applicantDetails = tempService.map((service) => {
          for (let i = 0; i < service.values.length; i++) {
            for (let j = 0; j < res.data.services.length; j++) {
              if (res.data.services[j].service == service.values[i].name)
                service.values[i].status = res.data.services[j].status;
            }
          }

          return service;
        });
      } else {
        this.applicantDetails = tempService;
      }
    });
    this.applicantsElm.nativeElement
      .querySelectorAll(".card.active")
      .forEach((applicant) => {
        applicant.classList.remove("active");
      });
    event.currentTarget.classList.add("active");
  }

  getSanctionedConditions(lan) {
    let body = {
      lan: this.lan,
    };
    this.dashboardService.getSanctionedConditions(body).subscribe((res) => {
      let temp: any = [];
      if (res.data && Object.keys(res.data).length !== 0) {
        let dataHFC = res.data.HFC;
        let dataNBFC = res.data.NBFC;

        if (dataHFC.applicant && dataHFC.applicant.length > 0) {
          console.log("HFC");
          temp = dataHFC.applicant;
        } else if (dataNBFC.applicant && dataNBFC.applicant.length > 0) {
          console.log("NBFC");
          temp = dataNBFC.applicant;
        } else {
          console.log("No Applicants");
        }
      }

      // let middleIndex = Math.ceil(temp.length / 2);

      // this.SanctionedConditions[0] = temp.splice(0, middleIndex);
      // this.SanctionedConditions[1] = temp.splice(-middleIndex);
      this.SanctionedConditions = temp
    });
  }

  getPdNotes() {
    let body = {
      lan: this.lan,
      username: this.user_name,
    };
    this.dashboardService.getPdNotes(body).subscribe((res) => {
      this.PDNotesArr = res.data;
    });
  }

  getRemarks() {
    let body = {
      lan: this.lan,
    };
    this.dashboardService.getRemarks(body).subscribe((res) => {
      // this.remarkData = res.data;
      if (res.data) {
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          data[i].values.sort((a, b) => {
            const timeA = a.intializedTime.toUpperCase();
            const timeB = b.intializedTime.toUpperCase();
            if (timeA < timeB) {
              return 1;
            }
            if (timeA > timeB) {
              return -1;
            }
            return 0;
          });
          data[data[i].key] = data[i].values;
        }
        this.remarkData = data;
      }
      // console.log("remark 2", this.remarkData)
    });
  }

  getRecommendations() {
    let body = {
      lan: this.lan,
    };
    this.dashboardService.getRecommendations(body).subscribe((res) => {
      this.RecommendationArr = res.data;
      this.RecommendationArr.sort((a, b) => {
        const timeA = a.intializedTime.toUpperCase();
        const timeB = b.intializedTime.toUpperCase();
        if (timeA < timeB) {
          return -1;
        }
        if (timeA > timeB) {
          return 1;
        }
        return 0;
      });
    });
  }

  saveRecommendation() {

    if (this.isEditRecommendation) {
      let recommendation = this.editRecommendationData
      if (Object.keys(recommendation).length !== 0) {
        let body = {
          lan: this.lan,
          recommendationId: recommendation.recommendationId,
          recommendation: this.newRecommendation,
          user_name: this.user_name,
        };
        // console.log("edit rec", body)

        this.dashboardService.updateRecommendation(body).subscribe((res) => {
          this.newRecommendation = "";
          this.editRecommendationData = {}
          this.isEditRecommendation = false
          this.getRecommendations()
        });
      }

    } else {
      let body = {
        lan: this.lan,
        recommendation: this.newRecommendation,
        user_name: this.user_name,
        service: "",
      };
      // console.log("save rec", body)
      this.dashboardService.saveRecommendation(body).subscribe((res) => {
        // this.RecommendationArr.push(res.data);
        this.newRecommendation = "";
        this.getRecommendations()
      });
    }
  }

  cancelRecommendation() {
    this.newRecommendation = ""

    if (this.isEditRecommendation) {
      this.isEditRecommendation = false
      this.editRecommendationData = {}
    }
  }

  editRecommendation(recommendation: any) {
    // console.log(recommendation)

    this.isEditRecommendation = true

    if (this.isEditRecommendation) {
      this.editRecommendationData = recommendation
      this.newRecommendation = recommendation.recommendation
    }
  }

  saveRemark(service) {

    if (this.isEditRemark[service]){
      let remark = this.editRemarkData[service]
      if (Object.keys(remark).length!==0) {
        let body = {
          lan: this.lan,
          remarkId: remark.remarkId,
          remark: this.newremark[service],
          user_name: this.user_name,
          service: service,
        };
        
        this.dashboardService.updateRemark(body).subscribe((res) => {
          this.newremark[service] = "";
          this.editRemarkData[service] = {}
          this.isEditRemark[service] = false
          this.getRemarks()
        });
      }
    } else {
      let remark = this.newremark[service];
      let body = {
        lan: this.lan,
        remark: remark,
        user_name: this.user_name,
        service: service,
      };
  
      this.dashboardService.saveRemark(body).subscribe((res) => {
        this.getRemarks()
        this.newremark[service] = "";
      });
    }  
  }

  editRemark(service: string, remark: any){

    this.isEditRemark[service] = true

    if (this.isEditRemark[service]) {
      this.editRemarkData[service] = remark
      this.newremark[service] = remark.remark
    }
  }

  deleteRemark(remark: any){
    this.dashboardService.deleteRemark(remark.remarkId).subscribe((res) => {
      this.getRemarks()
    });
  }

  cancelRemark(service) {
    this.newremark[service] = "";

    if (this.isEditRemark[service]) {
      this.editRemarkData[service] = {}
      this.isEditRemark[service] = false
    }
  }

  savePdnotes() {
    let body = {
      lan: this.lan,
      user_name: this.user_name,
      ...this.PDNotesArr[0],
    };
    this.dashboardService.savePdnotes(body).subscribe((res) => {
      if (res.status) {
        alert("Note Successfully Saved");
      }
    });
  }

  updateEligibility(event) {
    console.log("updateEligibility", event.target.value);

    // let value = event.target.value
    // if (value === "BL- Pre-computed" || value === "BL- Pre-Filtered" || this.eligibilityMethodDropdown === "X-SELL INSTA" || this.eligibilityMethodDropdown === "X-SELL Qualified" || this.eligibilityMethodDropdown === "D2C - Banking LTS Program") {
    //   this.isTriggerEligibility = false
    //   this.dashboardService.triggerDisableSaveDashboard(false);
    // } else {
    //   this.dashboardService.triggerDisableSaveDashboard(true);
    //   this.isTriggerEligibility = true
    // }
      this.setIncomDetailsForEligibility(this.applicantIncomeDetailsEditable);
  }

  setIncomDetailsForEligibility(data) {
    console.log(this.natureOfBusinessDropDown);
    console.log(this.eligibilityMethodDropdown);
    if (this.natureOfBusinessDropDown === "") {
      alert("Please select Nature Of Business!");
      return;
    }
    if (this.checkOwnershipOfAddress()) {
      alert("Please select Ownership of Address for all the applicants!");
      return;
    }
    if (this.STP_Status == "") {
      alert("Please select STP Status!");
      return;
    }
    if (this.isPD_TypeMandatory) {
      if (this.PD_Type === "") {
        alert("Please select PD Type!");
        return;
      }
    }
    if (this.checkKeyApplicants()) {
      alert("Please select Key Applicant for all the applicants!");
      return;
    }
    if (this.checkIncomeDetails(this.eligibilityMethodDropdown)) {
      alert("Please fill all the mandatory fields!");
      return;
    }

    // if(this.checkAllDetailsAreFilledInMonthlyObligation()){
    //   alert("Please fill all the mandatory fields of Monthly Obligations!");
    //   return;
    // }
    this.loader = true;
    let temp: any = {};
    let extrafields = {
      sumofBusinessCreditfor12months:
        this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails
          .SumofBusinessCreditfor12months),
      monthlyAverageBankBalancefor12months:
        this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails
          .MonthlyAverageBankBalancefor12months),
      totalMonthlyObligationforBankingSurrogateMethod:
        this.totalObligation.totalMonthlyObligationBankingSurrogate,
      totalMonthlyObligationforIncomeandGSTMethod:
        this.totalObligation.totalMonthlyObligation,
      totalAnnualObligation: this.totalObligation.totalAnnualObligation,
      greatestIndividualcontributionper:
        this.applicantIncomeDetailsEditable.currentYearData
          .greatestIndividualContributor ?? 0,
      eligibilityMethod: this.eligibilityMethodDropdown,
      finalLoanAmount: this.FICOInput[0].finassetvalue,
      requestLoanAmount: this.FICOInput[0].finamount,
    };
    let userDetails = this.getApplicantDetailsForEquility();
    let remainingFields = this.getRemainingFieldsForEquility();
    let currentYearData = {
      turnoverasperFinancialsCur: this.removeCurrencyStr(data.currentYearData.turnoverAsPerFinancials),
      grossProfitCur: this.removeCurrencyStr(data.currentYearData.grossProfit),
      pATCur: this.removeCurrencyStr(data.currentYearData.profitAfterTax),
      depreciationCur: this.removeCurrencyStr(data.currentYearData.depreciation),
      salaryPaidtoPartnerCur: this.removeCurrencyStr(data.currentYearData.salaryPaidToPartner),
      interestPaidtoPartnerCur: this.removeCurrencyStr(data.currentYearData.interestPaidToPartner),
      directorsRenumerationCur: this.removeCurrencyStr(data.currentYearData.directorsRenumeration),
      nonOperatingExpenseCur: this.removeCurrencyStr(data.currentYearData.nonOperatingExpense),
      otherIncomeCur: this.removeCurrencyStr(data.currentYearData.otherIncome),
      otherExpenseCur: this.removeCurrencyStr(data.currentYearData.otherExpense),
      totalincomeCur: this.removeCurrencyStr(data.currentYearData.totalincome),
      nonOperatingIncomeCur: this.removeCurrencyStr(data.currentYearData.nonOperatingIncome),
      turnoverasperGSTCur: this.removeCurrencyStr(data.currentYearData.turnoverAsPerGST),
      iTRFillingDateCur: data.currentYearData.ITRFilingDate,
      typeofFinancialsCur: data.currentYearData.TypeofFinancials,
    };
    let previousYearData = {
      turnoverasperFinancialsprev:
        this.removeCurrencyStr(data.previousYearData.turnoverAsPerFinancials),
      grossProfitprev: this.removeCurrencyStr(data.previousYearData.grossProfit),
      pATprev: this.removeCurrencyStr(data.previousYearData.profitAfterTax),
      depreciationprev: this.removeCurrencyStr(data.previousYearData.depreciation),
      salaryPaidtoPartnerprev: this.removeCurrencyStr(data.previousYearData.salaryPaidToPartner),
      interestPaidtoPartnerprev: this.removeCurrencyStr(data.previousYearData.interestPaidToPartner),
      directorsRenumerationprev: this.removeCurrencyStr(data.previousYearData.directorsRenumeration),
      nonOperatingExpenseprev: this.removeCurrencyStr(data.previousYearData.nonOperatingExpense),
      otherIncomeprev: this.removeCurrencyStr(data.previousYearData.otherIncome),
      otherExpenseprev: this.removeCurrencyStr(data.previousYearData.otherExpense),
      totalincomeprev: this.removeCurrencyStr(data.previousYearData.totalincome),
      nonOperatingIncomeprev: this.removeCurrencyStr(data.previousYearData.nonOperatingIncome),
      turnoverasperGSTprev: this.removeCurrencyStr(data.previousYearData.turnoverAsPerGST),
      iTRFillingDateprev: data.previousYearData.ITRFilingDate,
      typeofFinancialsprev: data.previousYearData.TypeofFinancials,
    };
    // console.log(currentYearData, previousYearData)
    temp = {
      currentYearData: currentYearData,
      previousYearData: previousYearData,
      ...extrafields,
      ...userDetails,
      ...remainingFields,
    };

    temp["remainingFields"]["roi"] = this.FICOInput[0].roi
    temp["remainingFields"]["baseRate"] = this.FICOInput[0].brrate
    temp["remainingFields"]["tenor"] = this.FICOInput[0].tenor
    temp["remainingFields"]["loanAmount"] = this.FICOInput[0].finassetvalue
    // console.log(JSON.stringify(temp));
    this.dashboardService.submitEligibility(temp).subscribe((res) => {
      this.dashboardService.triggerDisableSaveDashboard(false);
      this.dashboardService.triggerDisableSavePDF(false);
      if (res.status) {
        this.FICOInput[0]["EligibleLoanAount"] = res.data.EligibleLoanAount;
        // this.FICOInput[0]["finalEligibleLoanAmountBankingMethod"] =
        //   res.data.finalEligibleLoanAmountBankingMethod;
        // this.FICOInput[0]["finalEligibleLoanAmountGSTProgram"] =
        //   res.data.finalEligibleLoanAmountGSTProgram;
        // this.FICOInput[0]["finalEligibleLoanAmountIncomeMethod"] =
        //   res.data.finalEligibleLoanAmountIncomeMethod;
        this.FICOInput[0]["finalEmiAmount"] = res.data.finalEmiAmount;
        this.FICOInput[0]["FOIR"] = res.data.FOIR;
        this.FICOInput[0]["roiAsPerPolicy"] = res.data.roi;

        // Object.keys(this.FinalEligibilityLoanAmount).map((obj) => {
        //   if (obj == this.FICOInput[0].tenor) {
        //     this.FinalEligibilityLoanAmount[obj][
        //       "finalEligibleLoanAmountIncomeMethod"
        //     ] = res.data.finalEligibleLoanAmountIncomeMethod;
        //     this.FinalEligibilityLoanAmount[obj][
        //       "finalEligibleLoanAmountBankingMethod"
        //     ] = res.data.finalEligibleLoanAmountBankingMethod;
        //     this.FinalEligibilityLoanAmount[obj][
        //       "finalEligibleLoanAmountGSTProgram"
        //     ] = res.data.finalEligibleLoanAmountGSTProgram;
        //   } else {
        //     this.FinalEligibilityLoanAmount[obj][
        //       "finalEligibleLoanAmountIncomeMethod"
        //     ] = "";
        //     this.FinalEligibilityLoanAmount[obj][
        //       "finalEligibleLoanAmountBankingMethod"
        //     ] = "";
        //     this.FinalEligibilityLoanAmount[obj][
        //       "finalEligibleLoanAmountGSTProgram"
        //     ] = "";
        //   }
        // });

        this.getQuaterlyFinalOffer(temp)
        this.getAutoDeviation(temp);
      } else {
        alert("Error : " + res.message);
      }
      this.loader = false;
    });
  }

  getQuaterlyFinalOffer(body) {
    this.dashboardService.getQuaterlyFinalOffer(body).subscribe((res) => {
      // console.log(res)
      this.FICOInput[0].finalEligibilityLoanAmount = res.data
    });
  }

  getAutoDeviation(body) {
    body.remainingFields["averageIw"] =
      this.BSABankingAnalysisTotalAvg.avgOfTotalInwCheqReturn;
    body.remainingFields["totalNoofchequeReturn"] =
      this.BSABankingAnalysisTotalAvg.sumOfTotalInwCheqReturn;
    body.remainingFields["averageOw"] =
      this.BSABankingAnalysisTotalAvg.avgOfTotalOwReturn;
    body.remainingFields["monthlyObligationUnsecureLoans"] =
      this.totalObligation.totalUnsecureExposure;
    body.remainingFields["shareHoldingperCoApp"] = this.getTotalSharePercent();
    body.remainingFields["averageLimitUtilisation"] =
      this.BSABankingAnalysisTotalAvg.avgAvgLimitUtilization;
    body.remainingFields["turnoverasperFinancialsRatio"] =
      ((this.removeCurrency(this.applicantIncomeDetailsEditable.currentYearData
        .turnoverAsPerFinancials) -
        this.removeCurrency(this.applicantIncomeDetailsEditable.previousYearData
          .turnoverAsPerFinancials)) /
        this.removeCurrency(this.applicantIncomeDetailsEditable.previousYearData
          .turnoverAsPerFinancials)) *
      100;
    body.remainingFields["patGrowthPer"] =
      ((this.removeCurrency(this.applicantIncomeDetailsEditable.currentYearData.profitAfterTax) -
        this.removeCurrency(this.applicantIncomeDetailsEditable.previousYearData.profitAfterTax)) /
        this.removeCurrency(this.applicantIncomeDetailsEditable.previousYearData.profitAfterTax)) *
      100;
    body.remainingFields["turnoverGSTRatio"] =
      ((this.removeCurrency(this.applicantIncomeDetailsEditable.currentYearData.turnoverAsPerGST) -
        this.removeCurrency(this.applicantIncomeDetailsEditable.previousYearData.turnoverAsPerGST)) /
        this.removeCurrency(this.applicantIncomeDetailsEditable.previousYearData.turnoverAsPerGST)) *
      100;
    body.remainingFields["loanAmountOffered"] =
      this.FICOInput[0]["finalEmiAmount"];
    body.remainingFields["maximumDelaydays"] = this.getMaximumDelayDays();

    body.remainingFields["minimumTotalNoofBusinessCredits"] =
      this.applicantIncomeDetailsEditable.BSADetails[
      "MinimumcreditCountP.M.normfor12Months"
      ];
    body.remainingFields["minimumTotalAmountofBusinessCredits"] =
      this.removeCurrency(this.applicantIncomeDetailsEditable.BSADetails[
        "MinimumCreditAmountP.M.Normfor12months"
      ]);

    body.stpStatus = this.STP_Status;
    this.dashboardService.getAutoDeviation(body).subscribe((res) => {
      //if(res.status){
      this.autoDeviation = res.data;
      this.triggerScorecard();
      //}
    });
  }

  getMaximumDelayDays() {
    // console.log("max delay", this.GST)

    let max = 0;
    let delayDays: any = [];

    let data;
    for (let i = 0; i < this.applicants.length; i++) {
      if (this.applicants[i].applicant_type === "mainapp") {
        // console.log("gst", this.GST[this.applicants[i].custshrtname])
        data = this.GST[this.applicants[i].custshrtname];
        break;
      }
    }

    if (data) {
      if (Object.keys(data.currentQuater).length !== 0) {
        if (data.currentQuater.last6Months.length !== 0) {
          data.currentQuater.last6Months.map((obj: any) => {
            delayDays.push(this.toNumber.transform(obj.GSTR3bdelayDays));
          });
          max = Math.max(...delayDays);
        }
      }
    }
    return max;
  }

  getTotalSharePercent() {
    let totalShare = 0;
    for (let i = 0; i < this.applicants.length; i++) {
      if (this.applicants[i].applicant_type == "co-app") {
        totalShare = totalShare + this.toNumber.transform(this.applicants[i].shareholding);
      }
    }
    return totalShare;
  }

  getGSTShare() {
    let share = 0;
    if (this.GSTDetails) {
      if (this.GSTDetails.currentQuater) {
        if (
          this.GSTDetails.currentQuater.top10Customer &&
          this.GSTDetails.currentQuater.top10Customer.length
        ) {
          share = this.GSTDetails.currentQuater.top10Customer[0].share;
        }
      }
    }
    return share;
  }

  getApplicantDetailsForEquility() {
    let temp: any = {
      mainAppFields: {},
      coAppFields: [],
    };
    for (let i = 0; i < this.applicants.length; i++) {
      if (this.applicants[i].applicant_type == "mainapp") {
        //console.log("totalAbbcount", this.BSA[this.applicants[i].custshrtname].accountDetails[0].totalavg.totalAbbcount);
        temp.mainAppFields = {
          mainCif: this.applicants[i].custcif,
          mainDob: this.applicants[i].custdob.split(" ")[0],
          mainAddressOwnerShipType: this.getApplicantAddressOwnerShipType(
            this.applicants[i].custcif
          ),
          mainIwowRatio:
            this.applicantIncomeDetailsEditable.BSADetails.IwOwRatio ?? 0,
        };
      } else {
        let tempCOApp = {
          coCif: this.applicants[i].custcif,
          coDob: this.applicants[i].custdob.split(" ")[0],
          coAddressOwnershipType: this.getApplicantAddressOwnerShipType(
            this.applicants[i].custcif
          ),
          coKeyPerson: this.applicants[i].retailkeyperson,
        };
        temp.coAppFields.push(tempCOApp);
      }
    }
    return temp;
  }

  checkOwnershipOfAddress() {
    let result = false;
    if (this.applicants.length) {
      this.applicants.map((obj) => {
        if (obj.addressOwnerShip == "" || obj.addressOwnerShip == "#") {
          result = true;
        }
      });
    }
    return result;
  }

  checkKeyApplicants() {
    let result = false;
    if (this.applicants.length) {
      for (let i = 0; i < this.applicants.length; i++) {
        if (this.applicants[i].applicant_type == "co-app") {
          if (
            this.applicants[i].retailkeyperson == "" ||
            this.applicants[i].retailkeyperson == "#" ||
            this.applicants[i].retailkeyperson == "NO"
          ) {
            result = true;
          } else {
            result = false;
            break;
          }
        }

        if (this.applicants[i].applicant_type == "mainapp") {
         if (this.applicants[i].custctgcode == "RETAIL"){
           if (
             this.applicants[i].corpkeyperson == "" ||
             this.applicants[i].corpkeyperson == "#" ||
             this.applicants[i].corpkeyperson == "NO"
           ) {
             result = true;
           } else {
             result = false;
             break;
           }
         }
        }
      }
    }
    return result;
  }

  checkIncomeDetails(eligibilityMethod: string) {
    // console.log("check id")
    let result = false;
    if (this.applicants.length) {
      this.applicants.map((obj) => {
        if (obj.applicant_type == "mainapp") {
          let temp = this.applicantIncomeEditable[obj.custshrtname];

          if (eligibilityMethod === "BANKINGSURROGATE") {
            if (
              temp.currentYearData.TypeofFinancials == "" ||
              temp.previousYearData.TypeofFinancials == "" ||
              temp.currentYearData.ITRFilingDate == "" ||
              temp.previousYearData.ITRFilingDate == "" ||
              temp.currentYearData.turnoverAsPerFinancials == "" ||
              temp.previousYearData.turnoverAsPerFinancials == "" ||
              temp.currentYearData.turnoverAsPerGST == "" ||
              temp.previousYearData.turnoverAsPerGST == "" ||
              temp.currentYearData.grossProfit == "" ||
              temp.previousYearData.grossProfit == "" ||
              temp.currentYearData.profitAfterTax == "" ||
              temp.previousYearData.profitAfterTax == "" ||
              temp.currentYearData.depreciation == "" ||
              temp.previousYearData.depreciation == "" ||
              temp.BSADetails.SumofBusinessCreditfor12months == "" ||
              temp.BSADetails.MonthlyAverageBankBalancefor12months == "" ||
              temp.BSADetails.MinimumABBfor12months == "" ||
              temp.BSADetails['MinimumcreditCountP.M.normfor12Months'] == "" ||
              temp.BSADetails['MinimumCreditAmountP.M.Normfor12months'] == "" ||
              temp.BSADetails.BTO == "" ||
              temp.BSADetails.IwOwRatio == ""
            ) {
              result = true;
            }
          } else {
            if (
              temp.currentYearData.TypeofFinancials == "" ||
              temp.previousYearData.TypeofFinancials == "" ||
              temp.currentYearData.ITRFilingDate == "" ||
              temp.previousYearData.ITRFilingDate == "" ||
              temp.currentYearData.turnoverAsPerFinancials == "" ||
              temp.previousYearData.turnoverAsPerFinancials == "" ||
              temp.currentYearData.turnoverAsPerGST == "" ||
              temp.previousYearData.turnoverAsPerGST == "" ||
              temp.currentYearData.grossProfit == "" ||
              temp.previousYearData.grossProfit == "" ||
              temp.currentYearData.profitAfterTax == "" ||
              temp.previousYearData.profitAfterTax == "" ||
              temp.currentYearData.depreciation == "" ||
              temp.previousYearData.depreciation == "" ||
              temp.BSADetails.SumofBusinessCreditfor6months == "" ||
              temp.BSADetails.MonthlyAverageBankBalancefor6months == "" ||
              temp.BSADetails.MinimumABBfor6months == "" ||
              temp.BSADetails['MinimumcreditCountP.M.normfor6Months'] == "" ||
              temp.BSADetails['MinimumCreditAmountP.M.Normfor6months'] == "" ||
              temp.BSADetails.BTOfor6months == "" ||
              temp.BSADetails.IwOwRatio == ""
            ) {
              result = true;
            }
          }
        }
      });
    }
    return result;
  }

  getApplicantAddressOwnerShipType(custcif) {
    let result = "";
    for (let i = 0; i < this.applicants.length; i++) {
      if (this.applicants[i].custcif == custcif) {
        result = this.applicants[i].addressOwnerShip;
      }
    }
    console.log("getMainApplicantAddressOwnerShipType", result);
    return result;
  }

  getRemainingFieldsForEquility() {
    return {
      remainingFields: {
        lan: this.lan,
        noOfEmi: "36",
        mainNatureOfBussiness: this.natureOfBusinessDropDown,

        minimumTotalNoofBusinessCreditsfor12m: this.applicantIncomeDetailsEditable.BSADetails["MinimumcreditCountP.M.normfor12Months"],
        minimumTotalAmountofBusinessCreditsfor12m: this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails["MinimumCreditAmountP.M.Normfor12months"]),
        minimumTotalNoofBusinessCreditsfor6m: this.applicantIncomeDetailsEditable.BSADetails["MinimumcreditCountP.M.normfor6Months"],
        minimumTotalAmountofBusinessCreditsfor6m:this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails["MinimumCreditAmountP.M.Normfor6months"]),
        sumofBusinessCreditfor6months:this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails
          .SumofBusinessCreditfor6months),
        monthlyAverageBankBalancefor6months:this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails
          .MonthlyAverageBankBalancefor6months),
        minimumAbbfor6m:this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails
          .MinimumABBfor6months)
        // roi: this.FICOInput[0].roi || "",
        // baseRate: this.FICOInput[0].brrate || "",
        // tenor: this.FICOInput[0].tenor || "",
        // loanAmount: this.FICOInput[0].finassetvalue || "",
      },
    };
  }

  getGstDetails() {
    this.dashboardService.getGstDetails({ lan: this.lan }).subscribe((res) => {
      let data = res.data;
      let tempGST = {};

      if (data) {
        for (let i = 0; i < data.length; i++) {
          let user = data[i].executionDetails.user_name;

          let month: string;
          let year: string;
          let newDate: any;

          if (data[i].currentQuater.financialYear) {
            let currentQYear1 = data[i].currentQuater.financialYear.split("-")[0]
            let currentQYear2 = data[i].currentQuater.financialYear.split("-")[1]

            if (currentQYear1.length > 4 && currentQYear2.length > 4) {

              month = currentQYear1.substr(0, 2)
              year = currentQYear1.substr(2)

              newDate = new Date(Number(year), Number(month), 0, 0, 0, 0, 0);
              currentQYear1 = newDate.toLocaleString("en-us", { month: "short" }).toUpperCase() + " " + newDate.getUTCFullYear()

              month = currentQYear2.substr(0, 2)
              year = currentQYear2.substr(2)

              newDate = new Date(Number(year), Number(month), 0, 0, 0, 0, 0);
              currentQYear2 = newDate.toLocaleString("en-us", { month: "short" }).toUpperCase() + " " + newDate.getUTCFullYear()
              data[i].currentQuater.financialYear = currentQYear1 + "-" + currentQYear2

            }
          }

          if (data[i].previousQuater.financialYear) {
            let previousQYear1 = data[i].previousQuater.financialYear.split("-")[0]
            let previousQYear2 = data[i].previousQuater.financialYear.split("-")[1]

            if (previousQYear1.length > 4 && previousQYear2.length > 4) {
              month = previousQYear1.substr(0, 2)
              year = previousQYear1.substr(2)

              newDate = new Date(Number(year), Number(month), 0, 0, 0, 0, 0);
              previousQYear1 = newDate.toLocaleString("en-us", { month: "short" }).toUpperCase() + " " + newDate.getUTCFullYear()

              month = previousQYear2.substr(0, 2)
              year = previousQYear2.substr(2)

              newDate = new Date(Number(year), Number(month), 0, 0, 0, 0, 0);
              previousQYear2 = newDate.toLocaleString("en-us", { month: "short" }).toUpperCase() + " " + newDate.getUTCFullYear()
              data[i].previousQuater.financialYear = previousQYear1 + "-" + previousQYear2
            }
          }

          tempGST[user] = data[i];
        }
        this.GST = tempGST;
        this.updateGreatestIndividualContributor();
      }

      setTimeout(() => {
        this.applicantsElmGST.nativeElement
          .querySelectorAll(".btn:first-child")
          .forEach((applicant) => {
            applicant.click();
          });
      }, 0);
    });
  }

  updateGreatestIndividualContributor() {
    Object.keys(this.GST).map((key) => {
      let final = 0;
      this.GST[key].currentQuater.top10Customer.map((data) => {
        if (data.share > final) {
          final = data.share;
        }
      });
      if (this.applicantIncome[key]) {
        this.applicantIncome[
          key
        ].currentYearData.greatestIndividualContributor = final;
      }
      if (this.applicantIncomeEditable[key]) {
        this.applicantIncomeEditable[
          key
        ].currentYearData.greatestIndividualContributor = final.toFixed(2);
      }
      //console.log(this.GST[key].currentQuater.top10Customer);
    });
  }

  getBSADetails() {
    this.dashboardService.getBSADetails({ lan: this.lan }).subscribe((res) => {
      let data = res.data;
      let tempBSA = {};

      if (data) {
        for (let i = 0; i < data.length; i++) {
          let user = data[i].executionDetails.user_name;
          // if(this.users.indexOf(user) == -1){
          //   this.users.push(user);
          // }
          tempBSA[user] = data[i];
        }
        this.BSA = tempBSA;
        this.BSADetails = this.BSA[this.users[0].applicantShortName];
        // console.log("bsa all", this.BSA)
        // console.log("bsa user", this.BSADetails)
      }

      setTimeout(() => {
        this.applicantsElmBSA.nativeElement
          .querySelectorAll(".btn:first-child")
          .forEach((applicant) => {
            applicant.click();
          });
      }, 0);
      setTimeout(() => {
        this.applicantsElmBSAacc.nativeElement
          .querySelectorAll(".card:first-child")
          .forEach((applicant) => {
            applicant.click();
          });
      }, 1000);
    });
  }

  getBSABankingHealth() {
    this.loader = true
    let body = {
      lan: this.lan,
      mainAppFields: this.getApplicantDetailsForEquility().mainAppFields,
    }

    this.dashboardService.bsaBankingHealth(body).subscribe({
      next: (res) => {
        console.log(res)

        if (res.status) {
          if (res.data) {
            this.bsaBankingHealth = res.data.BankingAnalytics

            this.bsaBankingHealth.map((data: any) => {
              if (data.accountNum !== 4) {
                this.bsaBankingHealthResult.push(data)
              }
            })

            if (this.bsaBankingHealth.length===0) {
              this.bsaBankingHealthDetail = {
                concentrationRisk: {},
                ABB: {},
                PBB: {},
                accountNum: 0,
                transactionAnalytics:{}
              }
            }

            if (this.bsaBankingHealth.length!==0) {
              setTimeout(() => {
                this.applicantsElmBSABankHealth?.nativeElement
                  .querySelectorAll(".btn:first-child")
                  .forEach((applicant) => {
                    applicant.click();
                  });
              }, 0);
  
                setTimeout(() => {
                  this.applicantsElmBSABankHealthacc?.nativeElement
                    .querySelectorAll(".btn:first-child")
                    .forEach((applicant) => {
                      applicant.click();
                    });
                }, 0);

            }


          } else {
            this.bsaBankingHealth = []
          }
        } else {
          this.bsaBankingHealth = []
        }
        this.loader = false
      }, 
      error: () => {}
    })
  }

  updateBSABankDetails(event, index) {
    // this.applicantsElmBSA.nativeElement.querySelectorAll('.card.active').forEach(
    //   applicant => {
    //     console.log("applcant", applicant)
    //     applicant.classList.remove('active');
    //     // applicant.classList.add('in-active');
    //   }
    // )
    this.applicantsElmBSAacc.nativeElement
      .querySelectorAll(".card.active")
      .forEach((applicant) => {
        applicant.classList.remove("active");
      });
    event.currentTarget.classList.add("active");

    this.BSABankDetails["emiAmount"] =
      this.BSADetails.accountDetails[index].monthwiseBankDetails.emiAmount;
    this.BSABankDetails["emiData"] = [];
    this.BSABankDetails["emiMonths"] = this.BSADetails.accountDetails[index].monthwiseBankDetails.monthsArray;
    let emiData =
      this.BSADetails.accountDetails[index].monthwiseBankDetails.emiData;

    if (emiData.length !== 0) {
      if (emiData[0].length !== 0) {
        emiData.forEach((elm) => {
          if (Object.keys(elm).length !== 0) {
            let dates = elm.date.trim().split(" ");

            let tempEMI: any = {
              amount: elm.amount,
              months: [],
              monthsData: []
            }

            dates.map((d) => {
              let newdate = new Date(d);
              let month = newdate.toLocaleString("en-us", { month: "short" });
              let year = newdate.getUTCFullYear().toString().substring(2);

              tempEMI.months.push(month + "-" + year)
            })

            this.BSABankDetails["emiMonths"].map((emiMonth) => {
              if(tempEMI.months.includes(emiMonth)) {
                tempEMI.monthsData.push({
                  month: emiMonth,
                  value: "✔"
                })
              } else {
                tempEMI.monthsData.push({
                  month: emiMonth,
                  value: ""
                })
              }
            })

            this.BSABankDetails["emiData"].push(tempEMI);
          }
        });
      }
    }

    console.log("bank", this.BSABankDetails)

    this.BSABankingAnalysis =
      this.BSADetails.accountDetails[index].monthwiseBankDetails.monthsData;
    this.BSABankingAnalysisTotalAvg =
      this.BSADetails.accountDetails[index].monthwiseBankDetails.totalavg;
    console.log("================", this.BSADetails);
    if (this.BSADetails.executionDetails.user_type == "ma") {
      this.totalAbbcount =
        this.BSADetails.accountDetails[
          index
        ].monthwiseBankDetails.totalAbbcount;
    }
  }

  closePupup(status) {
    if (status == "save") {
      this.saveDashboard();
    }
    this.saveDashboardPopup = false;
  }

  generatePdf() {
    console.log("generate pdf");

    let body = {
      fsa: this.FSA,
      bsa: this.BSA,
      gst: this.GST,
      itr: this.ITR,
      income: this.applicantIncome,
      incomeUpdated: this.applicantIncomeEditable,
      FICOInput: this.FICOInput,
      applicants: this.applicants,
      monthlyObligations: this.totalObligation,
      remark: this.remarkData,
      recommendation: this.RecommendationArr,
      autoDeviation: this.autoDeviation,
      sanctionedConditions: this.SanctionedConditions,
      natureOfBusiness: this.natureOfBusinessDropDown,
      eligibilityMethod: this.eligibilityMethodDropdown,
      scoreCard: this.scoreCard,
      STP_Status: this.STP_Status,
      pdType: this.PD_Type,
    };

    // console.log("pdf", body)

    this.dashboardService.generatePdf(body).subscribe({
      next: (res) => {
        // console.log("generate pdf response", res)

        if (res.type === "application/json") {
          alert("Error Generating PDF");
          console.log("Error Generating PDF");
        } else {
          console.log("generate pdf file");
          var file = new Blob([res], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          var a = document.createElement("a");
          a.href = fileURL;
          a.download = "application-form.pdf";
          document.body.appendChild(a);
          a.click();

          this.getLogs();
        }
      },
      error: (err) => { },
    });
  }

  downloadPDNotes() {
    let body = {
      lan: this.lan,
      username: this.user_name,
    };

    this.dashboardService.downloadPDNotes(body).subscribe({
      next: (res) => {
        if (res.type === "application/json") {
          alert("No Files Available");
        } else {
          var file = new Blob([res], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          var a = document.createElement("a");
          a.href = fileURL;
          a.download = `PD Notes.pdf`;
          document.body.appendChild(a);
          a.click();
        }
      },
      error: (err) => { },
    });
  }

  onZipFileDownload(log: any) {
    let body = {
      lan: log.lan,
      service: log.service,
      transactionId: log.transactionId,
    };

    this.dashboardService.getZipFile(body).subscribe({
      next: (res) => {
        if (res.type === "application/json") {
          alert("No Files Available");
        } else {
          var file = new Blob([res], { type: "application/zip" });
          var fileURL = URL.createObjectURL(file);
          var a = document.createElement("a");
          a.href = fileURL;

          if (log.service === "senpGeneratePdf") {
            a.download = `GeneratePDF_${log.transactionId}.zip`;
          } else {
            a.download = `${log.service}_${log.lan}_${log.transactionId}.zip`;
          }
          document.body.appendChild(a);
          a.click();
        }
      },
      error: (err) => { },
    });
  }

  onExcelFileDownload(log: any) {
    let body = {
      lan: log.lan,
      service: log.service,
      transactionId: log.transactionId,
    };

    this.dashboardService.getExcelFile(body).subscribe({
      next: (res) => {
        if (res.type === "application/json") {
          alert("No Excel Report Available");
        } else {
          var file = new Blob([res], { type: "application/vnd.ms-excel" });
          var fileURL = URL.createObjectURL(file);
          var a = document.createElement("a");
          a.href = fileURL;
          a.download = `${log.service}_${log.lan}_${log.transactionId}.xls`;
          document.body.appendChild(a);
          a.click();
        }
      },
      error: (err) => {},
    });
  }

  onPdfFileDownload(log: any) {
    let body = {
      lan: log.lan,
      service: log.service,
      transactionId: log.transactionId,
    };

    this.dashboardService.getExcelFile(body).subscribe({
      next: (res) => {
        if (res.type === "application/json") {
          alert("No Report Available");
        } else {
          var file = new Blob([res], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          var a = document.createElement("a");
          a.href = fileURL;
          a.download = `${log.service}_${log.lan}_${log.transactionId}.pdf`;
          document.body.appendChild(a);
          a.click();
        }
      },
      error: (err) => {},
    });
  }

  saveDashboard() {
    if (this.checkOwnershipOfAddress()) {
      alert("Please select Ownership of Address for all the applicants!");
      return;
    }
    if (this.STP_Status == "") {
      alert("Please select STP Status!");
      return;
    }
    if (this.isPD_TypeMandatory) {
      if (this.PD_Type === "") {
        alert("Please select PD Type!");
        return;
      }
    }
    if (this.checkKeyApplicants()) {
      alert("Please select Key Applicant for all the applicants!");
      return;
    }
    // let incomeUpdated = this.removeCommaIncomeDetails(this.applicantIncomeEditable)
    let dashboardData = {
      fsa: this.FSA,
      bsa: this.BSA,
      gst: this.GST,
      itr: this.ITR,
      income: this.applicantIncome,
      incomeUpdated: this.applicantIncomeEditable,
      FICOInput: this.FICOInput,
      applicants: this.applicants,
      monthlyObligations: this.monthlyObligations ?? {},
      manualDeviation: this.manualDeviation,
      autoDeviation: this.autoDeviation,
      natureOfBusiness: this.natureOfBusinessDropDown,
      applicantsBasicDetails: this.applicantsBasicDetails,
      STP_Status: this.STP_Status,
      eligibilityMethod: this.eligibilityMethodDropdown,
      scoreCard: this.scoreCard,
      STP_StatusReason: this.STP_StatusReason,
      PD_Type: this.PD_Type,
      // crimeCheckDetail: this.crimeCheckDetails,,
      ConsumerBureauAnalytics: this.ConsumerBureauAnalyticsResult
    };

    let body = {
      lan: this.lan,
      dashboardVersion: this.dashboardVersion,
      dashboardName: this.dashboardName,
      user: this.user,
      role: this.userrole,
      dashboardData: dashboardData,
    };
    // console.log("save dashboard",body)
    this.dashboardService.saveDashboard(body).subscribe((res) => {
      this.getDashboardVersionList();
      this.dashboardService.triggerDisableSaveDashboard(true);
      //this.dashboardService.triggerDisableSavePDF(true);
    });
  }

  loadSavedDashboard(event) {
    if (event.target.value !== "") {
      this.userReadOnlyAccess = true;
      let body = {
        lan: this.lan,
        dashboardVersion: event.target.value,
      };
      this.dashboardService.getDashboardTemplate(body).subscribe((res) => {
        this.dashboardService.triggerDisableSavePDF(false);
        this.FSA = res.data.fsa;
        this.BSA = res.data.bsa;
        this.GST = res.data.gst;
        this.ITR = res.data.itr;
        this.applicantIncome = res.data.income;

        Object.keys(this.applicantIncome).map((user) => {

          if (this.applicantIncome[user].BSADetails.isLogicUpdated) {
            this.applicantIncome[user].BSADetails["isLogicUpdated"] = true

          } else {

            this.applicantIncome[user].BSADetails["SumofBusinessCreditfor6months"] = this.applicantIncome[user].BSADetails.SumofBusinessCreditfor12months
            this.applicantIncome[user].BSADetails.SumofBusinessCreditfor12months = "0"

            this.applicantIncome[user].BSADetails["MonthlyAverageBankBalancefor6months"] = this.applicantIncome[user].BSADetails.MonthlyAverageBankBalancefor12months
            this.applicantIncome[user].BSADetails.MonthlyAverageBankBalancefor12months = "0"

            this.applicantIncome[user].BSADetails["BTOfor6months"] = this.applicantIncome[user].BSADetails.BTO
            this.applicantIncome[user].BSADetails.BTO = "0"

            this.applicantIncome[user].BSADetails["MinimumABBfor6months"] = this.applicantIncome[user].BSADetails.MinimumABBfor12months
            this.applicantIncome[user].BSADetails.MinimumABBfor12months = "0"

            this.applicantIncome[user].BSADetails["MinimumcreditCountP.M.normfor6Months"] = this.applicantIncome[user].BSADetails["MinimumcreditCountP.M.normfor12Months"]
            this.applicantIncome[user].BSADetails["MinimumcreditCountP.M.normfor12Months"] = "0"

            this.applicantIncome[user].BSADetails["MinimumCreditAmountP.M.Normfor6months"] = this.applicantIncome[user].BSADetails["MinimumCreditAmountP.M.Normfor12months"]
            this.applicantIncome[user].BSADetails["MinimumCreditAmountP.M.Normfor12months"] = "0"

            this.applicantIncome[user].BSADetails["isLogicUpdated"] = true
          }
        })

        this.applicantIncomeDetails = this.applicantIncome[this.users[0].applicantShortName];
        this.applicantIncomeEditable = res.data.incomeUpdated;

        Object.keys(this.applicantIncomeEditable).map((user) => {

          if (this.applicantIncomeEditable[user].BSADetails.isLogicUpdated) {
            this.applicantIncomeEditable[user].BSADetails["isLogicUpdated"] = true

          } else {

            this.applicantIncomeEditable[user].BSADetails["SumofBusinessCreditfor6months"] = this.applicantIncomeEditable[user].BSADetails.SumofBusinessCreditfor12months
            this.applicantIncomeEditable[user].BSADetails.SumofBusinessCreditfor12months = "0"

            this.applicantIncomeEditable[user].BSADetails["MonthlyAverageBankBalancefor6months"] = this.applicantIncomeEditable[user].BSADetails.MonthlyAverageBankBalancefor12months
            this.applicantIncomeEditable[user].BSADetails.MonthlyAverageBankBalancefor12months = "0"

            this.applicantIncomeEditable[user].BSADetails["BTOfor6months"] = this.applicantIncomeEditable[user].BSADetails.BTO
            this.applicantIncomeEditable[user].BSADetails.BTO = "0"

            this.applicantIncomeEditable[user].BSADetails["MinimumABBfor6months"] = this.applicantIncomeEditable[user].BSADetails.MinimumABBfor12months
            this.applicantIncomeEditable[user].BSADetails.MinimumABBfor12months = "0"

            this.applicantIncomeEditable[user].BSADetails["MinimumcreditCountP.M.normfor6Months"] = this.applicantIncomeEditable[user].BSADetails["MinimumcreditCountP.M.normfor12Months"]
            this.applicantIncomeEditable[user].BSADetails["MinimumcreditCountP.M.normfor12Months"] = "0"

            this.applicantIncomeEditable[user].BSADetails["MinimumCreditAmountP.M.Normfor6months"] = this.applicantIncomeEditable[user].BSADetails["MinimumCreditAmountP.M.Normfor12months"]
            this.applicantIncomeEditable[user].BSADetails["MinimumCreditAmountP.M.Normfor12months"] = "0"

            this.applicantIncomeEditable[user].BSADetails["isLogicUpdated"] = true
          }

          if (this.applicantIncomeEditable[user].currentYearData.ITRFilingDate !== "") {
            this.applicantIncomeEditable[user].currentYearData.ITRFilingDate = this.formatDate(this.applicantIncomeEditable[user].currentYearData.ITRFilingDate, "")
          }

          if (this.applicantIncomeEditable[user].previousYearData.ITRFilingDate !== "") {
            this.applicantIncomeEditable[user].previousYearData.ITRFilingDate = this.formatDate(this.applicantIncomeEditable[user].previousYearData.ITRFilingDate, "")
          }
        })

        this.applicantIncomeDetailsEditable =
          this.applicantIncomeEditable[this.users[0].applicantShortName];
        this.FICOInput = res.data.FICOInput;
        this.monthlyObligations = res.data.monthlyObligations;
        this.monthlyObligationDetails = this.monthlyObligations[this.users[0].applicantShortName];
        this.manualDeviation = res.data.manualDeviation;
        this.autoDeviation = res.data.autoDeviation;
        this.updateMonthlyObligation();
        this.updateMonthlyObligationSurrogateMethod();
        this.updateConsiderForObligationMethod();
        this.applicants = res.data.applicants;
        this.natureOfBusinessDropDown = res.data.natureOfBusiness;
        this.applicantsBasicDetails = res.data.applicantsBasicDetails;
        this.STP_Status = res.data.STP_Status;
        this.eligibilityMethodDropdown = res.data.eligibilityMethod
        // this.STP_StatusReason = res.data.STP_StatusReason
        this.PD_Type = res.data.PD_Type || "";
        this.ConsumerBureauAnalyticsResult=res.data.ConsumerBureauAnalytics || [];

        // if (this.eligibilityMethodDropdown === "BL- Pre-computed" || this.eligibilityMethodDropdown === "BL- Pre-Filtered" || this.eligibilityMethodDropdown === "X-SELL INSTA" || this.eligibilityMethodDropdown === "X-SELL Qualified" || this.eligibilityMethodDropdown === "D2C - Banking LTS Program") {
        //   this.isTriggerEligibility = false
        // } else {
        //   this.isTriggerEligibility = true
        // }
        this.scoreCard = res.data.scoreCard
        this.STP_StatusReason = res.data.STP_StatusReason
        this.PD_Type = res.data.PD_Type || ""
        // this.crimeCheckDetails = res.data.crimeCheckDetail
      });
    } else {
      this.users = [];
      this.FSA = {};
      this.BSA = [];
      this.GST = [];
      this.ITR = {};
      this.applicantIncome = {};
      this.applicantIncomeEditable = {};
      this.FICOInput = [];
      this.monthlyObligations = [];
      this.manualDeviation = [];
      this.autoDeviation = [];
      this.applicants = [];
      this.natureOfBusinessDropDown = "";
      this.applicantsBasicDetails = [];
      this.STP_Status = "";
      this.eligibilityMethodDropdown = "INCOMEMETHOD"
      this.scoreCard = {}
      this.STP_StatusReason = ""
      this.PD_Type = ""
      // this.crimeCheckDetails = {}
      this.userReadOnlyAccess = false;
      this.ConsumerBureauAnalyticsResult= [];
      this.getApplicants(this.lan);
      // this.isTriggerEligibility = true

      //this.dashboardService.triggerDisableSavePDF(true);
    }
  }

  clickSnapshotMenu() {
    this.displaySnapshotMenu = !this.displaySnapshotMenu;

    if (!this.displaySnapshotMenu) {
      let el: any = document.getElementById("TriggeredServices");
      el.style.marginTop = "94px";
      // el.style.transition = "all 1s"
    }
  }

  scrollToNote(value) {
    let el: any = document.getElementById(value);
    let parent: any = document.getElementById("PDNotes");
    parent.scrollTop = el.offsetTop - 40;
  }

  scrollToSection(elm) {
    if (elm != "") {
      //let el:any = document.getElementById(event.target.value);
      let el: any = document.getElementById(elm);
      let headerOffset = 200;

      if (this.displaySnapshotMenu) {
        headerOffset = 255;
        if (elm === "TriggeredServices") {
          el.style.marginTop = "150px";
        }
      }

      let elementPosition = el.getBoundingClientRect().top;
      let offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  expandAll(event) {
    if (event.target.textContent == "+") {
      this.dashboardPage.nativeElement
        .querySelectorAll(".accordion-button")
        .forEach((expand) => {
          if (expand.classList.contains("collapsed")) {
            event.target.textContent = "-";
            expand.click();
          }
        });
    } else {
      this.dashboardPage.nativeElement
        .querySelectorAll(".accordion-button")
        .forEach((expand) => {
          if (!expand.classList.contains("collapsed")) {
            event.target.textContent = "+";
            expand.click();
          }
        });
    }
  }
  getAllMonthlyObligationBanknameList(){
    this.dashboardService.getAllMonthlyObligationBanknameList()
    .subscribe((res) => {
      if(res.status){
        this.bankNames= res.data.banklist;
      }
    }
    );
  }

  getAllMonthlyObligationLoanTypeHashMap(){
    this.dashboardService.getAllMonthlyObligationLoanTypeHashMap()
    .subscribe((res) => {
      if(res.status){
        this.monthlyObligationLoanTypes= res.data.LoanTypeList;
        Object.keys(this.monthlyObligationLoanTypes).map((key) => {
          this.selectedMonthlyObligationLoanType.push(key);
       });
     
    }}
    );
  }

  getMonthlyObligation() {
    this.dashboardService
      .getMonthlyObligation({ lan: this.lan })
      .subscribe((res) => {
        let data = res.data;
        let tempMO = {};
        if (data) {
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < this.applicants.length; j++) {
              if (this.applicants[j].custcif == data[i].cif) {
                let user = this.applicants[j].custshrtname;
                data[i].totalunsecuredObligation = this.toNumber.transform(
                  data[i].totalunsecuredObligation
                );
                data[i].totalsecuredObligation = this.toNumber.transform(
                  data[i].totalsecuredObligation
                );
                data[i].totalMonthlyObligationSurrogateMethod =
                  this.toNumber.transform(
                    data[i].totalMonthlyObligationSurrogateMethod
                  );
                data[i].totalMonthlyObligation = this.toNumber.transform(
                  data[i].totalMonthlyObligation
                );
                data[i].totalAnnualObligation = this.toNumber.transform(
                  data[i].totalAnnualObligation
                );
                tempMO[user] = data[i];
              }
            }
          }
        }
        this.monthlyObligations = tempMO;

        // console.log(this.monthlyObligations)

        if (Object.keys(this.monthlyObligations).length !== 0) {
          Object.keys(this.monthlyObligations).map((user) => {
            this.monthlyObligationDetails = this.monthlyObligations[user]
              ? this.monthlyObligations[user]
              : {
                totalunsecuredObligation: 0,
                totalsecuredObligation: 0,
                totalMonthlyObligationSurrogateMethod: 0,
                totalMonthlyObligation: 0,
                totalAnnualObligation: 0,
                monthlyObligation: [],
              };

              if (this.monthlyObligationDetails) {
                for (
                  let i = 0;
                  i < this.monthlyObligationDetails.monthlyObligation.length;
                  i++
                ) {
                  const decimal_pos =  this.monthlyObligationDetails.monthlyObligation[i].loanDate.indexOf(' ');
                  if( decimal_pos != -1){
                    let loanDate = this.monthlyObligationDetails.monthlyObligation[i].loanDate.substring(0, decimal_pos);
                    this.monthlyObligationDetails.monthlyObligation[i].loanDate=loanDate;
                  }
                    this.selectedBanks.push(this.bankNames); 
                    this.selectedRepaymentBanks.push(this.bankNames); 
                    this.selectedMonthlyObligationLoanTypeList.push(this.selectedMonthlyObligationLoanType);
                    this.monthlyObligationDetails.monthlyObligation[i].ConsideredforBankingFlag=false;
                    this.monthlyObligationDetails.monthlyObligation[i].ConsideredforObligationFlag=false;
                    this.monthlyObligationDetails.monthlyObligation[i].SecurityTypeFlag=false;
                    this.monthlyObligationDetails.monthlyObligation[i].bankNameFlag=false;
                    this.monthlyObligationDetails.monthlyObligation[i].installmentAmoutFlag=false;
                    this.monthlyObligationDetails.monthlyObligation[i].loanDateFlag=false;
                    this.monthlyObligationDetails.monthlyObligation[i].loanTypeFlag=false;
                    this.monthlyObligationDetails.monthlyObligation[i].originalAmountFlag=false;
                    this.monthlyObligationDetails.monthlyObligation[i].outstandingBalanceFlag=false;
                    this.updateMonthlyObligationStatus(i);
               }}
            this.updateMonthlyObligation()
            this.updateMonthlyObligationSurrogateMethod()
            this.updateConsiderForObligationMethod()
            this.updateTotalMonthlyObligationAllUser();
          })
        }

        setTimeout(() => {
          this.applicantsElmMonthlyObligation.nativeElement
            .querySelectorAll(".btn:first-child")
            .forEach((applicant) => {
              applicant.click();
            });
        }, 0);
      });
  }

  updateMonthlyObligationLoanDate(i){
    this.monthlyObligationDetails.monthlyObligation[i].loanDateEdited=true;
    }
   
    updateMonthlyObligationLoanType(event,i) { 
      let value= event.target.value;
      this.monthlyObligationDetails.monthlyObligation[i].loanTypeEdited=true;
     this.selectedMonthlyObligationLoanTypeList[i] = this.searchMonthlyObligationLoanType(value);
     }
     
     searchMonthlyObligationLoanType(value: string) { 
       let filter = value.toLowerCase();
       return this.selectedMonthlyObligationLoanType.filter((option) => option.toLowerCase().startsWith(filter));
     }
    
     updateMonthlyObligationOutstandingBalance(i){
    this.monthlyObligationDetails.monthlyObligation[i].outstandingBalanceEdited=true;
    }
    
    updateMonthlyObligationLoanAmount(i){
    this.monthlyObligationDetails.monthlyObligation[i].originalAmountEdited=true;
    }
    
    updateMonthlyObligationInstallmentAmout(i){
    this.monthlyObligationDetails.monthlyObligation[i].installmentAmoutEdited=true;
    }
  updateTotalMonthlyObligationAllUser() {
    // console.log("this.monthlyObligations", this.monthlyObligations);
    this.totalObligation.totalMonthlyObligation = 0;
    this.totalObligation.totalMonthlyObligationBankingSurrogate = 0;
    this.totalObligation.totalAnnualObligation = 0;
    this.totalObligation.totalUnsecureExposure = 0;
    this.totalObligation.totalSecureExposure = 0;
    Object.keys(this.monthlyObligations).map((obj) => {
      this.totalObligation.totalMonthlyObligation =
        this.toNumber.transform(this.totalObligation.totalMonthlyObligation) +
        this.toNumber.transform(
          this.monthlyObligations[obj].totalMonthlyObligation
        );
      this.totalObligation.totalMonthlyObligationBankingSurrogate =
        this.toNumber.transform(
          this.totalObligation.totalMonthlyObligationBankingSurrogate
        ) +
        this.toNumber.transform(
          this.monthlyObligations[obj].totalMonthlyObligationSurrogateMethod
        );
      this.totalObligation.totalAnnualObligation =
        this.toNumber.transform(this.totalObligation.totalAnnualObligation) +
        this.toNumber.transform(
          this.monthlyObligations[obj].totalAnnualObligation
        );
      this.totalObligation.totalUnsecureExposure =
        this.toNumber.transform(this.totalObligation.totalUnsecureExposure) +
        this.toNumber.transform(
          this.monthlyObligations[obj].totalunsecuredObligation
        );
      this.totalObligation.totalSecureExposure =
        this.toNumber.transform(this.totalObligation.totalSecureExposure) +
        this.toNumber.transform(
          this.monthlyObligations[obj].totalsecuredObligation
        );
    });
    // this.totalObligation.totalAnnualObligation = this.totalObligation.totalAnnualObligation * 12
  }

  updateMonthlyObligation() {
    let Securetotal = 0;
    let UnSecuretotal = 0;

    if (this.monthlyObligationDetails) {
      for (
        let i = 0;
        i < this.monthlyObligationDetails.monthlyObligation.length;
        i++
      ) {
    
        if (
          this.monthlyObligationDetails.monthlyObligation[i].SecurityType ==
          "Secured"
        ) {
          Securetotal =
            Securetotal +
            this.toNumber.transform(
              this.monthlyObligationDetails.monthlyObligation[i]
                .outstandingBalance
            );
        }
        if (
          this.monthlyObligationDetails.monthlyObligation[i].SecurityType ==
          "Unsecured"
        ) {
          UnSecuretotal =
            UnSecuretotal +
            this.toNumber.transform(
              this.monthlyObligationDetails.monthlyObligation[i]
                .outstandingBalance
            );
        }
      }
      this.monthlyObligationDetails.totalunsecuredObligation = UnSecuretotal;
      this.monthlyObligationDetails.totalsecuredObligation = Securetotal;
      this.updateTotalMonthlyObligationAllUser();

      
    }
  }

  updateMonthlyObligationSurrogateMethod() {
    let total = 0;

    if (this.monthlyObligationDetails) {
      for (
        let i = 0;
        i < this.monthlyObligationDetails.monthlyObligation.length;
        i++
      ) {
        if (
          this.monthlyObligationDetails.monthlyObligation[i]
            .ConsideredforBanking == "Yes"
        ) {
          total =
            total +
            this.toNumber.transform(
              this.monthlyObligationDetails.monthlyObligation[i]
                .installmentAmout
            );
        }
      }
      this.monthlyObligationDetails.totalMonthlyObligationSurrogateMethod =
        total;
      this.updateTotalMonthlyObligationAllUser();
    }
  }

  updateConsiderForObligationMethod() {
    let total = 0;
    if (this.monthlyObligationDetails) {
      for (
        let i = 0;
        i < this.monthlyObligationDetails.monthlyObligation.length;
        i++
      ) {
        if (
          this.monthlyObligationDetails.monthlyObligation[i]
            .ConsideredforObligation == "Yes"
        ) {
          total =
            total +
            this.toNumber.transform(
              this.monthlyObligationDetails.monthlyObligation[i]
                .installmentAmout
            );
        }
      }
      this.monthlyObligationDetails.totalMonthlyObligation = total;
      this.monthlyObligationDetails.totalAnnualObligation = total * 12;
      this.updateTotalMonthlyObligationAllUser();
    }
  }

  getLogs() {
    let body = {
      lan: this.lan,
    };
    this.dashboardService.getLogs(body).subscribe((res) => {
      if (res.data) {
        let serviceLogs = res.data.serviceWiseLogs;
        this.allLogs = res.data.allLogs;

        for (let i = 0; i < serviceLogs.length; i++) {
          serviceLogs[i].logs.sort((a, b) => {
            const timeA = a.start_time.toUpperCase();
            const timeB = b.start_time.toUpperCase();
            if (timeA < timeB) {
              return 1;
            }
            if (timeA > timeB) {
              return -1;
            }
            return 0;
          });
          this.serviceLogs[serviceLogs[i].Service.replace(/\s+/, "")] =
            serviceLogs[i].logs;
        }
      }
    });
  }

  checkArrayLog(value) {
    try {
      JSON.parse(value)
      return true
    } catch (error) {
      return false
    }
  }

  triggerScorecard() {
    let userDetails = this.getApplicantDetailsForEquility();
    let remainingFields = this.getRemainingFieldsForEquility();
    let temp = {
      ...userDetails,
      ...remainingFields,
    };
    this.dashboardService.triggerScorecard(temp).subscribe((data) => {
      if (data.data) {

        this.scoreCard = data.data
        this.CRIFScore = data.data.CRIFScore || "0";
        this.CRIFSegment = data.data.CRIFRiskSegment || "--";
        this.judgementalScore = data.data.Score;
        this.judgementalSegment = data.data.RiskSegment;

        let CRIFScoreArr = data.data.CRIFScoreArray

        if (CRIFScoreArr) {
          if (CRIFScoreArr.length !== 0) {
            for (let i = 0; i < this.applicants.length; i++) {
              if (this.applicants[i].applicant_type == "co-app") {
                CRIFScoreArr.map((crifscore) => {
                  if (this.applicants[i].custcif === crifscore.CIF) {
                    this.applicants[i].CRIFScore = crifscore
                  }
                })
              }
            }
          } else {
            for (let i = 0; i < this.applicants.length; i++) {
              if (this.applicants[i].applicant_type == "co-app") {
                this.applicants[i].CRIFScore.Category = "--"
                this.applicants[i].CRIFScore.Score = "0"
                this.applicants[i].CRIFScore.ScoreName = "BL_CRIF_Score_Card"
              }
            }
          }
        } else {
          for (let i = 0; i < this.applicants.length; i++) {
            if (this.applicants[i].applicant_type == "co-app") {
              this.applicants[i].CRIFScore.Category = "--"
              this.applicants[i].CRIFScore.Score = "0"
              this.applicants[i].CRIFScore.ScoreName = "BL_CRIF_Score_Card"
            }
          }
        }
      }
    });
  }

  saveIncomeDetails() {
    this.loader = true;
    let incomeUpdated = this.removeCommaIncomeDetails(this.applicantIncomeEditable)

    let saveIncomeDetails: any = [];
    for (let i = 0; i < this.applicants.length; i++) {
      // console.log("app", this.applicantIncomeEditable)
      let obj = {
        lan: this.lan,
        user_name: this.applicants[i].custshrtname,
        user_type: this.applicants[i].applicant_type == "mainapp" ? "ma" : "ca",
        incomeDetailsData: {
          ...incomeUpdated[this.applicants[i].custshrtname],
        },
      };
      saveIncomeDetails.push(obj);
    }
    let body = {
      saveIncomeDetails: saveIncomeDetails,
    };
    // console.log("save", body)
    this.dashboardService.saveIncomeDetails(body).subscribe((data) => {
      this.loader = false;
    });
  }

  getApplicantLastSavedData() {
    let body = {
      lan: this.lan,
    };
    this.dashboardService.getApplicantLastSavedData(body).subscribe({
      next: (res) => {
        if (res.status) {
          let data = res.data;
          for (let i = 0; i < this.applicants.length; i++) {
            for (let j = 0; j < data.data.length; j++) {
              if (this.applicants[i].custcif === data.data[j].cif) {
                this.applicants[i].relationshiptokm =
                  data.data[j].relationshipToKM;
                this.applicants[i].addressOwnerShip =
                  data.data[j].addressOwnerShip;

                if (this.applicants[i].applicant_type === "mainapp") {
                  this.natureOfBusinessDropDown = data.data[j].natureOfBusiness;
                  this.STP_Status = data.data[j].stpStatus;
                  this.STP_StatusReason = data.data[j].stpReason;
                  this.PD_Type = data.data[j].pdType || "";
                  this.applicants[i].corpkeyperson = data.data[j].keyPerson;
                }
                if (this.applicants[i].applicant_type === "co-app") {
                  this.applicants[i].retailkeyperson = data.data[j].keyPerson;
                  this.applicants[i].shareholding =
                    data.data[j].shareholdingper;
                }
                break;
              }
            }
          }
        }
      },
      error: (err) => { },
    });
  }

  saveApplicantDetails() {
    let saveApplicantDetails: any = [];
    this.loader = true;
    // console.log("this.applicant", this.applicants)
    for (let i = 0; i < this.applicants.length; i++) {
      let obj = {
        cif: this.applicants[i].custcif,
        user_name: this.applicants[i].custshrtname,
        user_type: this.applicants[i].applicant_type == "mainapp" ? "ma" : "ca",
        stpStatus: this.STP_Status,
        stpReason: this.STP_StatusReason,
        addressOwnerShip: this.applicants[i].addressOwnerShip || "",
        relationshipToKM: this.applicants[i].relationshiptokm || "",
      };
      if (this.applicants[i].applicant_type === "mainapp") {
        obj["natureOfBusiness"] = this.natureOfBusinessDropDown;
        obj["pdType"] = this.PD_Type;
        obj["keyPerson"] = this.applicants[i].corpkeyperson
      }
      if (this.applicants[i].applicant_type === "co-app") {
        obj["keyPerson"] = this.applicants[i].retailkeyperson || "";
        obj["shareholdingper"] = this.applicants[i].shareholding;
      }
      saveApplicantDetails.push(obj);
    }
    let body = {
      lan: this.lan,
      data: saveApplicantDetails,
      saved_by: "Akash",
    };
    // console.log("body", body)
    this.dashboardService.saveApplicantDetails(body).subscribe((data) => {
      this.loader = false;
    });
  }

  saveMonthlyObligation() {
    this.loader = true;
    let tempMO: any = [];
    if (this.monthlyObligations) {
      let keysMO = Object.keys(this.monthlyObligations);
      if (keysMO.length !== 0) {
        keysMO.map((key: any) => {
          tempMO.push(this.monthlyObligations[key]);
        });
      }
    }

    let body = {
      lan: this.lan,
      totalObligation: this.totalObligation,
      monthlyObligation: tempMO,
      saved_by: "Akash",
    };
    // console.log("body", body)
    this.dashboardService
      .saveMonthlyObligationDetails(body)
      .subscribe((data) => {
        this.loader = false;
      });
  }

  getSTPDetails() {
    let body = {
      lan: this.lan,
    };
    this.dashboardService.getSTPDetails(body).subscribe((data) => {
      if (data.data) {
        this.STP_Status = data.data;
      }
    });
  }

  getManualDeviation() {
    let body = {
      lan: this.lan,
    };
    this.dashboardService.getManualDeviation(body).subscribe((data) => {
      if (data.data && Object.keys(data.data).length !== 0) {
        let dataHFC = data.data.HFC;
        let dataNBFC = data.data.NBFC;

        if (dataHFC.applicant && dataHFC.applicant.length > 0) {
          console.log("HFC");
          this.manualDeviation = dataHFC.applicant;
        } else if (dataNBFC.applicant && dataNBFC.applicant.length > 0) {
          console.log("NBFC");
          this.manualDeviation = dataNBFC.applicant;
        } else {
          console.log("No Applicants");
        }
        // if(data.data.HFC.applicant.length){
        //   this.manualDeviation = data.data.HFC.applicant;
        // } else {
        //   this.manualDeviation = data.data.NBFC.applicant;
        // }
      }
    });
  }

  getCibilScoreColor(value: string){

    let cibilScore
    if (value === "000-1") {
      cibilScore = value
    } else {
      cibilScore = Number(value)
    }
    if (cibilScore < 700 || cibilScore === "000-1") {
      return "#8E191C" // Red color
    } else if (cibilScore >= 700 && cibilScore < 750) {
      return "#FFDE17" // Yellow color
    } else if (cibilScore >= 750) {
      return "#83C775" // Green color
    } else {
      return ""
    }
  }

  scrollToTop(){

    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
    
    if (this.displaySnapshotMenu) {
      let elm = "TriggeredServices"
      this.scrollToSection(elm)
    }
  }

  getCrimeCheckDetails() {

    let body = {
      lan: this.lan,
    };

    this.dashboardService.crimeCheckDetails(body).subscribe({
      next: (res) => {

        if (res.data) {
          this.crimeCheckDetails = res.data
        } else {
          this.crimeCheckDetails = {}
        }

        setTimeout(() => {
          this.applicantsElmCrimeCheck.nativeElement
            .querySelectorAll(".btn:first-child")
            .forEach((applicant) => {
              applicant.click();
            });
        }, 0);
      },
      error: (err) => {}
    })
  }

  addNewRowForMonthlyObligation(){

    if(this.monthlyObligationDetails.monthlyObligation.length == 0){
      let i=0;

      var monthlyObligationObj={
        loanDate:'',
        bankName:'',
        loanType:'',
        originalAmount:'0',
        outstandingBalance:'0',
        installmentAmout:'0',
        SecurityType:'',
        ConsideredforBanking:'',
        ConsideredforObligation:'',
        ObligationStatus:'',
        RepaymentBank:'',
        firstEMIValue:0,
        SecondEMIValue:0,
        ThirdEMIValue:0,
        FourthEMIValue:0,
        FifthEMIValue:0,
        SixthEMIValue:0,
        BalanceTenure:'',
        Tenure:'',
        firstEMIMonth:this.monthlyObligationDetails.firstEMIMonth,
        SecondEMIMonth:this.monthlyObligationDetails.SecondEMIMonth,
        ThirdEMIMonth:this.monthlyObligationDetails.ThirdEMIMonth,
        FourthEMIMonth:this.monthlyObligationDetails.FourthEMIMonth,
        FifthEMIMonth:this.monthlyObligationDetails.FifthEMIMonth,
        SixthEMIMonth:this.monthlyObligationDetails.SixthEMIMonth,
        ObligationRemarks:'',
        ConsideredforBankingFlag:false,
        ConsideredforObligationFlag:false,
        SecurityTypeFlag:false,
        bankNameFlag:false,
        installmentAmoutFlag:false,
        loanDateFlag:false,
        loanTypeFlag:false,
        originalAmountFlag:false,  
        outstandingBalanceFlag:false,  
        disableTenure:false,
        EMIYearMonth:[],
        id:"0",
        cif:this.monthlyObligationDetails.cif
      };
      this.selectedBanks.push(this.bankNames); 
      this.selectedRepaymentBanks.push(this.bankNames); 
      this.selectedMonthlyObligationLoanTypeList.push(this.selectedMonthlyObligationLoanType);

      this.monthlyObligationDetails.monthlyObligation.push(monthlyObligationObj);
      
     
    }else{

    // if(this.checkAllDetailsAreFilledInMonthlyObligation()){

    // }else{
      let i=(this.monthlyObligationDetails.monthlyObligation.length) - 1;

      var monthlyObligationObj={
        loanDate:'',
        bankName:'',
        loanType:'',
        originalAmount:'0',
        outstandingBalance:'0',
        installmentAmout:'0',
        SecurityType:'',
        ConsideredforBanking:'',
        ConsideredforObligation:'',
        ObligationStatus:'',
        RepaymentBank:'',
        firstEMIValue:0,
        SecondEMIValue:0,
        ThirdEMIValue:0,
        FourthEMIValue:0,
        FifthEMIValue:0,
        SixthEMIValue:0,
        BalanceTenure:'',
        Tenure:'',
        firstEMIMonth:this.monthlyObligationDetails.firstEMIMonth,
        SecondEMIMonth:this.monthlyObligationDetails.SecondEMIMonth,
        ThirdEMIMonth:this.monthlyObligationDetails.ThirdEMIMonth,
        FourthEMIMonth:this.monthlyObligationDetails.FourthEMIMonth,
        FifthEMIMonth:this.monthlyObligationDetails.FifthEMIMonth,
        SixthEMIMonth:this.monthlyObligationDetails.SixthEMIMonth,
        ObligationRemarks:'',
        ConsideredforBankingFlag:false,
        ConsideredforObligationFlag:false,
        SecurityTypeFlag:false,
        bankNameFlag:false,
        installmentAmoutFlag:false,
        loanDateFlag:false,
        loanTypeFlag:false,
        originalAmountFlag:false,  
        outstandingBalanceFlag:false,  
        disableTenure:false,
        EMIYearMonth:[],
        id:"0",
        cif:this.monthlyObligationDetails.cif
      };
      this.selectedBanks.push(this.bankNames); 
      this.selectedRepaymentBanks.push(this.bankNames); 
      this.selectedMonthlyObligationLoanTypeList.push(this.selectedMonthlyObligationLoanType);

      this.monthlyObligationDetails.monthlyObligation.push(monthlyObligationObj);
  
    // }
  }
  }

  // checkAllDetailsAreFilledInMonthlyObligation():boolean{
  //  let count=0;

  //  for (let i = 0;i < this.monthlyObligationDetails.monthlyObligation.length; i++
  // ) {

  //   if(this.monthlyObligationDetails.monthlyObligation[i].loanDate == ''){

  //     this.monthlyObligationDetails.monthlyObligation[i].loanDateFlag=true;
  //     setTimeout(() => {
  //       this.monthlyObligationDetails.monthlyObligation[i].loanDateFlag=false;
  //     }, 1500);

  //     count=count+1;
  //   }
  //   if(this.monthlyObligationDetails.monthlyObligation[i].bankName == '' || typeof this.monthlyObligationDetails.monthlyObligation[i].bankName === 'undefined'){
  //     this.monthlyObligationDetails.monthlyObligation[i].bankNameFlag=true;
  //     count=count+1;
  //     setTimeout(() => {
  //       this.monthlyObligationDetails.monthlyObligation[i].bankNameFlag=false;
  //     }, 1500);
  //   }
  //   if(this.monthlyObligationDetails.monthlyObligation[i].loanType == ''){
  //     this.monthlyObligationDetails.monthlyObligation[i].loanTypeFlag=true;
  //     count=count+1;
  //     setTimeout(() => {
  //       this.monthlyObligationDetails.monthlyObligation[i].loanTypeFlag=false;
  //     }, 1500);
  //   }    
   
  //   if(this.monthlyObligationDetails.monthlyObligation[i].originalAmount == '' || this.monthlyObligationDetails.monthlyObligation[i].originalAmount == null
  //   || this.monthlyObligationDetails.monthlyObligation[i].originalAmount === null){
  //     this.monthlyObligationDetails.monthlyObligation[i].originalAmountFlag=true;
  //     count=count+1;
  //     setTimeout(() => {
  //       this.monthlyObligationDetails.monthlyObligation[i].originalAmountFlag=false;
  //     }, 1500);
  //   }    

  //   if(this.monthlyObligationDetails.monthlyObligation[i].outstandingBalance == '' || this.monthlyObligationDetails.monthlyObligation[i].outstandingBalance == null
  //   || this.monthlyObligationDetails.monthlyObligation[i].outstandingBalance === null){
  //     this.monthlyObligationDetails.monthlyObligation[i].outstandingBalanceFlag=true;
  //     count=count+1;
  //     setTimeout(() => {
  //       this.monthlyObligationDetails.monthlyObligation[i].outstandingBalanceFlag=false;
  //     }, 1500);
  //   }    
  //   if(this.monthlyObligationDetails.monthlyObligation[i].installmentAmout == '' || this.monthlyObligationDetails.monthlyObligation[i].installmentAmout == null
  //   || this.monthlyObligationDetails.monthlyObligation[i].installmentAmout === null){
  //     this.monthlyObligationDetails.monthlyObligation[i].installmentAmoutFlag=true;
  //     count=count+1;
  //     setTimeout(() => {
  //       this.monthlyObligationDetails.monthlyObligation[i].installmentAmoutFlag=false;
  //     }, 1500);
  //   }
  //   if((this.monthlyObligationDetails.monthlyObligation[i].SecurityType == '' || this.monthlyObligationDetails.monthlyObligation[i].SecurityType == 'Select') && !this.monthlyObligationDetails.monthlyObligation[i].disableSecurityType ){
  //     this.monthlyObligationDetails.monthlyObligation[i].SecurityTypeFlag=true;
  //     count=count+1;
  //     setTimeout(() => {
  //       this.monthlyObligationDetails.monthlyObligation[i].SecurityTypeFlag=false;
  //     }, 1500);
  //   }
  //   if((this.monthlyObligationDetails.monthlyObligation[i].ConsideredforObligation == '' || this.monthlyObligationDetails.monthlyObligation[i].ConsideredforObligation == 'Select') && !this.monthlyObligationDetails.monthlyObligation[i].disableConsideredForObligation){
  //     this.monthlyObligationDetails.monthlyObligation[i].ConsideredforObligationFlag=true;
  //     count=count+1;
  //     setTimeout(() => {
  //       this.monthlyObligationDetails.monthlyObligation[i].ConsideredforObligationFlag=false;
  //     }, 1500);
  //   }
  //   if((this.monthlyObligationDetails.monthlyObligation[i].ConsideredforBanking == '' || this.monthlyObligationDetails.monthlyObligation[i].ConsideredforBanking == 'Select')&& !this.monthlyObligationDetails.monthlyObligation[i].disableConsideredForBanking){
  //     this.monthlyObligationDetails.monthlyObligation[i].ConsideredforBankingFlag=true;
  //     count=count+1;
  //     setTimeout(() => {
  //       this.monthlyObligationDetails.monthlyObligation[i].ConsideredforBankingFlag=false;
  //     }, 1500);
  //   }

  // }

  // if(count > 0){
  //   return true;
  // }else{
  //   return false;
  // }
  // }
  
  updateConsiderForObligationMethodAfterChange() {
    let total = 0;
    if (this.monthlyObligationDetails) {
      for (
        let i = 0;
        i < this.monthlyObligationDetails.monthlyObligation.length;
        i++
      ) {
        if (
          this.monthlyObligationDetails.monthlyObligation[i]
            .ConsideredforObligation == "Yes"
        ) {
          console.log( "installmentAmout: "+this.monthlyObligationDetails.monthlyObligation[i]
          .installmentAmout.indexOf('.')
          );
          const decimal_pos = this.monthlyObligationDetails.monthlyObligation[i]
          .installmentAmout.indexOf('.');
          console.log( "decimal_pos: "+decimal_pos
          );
          let left_side = this.monthlyObligationDetails.monthlyObligation[i]
          .installmentAmout.substring(0, decimal_pos);
          console.log( "left_side: "+left_side
          );
          var x =  this.toNumber.transform(left_side);
         
          console.log( "installmentAmout: "+x
          );
          total =
            total +
            x;
        }
      }
      this.monthlyObligationDetails.totalMonthlyObligation = total;
      // this.monthlyObligationDetails.totalAnnualObligation = total * 12;
      // this.updateTotalMonthlyObligationAllUser();
    }
  }

 

  getFinancialRatioColor(value: any){

    let val = Number(value)
    if (val <= 33) {
      return "#8E191C" // Red color
    } else if (val > 33 && val < 70) {
      return "#FFDE17" // Yellow color
    } else if (val >= 70 ) {
      return "#83C775" // Green color
    } else {
      return ""
    }
  }

  getBsaBankHealthColor(color: string = ""){

    let data = color.toLowerCase()

    switch (data) {

      case 'red':

        return '#df4747';

      case 'green':

        return '#83C775';

      case 'amber':

        return '#FFDE17';

      default:

        return 'parent';

    }

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  updateMonthlyObligationStatus(i){
    if(this.monthlyObligationDetails.monthlyObligation[i].ObligationStatus == 'Close in 6 months'
    ){
      this.monthlyObligationDetails.monthlyObligation[i].ConsideredforBanking='No';
      this.monthlyObligationDetails.monthlyObligation[i].ConsideredforObligation='No';
      this.monthlyObligationDetails.monthlyObligation[i].disableSecurityType=false;
      this.monthlyObligationDetails.monthlyObligation[i].disableConsideredForBanking=true;
      this.monthlyObligationDetails.monthlyObligation[i].disableConsideredForObligation=true;
      this.monthlyObligationDetails.monthlyObligation[i].disableTenure=true;

      this.updateConsiderForObligationMethod();
      this.updateMonthlyObligationSurrogateMethod();
  }else if(this.monthlyObligationDetails.monthlyObligation[i].ObligationStatus == 'Close' || 
    this.monthlyObligationDetails.monthlyObligation[i].ObligationStatus == 'Group Exposure' ||  
    this.monthlyObligationDetails.monthlyObligation[i].ObligationStatus == 'Gurantor'){
      this.monthlyObligationDetails.monthlyObligation[i].ConsideredforBanking='No';
      this.monthlyObligationDetails.monthlyObligation[i].ConsideredforObligation='No';
      this.monthlyObligationDetails.monthlyObligation[i].disableSecurityType=true;
      this.monthlyObligationDetails.monthlyObligation[i].disableConsideredForBanking=true;
      this.monthlyObligationDetails.monthlyObligation[i].disableConsideredForObligation=true;
      this.monthlyObligationDetails.monthlyObligation[i].disableTenure=true;
      this.updateConsiderForObligationMethod();
      this.updateMonthlyObligationSurrogateMethod();

    } else{
      this.monthlyObligationDetails.monthlyObligation[i].disableSecurityType=false;
      this.monthlyObligationDetails.monthlyObligation[i].disableConsideredForBanking=false;
      this.monthlyObligationDetails.monthlyObligation[i].disableConsideredForObligation=false;
      this.monthlyObligationDetails.monthlyObligation[i].disableTenure=false;

    }

  }
  
  loanTypeDescriptionInMonthlyObligation(loantype){
    let valueDes=false;
  Object.keys(this.monthlyObligationLoanTypes).map((key) => {
    if(loantype == key){
      valueDes=true;
    }
 });

 if(valueDes){
return this.monthlyObligationLoanTypes.get(loantype);
 }else{
  return '';
 }
 
  }

}


export interface consumerBureauAnalyticsRes {
  totalNoOfActiveAcct: string;
  numNonCCEnqLast18Days: string;
  totalOutstanding: string;
  totalNumEnqLast12Months: string;
  noOfActiveNonCCAcct: string;
  currUtilisationLiveAcct_CC: string;
  countOf3PlusCCAcctLast24m: string;
  blcOfwrittenOff_SettledCC: string;
  totalNumEnqLast3Days: string;
  writtenOffSettledBeyond24Months_NonCC: string;
  writtenOffSettledBeyond24Months_CC: string;
  countOfwrittenOff_SettledNonCC: string;
  totalNoOfClosedAcct: string;
  numNonCCEnqLast7Days: string;
  maxDPD24Months_CC: string;
  noOfActiveCCAcct: string;
  countOf3PlusNonCCAcctLast24m: string;
  totalMaxDelinquencyInlife: string;
  blcOfwrittenOff_SettledNonCC: string;
  totalNumEnqLast9Days: string;
  numNonCCEnqLast9Days: string;
  acctOpenedLast12Months_NonCC: string;
  numCCEnqLast18Days: string;
  totalCountwrittenOff_Settled: string;
  numNonCCEnqLast3Days: string;
  writtenOffSettledWithin24Months_NonCC: string;
  totalNonCCOverdueAmt: string;
  maxDPD24Months_NonCC: string;
  noOfAcctOpenedinL12MonthsAndCurrActive_NonCC: string;
  BlcOfwrittenOff_Settled: string;
  totalNumEnqLast18Days: string;
  numCCEnqLast3Days: string;
  numCCEnqLast36Days: string;
  numCCEnqLast9Days: string;
  totalCountOf3PlusLast24m: string;
  totalNumEnqLast7Days: string;
  totalCibilScore: string;
  numNonCCEnqLast36Days: string;
  noOfClosedNonCCAcct: string;
  totalCCOutstanding: string;
  avgCurrUtilisationLiveAcct_NonCC: string;
  totalCCOverdueAmt: string;
  totalNumEnqLast36Days: string;
  numCCEnqLast7Days: string;
  sumOf3PlusCCAcctLast24m: string;
  noOfClosedCCAcct: string;
  acctOpenedLast12Months_CC: string;
  totalOverdueAmt: string;
  totalAvgCurrUtilisationLiveAcct: string;
  totalNonCCOutstanding: string;
  writtenOffSettledWithin24Months_CC: string;
  countOfwrittenOff_SettledCC: string;
  totalSumOf30PlusLast24m:string;
  sumOf30PlusCCAcctLast24m:string;
  sumOf30PlusNonCCAcctLast24m:string;
  totalCountOf30PlusLast24m:string;
  countOf30PlusCCAcctLast24m:string;
  countOf30PlusNonCCAcctLast24m:string;
  totalNumEnqLast360Days:string;
  numCCEnqLast360Days:string;
  numNonCCEnqLast360Days:string;
  totalNumEnqLast180Days:string;
  numCCEnqLast180Days:string;
  numNonCCEnqLast180Days:string;
  totalNumEnqLast90Days:string;
  numCCEnqLast90Days:string;
  numNonCCEnqLast90Days:string;
  totalNumEnqLast30Days:string;
  numCCEnqLast30Days:string;
  numNonCCEnqLast30Days:string;
  avgCurrUtilisationLiveAcct_CC:string;
  maxDPDBeyond24Months_NonCC:string;
  noOfEnqInL6m:string;
  maxDPD24Months_NonCCColor:string;
  totalCibilScoreColor:string;
  writtenOffSettledWithin24Months_CCColor:string;
  writtenOffSettledBeyond24Months_CCColor:string;
  totalNumEnqLast12MonthsColor:string;
  currUtilisationLiveAcct_CCColor:string;
  acctOpenedLast12Months_CCColor:string;
  maxDPD24Months_CCColor:string;
  acctOpenedLast12Months_NonCCColor:string;
  writtenOffSettledWithin24Months_NonCCColor:string;
  avgCurrUtilisationLiveAcct_NonCCColor:string;
  writtenOffSettledBeyond24Months_NonCCColor:string;
  totalCCOverdueAmtColor:string;
  totalAvgCurrUtilisationLiveAcctColor:string;
  totalMaxDelinquencyInlifeColor:string;
  maxDPDBeyond24Months_NonCCColor:string;
  noOfAcctOpenedinL12MonthsAndCurrActive_NonCCColor:string;
  noOfEnqInL6mColor:string;
  totalCCOverdueAmtSummary:string;
  totalNonCCOverdueAmtColor:string;
}

let ConsumerBureauAnalyticsVariable:consumerBureauAnalyticsRes={
  avgCurrUtilisationLiveAcct_CC:'NA',
  maxDPDBeyond24Months_NonCC:'NA',
  numCCEnqLast90Days:'NA',
  numCCEnqLast180Days:'NA',
  totalNumEnqLast180Days:'NA',
  totalNoOfActiveAcct :'NA',
  numNonCCEnqLast18Days :'NA',
  totalOutstanding :'NA',
  totalNumEnqLast12Months :'NA',
  noOfActiveNonCCAcct :'NA',
  currUtilisationLiveAcct_CC :'NA',
  countOf3PlusCCAcctLast24m :'NA',
  blcOfwrittenOff_SettledCC :'NA',
  totalNumEnqLast3Days :'NA',
  writtenOffSettledBeyond24Months_NonCC :'NA',
  writtenOffSettledBeyond24Months_CC :'NA',
  countOfwrittenOff_SettledNonCC :'NA',
  totalNoOfClosedAcct :'NA',
  numNonCCEnqLast7Days :'NA',
  maxDPD24Months_CC :'NA',
  noOfActiveCCAcct :'NA',
  countOf3PlusNonCCAcctLast24m :'NA',
  totalMaxDelinquencyInlife :'NA',
  blcOfwrittenOff_SettledNonCC :'NA',
  totalNumEnqLast9Days :'NA',
  numNonCCEnqLast9Days :'NA',
  acctOpenedLast12Months_NonCC :'NA',
  numCCEnqLast18Days :'NA',
  totalCountwrittenOff_Settled :'NA',
  numNonCCEnqLast3Days :'NA',
  writtenOffSettledWithin24Months_NonCC :'NA',
  totalNonCCOverdueAmt :'NA',
  maxDPD24Months_NonCC :'NA',
  noOfAcctOpenedinL12MonthsAndCurrActive_NonCC :'NA',
  BlcOfwrittenOff_Settled :'NA',
  totalNumEnqLast18Days :'NA',
  numCCEnqLast3Days :'NA',
  numCCEnqLast36Days :'NA',
  numCCEnqLast9Days :'NA',
  totalCountOf3PlusLast24m :'NA',
  totalNumEnqLast7Days :'NA',
  totalCibilScore :'NA',
  numNonCCEnqLast36Days :'NA',
  noOfClosedNonCCAcct :'NA',
  totalCCOutstanding :'NA',
  avgCurrUtilisationLiveAcct_NonCC :'NA',
  totalCCOverdueAmt :'NA',
  totalNumEnqLast36Days :'NA',
  numCCEnqLast7Days :'NA',
  sumOf3PlusCCAcctLast24m :'NA',
  noOfClosedCCAcct :'NA',
  acctOpenedLast12Months_CC :'NA',
  totalOverdueAmt :'NA',
  totalAvgCurrUtilisationLiveAcct :'NA',
  totalNonCCOutstanding :'NA',
  writtenOffSettledWithin24Months_CC :'NA',
  countOfwrittenOff_SettledCC :'NA',
  totalSumOf30PlusLast24m:'NA',
  sumOf30PlusCCAcctLast24m:'NA',
  sumOf30PlusNonCCAcctLast24m:'NA',
  totalCountOf30PlusLast24m:'NA',
  countOf30PlusCCAcctLast24m:'NA',
  countOf30PlusNonCCAcctLast24m:'NA',
  totalNumEnqLast360Days:'NA',
  numCCEnqLast360Days:'NA',
  numNonCCEnqLast360Days:'NA',
  numNonCCEnqLast180Days:'NA',
  totalNumEnqLast90Days:'NA',
  numNonCCEnqLast90Days:'NA',
  totalNumEnqLast30Days:'NA',
  numCCEnqLast30Days:'NA',
  numNonCCEnqLast30Days:'NA',
  noOfEnqInL6m:'NA',
maxDPD24Months_NonCCColor:'NA',
totalCibilScoreColor:'NA',
writtenOffSettledWithin24Months_CCColor:'NA',
writtenOffSettledBeyond24Months_CCColor:'NA',
totalNumEnqLast12MonthsColor:'NA',
currUtilisationLiveAcct_CCColor:'NA',
acctOpenedLast12Months_CCColor:'NA',
maxDPD24Months_CCColor:'NA',
acctOpenedLast12Months_NonCCColor:'NA',
writtenOffSettledWithin24Months_NonCCColor:'NA',
avgCurrUtilisationLiveAcct_NonCCColor:'NA',
writtenOffSettledBeyond24Months_NonCCColor:'NA',
totalCCOverdueAmtColor:'NA',
totalAvgCurrUtilisationLiveAcctColor:'NA',
totalMaxDelinquencyInlifeColor:'NA',
maxDPDBeyond24Months_NonCCColor:'NA',
noOfAcctOpenedinL12MonthsAndCurrActive_NonCCColor:'NA',
noOfEnqInL6mColor:'NA',
totalCCOverdueAmtSummary:'NA',
totalNonCCOverdueAmtColor:'NA'
};
export interface coApplicantUser
{
  name: string, 
  entityId: number
}