import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToNumberPipe } from 'src/app/pipes/to-number.pipe';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ViewService } from 'src/app/services/view.service';

@Component({
  selector: 'app-cred-gpt-page',
  templateUrl: './cred-gpt-page.component.html',
  styleUrls: ['./cred-gpt-page.component.scss'],
  providers: [ToNumberPipe],
})
export class CredGptPageComponent implements OnInit {

  Object = Object;
  pageName = "credGPTpage";
  lan: String = "";
  applicants: any[] = [];
  applicantsBasicDetails: any[] = [];
  users: any = [];
  incomeusers: any = [];
  loader = false;
  natureOfBusinessDropDown = ""
  STP_Status = ""
  PD_Type = ""
  xData = 0
  fsaFinancialResult: any = {}
  FSA: any = {};
  FSADetails: any = {
    profitAndLoss: {},
    BalanceSheet: {
      Liabilities: {},
      Assets: {},
    },
    blFields: {},
    RatioAnalysis: {},
    year: []
  };
  applicantIncome: any = {};
  applicantIncomeEditable: any = {};
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
  monthlyObligationSummery = false;
  totalObligation: any = {
    totalMonthlyObligation: 0,
    totalMonthlyObligationBankingSurrogate: 0,
    totalAnnualObligation: 0,
    totalUnsecureExposure: 0,
    totalSecureExposure: 0,
  };
  monthlyObligationDetails: any = {
    monthlyObligation: [],
    totalunsecuredObligation: 0,
    totalsecuredObligation: 0,
    totalMonthlyObligationSurrogateMethod: 0,
  };
  monthlyObligations;

  ConsumerBureauAnalyticsResult: any = [];
  coApplicantUserList: Array<coApplicantUser> = [];
  ConsumerBureauAnalyticsView: boolean = false;
  ConsumerBureauAnalytics: consumerBureauAnalyticsRes = ConsumerBureauAnalyticsVariable;

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
  selectedBanks: any[] = [];
  selectedMonthlyObligationLoanType: string[] = [];
  selectedMonthlyObligationLoanDescription: string[] = [];
  selectedMonthlyObligationLoanTypeList: any[] = [];
  selectedRepaymentBanks: any[] = [];
  bankNames: string[] = [
    'STATE BANK OF INDIA', 'BANK OF BARODA', 'STATE BANK OF TRAVANCORE', 'ICICI Bank'
    , 'IDBI Bank', 'INDIAN Bank', 'INDIAN OVERSEASE Bank'
  ];

  constructor(private route: Router, private viewService: ViewService, private dashboardService: DashboardService,
    private toNumber: ToNumberPipe,
    private currencyPipe: CurrencyPipe) { }

  ngOnInit(): void {
    let userdetails: any = JSON.parse(localStorage.getItem("userDetails") || '{}');
    if (Object.keys(userdetails).length === 0) {
      this.route.navigate(['/'])
    }
    this.lan = userdetails.lan;

    this.xData = window.innerWidth / 2;

    this.loader = true;
    this.getApplicants(this.lan);
  }

  @ViewChild("applicantsConsumerBureauAnalytics") applicantsConsumerBureauAnalytics: any;
  @ViewChild("applicantsElmFSA") applicantsElmFSA: any;
  @ViewChild("applicantsElmIncome") applicantsElmIncome: any;
  @ViewChild("CredPGTPage") CredPGTPage: any;
  @ViewChild("BankingHealth") BankingHealth: any;
  @ViewChild("FinancialHealth") FinancialHealth: any;
  @ViewChild("BureauHealth") BureauHealth: any;
  @ViewChild("applicantsElmBSABankHealth") applicantsElmBSABankHealth!: any;
  @ViewChild("applicantsElmBSABankHealthacc") applicantsElmBSABankHealthacc!: any;

  getApplicants(lan) {
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
      for (let i = 0; i < this.applicants.length; i++) {

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

      this.triggerScorecard();
      this.getBasicDetails(this.lan);
      this.getMonthlyObligation();
      this.getFSADetails();
      this.getIncomeDetail(this.lan);
      this.setCoApplicationDetails();
      this.loader = false;
    });
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
      for (let i = 0; i < this.applicants.length; i++) {
        for (let j = 0; j < this.applicantsBasicDetails.length; j++) {
          if (
            this.applicants[i].custcif == this.applicantsBasicDetails[j].custcif
          ) {
            this.applicants[i].totalworkexp =
              this.applicantsBasicDetails[j].totalworkexp || "";
            this.applicants[i].custsector =
              this.applicantsBasicDetails[j].custsector || "";
            this.applicants[i].custemptype =
              this.applicantsBasicDetails[j].custemptype || "";
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
                  this.PD_Type = data.data[j].pdType || "";
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

      // setTimeout(() => {
      //   this.applicantsElmFSA.nativeElement
      //     .querySelectorAll(".btn:first-child")
      //     .forEach((applicant) => {
      //       applicant.click();
      //     });
      // }, 0);
    });
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

            if (data[i].AplicantDataUpdated.BSADetails.isLogicUpdated) {

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
      // setTimeout(() => {
      //   this.applicantsElmIncome.nativeElement
      //     .querySelectorAll("button:first-child")
      //     .forEach((applicant) => {
      //       applicant.click();
      //     });
      // }, 0);
      this.setIncomeUser(this.users[0].applicantShortName);
      this.calculateBTOfor6months()
      this.calculateBTOfor12months()
    });
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

  removeCurrency(value): number {
    value = String(value)
    return Number(value.replace(/[^0-9.-]+/g, ""));
  }

  removeCurrencyStr(value): string {
    value = String(value)
    return value.replace(/[^0-9.-]+/g, "");
  }

  addCurrency(value) {
    value = String(value)
    return this.currencyPipe.transform(value, "USD", "")!
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

  scrollToSection(elm) {
    if (elm != "") {
      let el: any = document.getElementById(elm);
      let headerOffset = 180;

      let elementPosition = el.getBoundingClientRect().top;
      let offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setTimeout(() => {
        if (elm === "BankingHealth") {
          // for banking health

          this.BankingHealth.nativeElement
            .querySelectorAll(".accordion-button")
            .forEach((expand) => {
              if (expand.classList.contains("collapsed")) {
                expand.click();
              }
            });
        } else if (elm === "FinancialHealth") {
          // this.getFSAAnalyticDetails()

          this.FinancialHealth.nativeElement
            .querySelectorAll(".accordion-button")
            .forEach((expand) => {
              if (expand.classList.contains("collapsed")) {
                expand.click();
              }
            });
        } else if (elm === "BureauHealth") {
          // this.getConsumerBureauAnalyticsDetails()

          this.BureauHealth.nativeElement
            .querySelectorAll(".accordion-button")
            .forEach((expand) => {
              if (expand.classList.contains("collapsed")) {
                expand.click();
              }
            });
        }
      }, 0);
    }
  }

  scrollToTop() {

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  getFinancialRatioColor(value: any) {

    let val = Number(value)
    if (val <= 33) {
      return "#8E191C" // Red color
    } else if (val > 33 && val < 70) {
      return "#FFDE17" // Yellow color
    } else if (val >= 70) {
      return "#83C775" // Green color
    } else {
      return ""
    }
  }

  getConsumerBureauAnalyticsDetails() {
    this.loader = true

    if (this.ConsumerBureauAnalyticsResult.length > 0) {
      this.ConsumerBureauAnalytics = this.ConsumerBureauAnalyticsResult[0].consumerBureauAnalytics;
      setTimeout(() => {
        this.applicantsConsumerBureauAnalytics.nativeElement
          .querySelectorAll(".btn:first-child")
          .forEach((applicant) => {
            applicant.click();
          });
      }, 0);

      this.ConsumerBureauAnalyticsView = true;
      console.log('this.ConsumerBureauAnalytics' + this.ConsumerBureauAnalytics)
      console.log('this.ConsumerBureauAnalyticsResult' + this.ConsumerBureauAnalyticsResult)
      this.loader = false;
    } else {
      let userDetails = this.getApplicantDetailsForEquility();
      let body = {
        lan: this.lan,
        ...userDetails
      }
      console.log("Consumer Bureau analysis", body)
      this.dashboardService.getConsumerBureauAnalyticsDetails(body).subscribe({
        next: (res) => {
          console.log(res)

          if (res.status) {
            if (res.data) {
              this.ConsumerBureauAnalyticsResult = res.data.output
              if (this.ConsumerBureauAnalyticsResult.length > 0) {
                this.ConsumerBureauAnalytics = this.ConsumerBureauAnalyticsResult[0].consumerBureauAnalytics;
              }
              this.ConsumerBureauAnalyticsView = true;
              console.log('this.ConsumerBureauAnalytics' + this.ConsumerBureauAnalytics)
              console.log('this.ConsumerBureauAnalyticsResult' + this.ConsumerBureauAnalyticsResult)
            } else {
              this.ConsumerBureauAnalyticsResult = [];
              this.ConsumerBureauAnalyticsView = true;
              this.ConsumerBureauAnalytics = ConsumerBureauAnalyticsVariable;
            }
          } else {
            this.ConsumerBureauAnalyticsResult = [];
            this.ConsumerBureauAnalyticsView = true;
            this.ConsumerBureauAnalytics = ConsumerBureauAnalyticsVariable;
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
          this.ConsumerBureauAnalyticsView = true;
          this.ConsumerBureauAnalytics = ConsumerBureauAnalyticsVariable;
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

  getCoApplicantWiseConsumerBureauAnalyticsDetails(event, customer) {
    this.loader = true

    if (this.ConsumerBureauAnalyticsResult.length > 0) {
      for (let i = 0; i < this.ConsumerBureauAnalyticsResult.length; i++) {
        if (customer.entityId == this.ConsumerBureauAnalyticsResult[i].entityId) {
          this.ConsumerBureauAnalytics = this.ConsumerBureauAnalyticsResult[i].consumerBureauAnalytics;
        }
      }
      console.log('this.ConsumerBureauAnalytics' + this.ConsumerBureauAnalytics)
      console.log('this.ConsumerBureauAnalyticsResult' + this.ConsumerBureauAnalyticsResult)
      this.ConsumerBureauAnalyticsView = true;
      this.loader = false
    } else {
      this.ConsumerBureauAnalytics = ConsumerBureauAnalyticsVariable;
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

  getColorForConsumerBureauAnalytics(color) {
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

  setCoApplicationDetails() {
    for (let i = 0; i < this.applicants.length; i++) {
      if (this.applicants[i].applicant_type == "co-app") {
        let user: coApplicantUser = {
          name: "",
          entityId: 0
        };
        user.name = this.applicants[i].custshrtname;
        user.entityId = this.applicants[i].custcif;
        this.coApplicantUserList.push(user);
      }
    }
    console.log('this.coApplicantUserList: ' + this.coApplicantUserList);
  }

  getFSAAnalyticDetails() {

    console.log(this.FSADetails)
    if (this.FSADetails.year.length !== 0) {
      this.loader = true
      let userDetails = this.getApplicantDetailsForEquility();
      let body = {
        revenue: this.FSADetails.profitAndLoss.totalSale[0] / 100000000,
        grossProfitMargin: this.FSADetails.blFields.Gross_Profit_Annualized_Turnover_Annualized[0] === "Infinity" || this.FSADetails.blFields.Gross_Profit_Annualized_Turnover_Annualized[0] === "NaN" ? "0" : this.FSADetails.blFields.Gross_Profit_Annualized_Turnover_Annualized[0],
        eBITDAMargin: (this.FSADetails.profitAndLoss.operatingProfit[0] / this.FSADetails.profitAndLoss.totalSale[0]) * 100,
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

      console.log("fsa analysis", body)
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
    } else {
      alert("No FSA Data found")
    }

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

  getCibilScoreColor(value: string) {

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

  triggerScorecard() {
    let userDetails = this.getApplicantDetailsForEquility();
    let remainingFields = this.getRemainingFieldsForEquility();
    let temp = {
      ...userDetails,
      ...remainingFields,
    };
    this.dashboardService.triggerScorecard(temp).subscribe((data) => {
      if (data.data) {
        // this.CRIFScore = data.data.CRIFScore || "0";
        // this.CRIFSegment = data.data.CRIFRiskSegment || "--";
        // this.judgementalScore = data.data.Score;
        // this.judgementalSegment = data.data.RiskSegment;

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

  getRemainingFieldsForEquility() {
    return {
      remainingFields: {
        lan: this.lan,
        noOfEmi: "36",
        mainNatureOfBussiness: this.natureOfBusinessDropDown,

        minimumTotalNoofBusinessCreditsfor12m: this.applicantIncomeDetailsEditable.BSADetails["MinimumcreditCountP.M.normfor12Months"],
        minimumTotalAmountofBusinessCreditsfor12m: this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails["MinimumCreditAmountP.M.Normfor12months"]),
        minimumTotalNoofBusinessCreditsfor6m: this.applicantIncomeDetailsEditable.BSADetails["MinimumcreditCountP.M.normfor6Months"],
        minimumTotalAmountofBusinessCreditsfor6m: this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails["MinimumCreditAmountP.M.Normfor6months"]),
        sumofBusinessCreditfor6months: this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails
          .SumofBusinessCreditfor6months),
        monthlyAverageBankBalancefor6months: this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails
          .MonthlyAverageBankBalancefor6months),
        minimumAbbfor6m: this.removeCurrencyStr(this.applicantIncomeDetailsEditable.BSADetails
          .MinimumABBfor6months)
        // roi: this.FICOInput[0].roi || "",
        // baseRate: this.FICOInput[0].brrate || "",
        // tenor: this.FICOInput[0].tenor || "",
        // loanAmount: this.FICOInput[0].finassetvalue || "",
      },
    };
  }

  expandAll(event) {
    if (event.target.textContent == "+") {
      this.CredPGTPage.nativeElement
        .querySelectorAll(".accordion-button")
        .forEach((expand) => {
          if (expand.classList.contains("collapsed")) {
            event.target.textContent = "-";
            expand.click();
          }
        });
    } else {
      this.CredPGTPage.nativeElement
        .querySelectorAll(".accordion-button")
        .forEach((expand) => {
          if (!expand.classList.contains("collapsed")) {
            event.target.textContent = "+";
            expand.click();
          }
        });
    }
  }

  getBsaBankHealthColor(color: string = "") {
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

            if (this.bsaBankingHealth.length === 0) {
              this.bsaBankingHealthDetail = {
                concentrationRisk: {},
                ABB: {},
                PBB: {},
                accountNum: 0,
                transactionAnalytics: {}
              }
            }

            if (this.bsaBankingHealth.length !== 0) {
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
      error: () => { }
    })
  }

  switchUserData(event, user, module) {
    if (module == "bsaBankHealth") {
      if (user === 4) {
        this.bsaBankingHealth.map((data: any) => {
          if (data.accountNum === 4) {
            this.bsaBankingHealthDetail = data
          }
        })
      } else {
        this.bsaBankingHealthDetail = this.bsaBankingHealth[user - 1]
      }
      console.log("bsa acc", this.bsaBankingHealthDetail)
      this.applicantsElmBSABankHealthacc.nativeElement
        .querySelectorAll(".btn.btn-primary")
        .forEach((applicant) => {
          applicant.classList.remove("btn-primary");
          applicant.classList.add("btn-light");
        });

      event.currentTarget.classList.add("btn-primary");

    }
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
                const decimal_pos = this.monthlyObligationDetails.monthlyObligation[i].loanDate.indexOf(' ');
                if (decimal_pos != -1) {
                  let loanDate = this.monthlyObligationDetails.monthlyObligation[i].loanDate.substring(0, decimal_pos);
                  this.monthlyObligationDetails.monthlyObligation[i].loanDate = loanDate;
                }
                this.selectedBanks.push(this.bankNames);
                this.selectedRepaymentBanks.push(this.bankNames);
                this.selectedMonthlyObligationLoanTypeList.push(this.selectedMonthlyObligationLoanType);
                this.monthlyObligationDetails.monthlyObligation[i].ConsideredforBankingFlag = false;
                this.monthlyObligationDetails.monthlyObligation[i].ConsideredforObligationFlag = false;
                this.monthlyObligationDetails.monthlyObligation[i].SecurityTypeFlag = false;
                this.monthlyObligationDetails.monthlyObligation[i].bankNameFlag = false;
                this.monthlyObligationDetails.monthlyObligation[i].installmentAmoutFlag = false;
                this.monthlyObligationDetails.monthlyObligation[i].loanDateFlag = false;
                this.monthlyObligationDetails.monthlyObligation[i].loanTypeFlag = false;
                this.monthlyObligationDetails.monthlyObligation[i].originalAmountFlag = false;
                this.monthlyObligationDetails.monthlyObligation[i].outstandingBalanceFlag = false;
                this.monthlyObligationDetails.monthlyObligation[i].disableSecurityType = false;
                this.monthlyObligationDetails.monthlyObligation[i].disableConsideredForBanking = false;
                this.monthlyObligationDetails.monthlyObligation[i].disableConsideredForObligation = false;
                this.monthlyObligationDetails.monthlyObligation[i].disableTenure = false;
              }
            }
            this.updateMonthlyObligation()
            this.updateMonthlyObligationSurrogateMethod()
            this.updateConsiderForObligationMethod()
            this.updateTotalMonthlyObligationAllUser();
          })
        }
      });
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
  totalSumOf30PlusLast24m: string;
  sumOf30PlusCCAcctLast24m: string;
  sumOf30PlusNonCCAcctLast24m: string;
  totalCountOf30PlusLast24m: string;
  countOf30PlusCCAcctLast24m: string;
  countOf30PlusNonCCAcctLast24m: string;
  totalNumEnqLast360Days: string;
  numCCEnqLast360Days: string;
  numNonCCEnqLast360Days: string;
  totalNumEnqLast180Days: string;
  numCCEnqLast180Days: string;
  numNonCCEnqLast180Days: string;
  totalNumEnqLast90Days: string;
  numCCEnqLast90Days: string;
  numNonCCEnqLast90Days: string;
  totalNumEnqLast30Days: string;
  numCCEnqLast30Days: string;
  numNonCCEnqLast30Days: string;
  avgCurrUtilisationLiveAcct_CC: string;
  maxDPDBeyond24Months_NonCC: string;
  noOfEnqInL6m: string;
  maxDPD24Months_NonCCColor: string;
  totalCibilScoreColor: string;
  writtenOffSettledWithin24Months_CCColor: string;
  writtenOffSettledBeyond24Months_CCColor: string;
  totalNumEnqLast12MonthsColor: string;
  currUtilisationLiveAcct_CCColor: string;
  acctOpenedLast12Months_CCColor: string;
  maxDPD24Months_CCColor: string;
  acctOpenedLast12Months_NonCCColor: string;
  writtenOffSettledWithin24Months_NonCCColor: string;
  avgCurrUtilisationLiveAcct_NonCCColor: string;
  writtenOffSettledBeyond24Months_NonCCColor: string;
  totalCCOverdueAmtColor: string;
  totalAvgCurrUtilisationLiveAcctColor: string;
  totalMaxDelinquencyInlifeColor: string;
  maxDPDBeyond24Months_NonCCColor: string;
  noOfAcctOpenedinL12MonthsAndCurrActive_NonCCColor: string;
  noOfEnqInL6mColor: string;
  totalCCOverdueAmtSummary: string;
  totalNonCCOverdueAmtColor: string;
}

let ConsumerBureauAnalyticsVariable: consumerBureauAnalyticsRes = {
  avgCurrUtilisationLiveAcct_CC: 'NA',
  maxDPDBeyond24Months_NonCC: 'NA',
  numCCEnqLast90Days: 'NA',
  numCCEnqLast180Days: 'NA',
  totalNumEnqLast180Days: 'NA',
  totalNoOfActiveAcct: 'NA',
  numNonCCEnqLast18Days: 'NA',
  totalOutstanding: 'NA',
  totalNumEnqLast12Months: 'NA',
  noOfActiveNonCCAcct: 'NA',
  currUtilisationLiveAcct_CC: 'NA',
  countOf3PlusCCAcctLast24m: 'NA',
  blcOfwrittenOff_SettledCC: 'NA',
  totalNumEnqLast3Days: 'NA',
  writtenOffSettledBeyond24Months_NonCC: 'NA',
  writtenOffSettledBeyond24Months_CC: 'NA',
  countOfwrittenOff_SettledNonCC: 'NA',
  totalNoOfClosedAcct: 'NA',
  numNonCCEnqLast7Days: 'NA',
  maxDPD24Months_CC: 'NA',
  noOfActiveCCAcct: 'NA',
  countOf3PlusNonCCAcctLast24m: 'NA',
  totalMaxDelinquencyInlife: 'NA',
  blcOfwrittenOff_SettledNonCC: 'NA',
  totalNumEnqLast9Days: 'NA',
  numNonCCEnqLast9Days: 'NA',
  acctOpenedLast12Months_NonCC: 'NA',
  numCCEnqLast18Days: 'NA',
  totalCountwrittenOff_Settled: 'NA',
  numNonCCEnqLast3Days: 'NA',
  writtenOffSettledWithin24Months_NonCC: 'NA',
  totalNonCCOverdueAmt: 'NA',
  maxDPD24Months_NonCC: 'NA',
  noOfAcctOpenedinL12MonthsAndCurrActive_NonCC: 'NA',
  BlcOfwrittenOff_Settled: 'NA',
  totalNumEnqLast18Days: 'NA',
  numCCEnqLast3Days: 'NA',
  numCCEnqLast36Days: 'NA',
  numCCEnqLast9Days: 'NA',
  totalCountOf3PlusLast24m: 'NA',
  totalNumEnqLast7Days: 'NA',
  totalCibilScore: 'NA',
  numNonCCEnqLast36Days: 'NA',
  noOfClosedNonCCAcct: 'NA',
  totalCCOutstanding: 'NA',
  avgCurrUtilisationLiveAcct_NonCC: 'NA',
  totalCCOverdueAmt: 'NA',
  totalNumEnqLast36Days: 'NA',
  numCCEnqLast7Days: 'NA',
  sumOf3PlusCCAcctLast24m: 'NA',
  noOfClosedCCAcct: 'NA',
  acctOpenedLast12Months_CC: 'NA',
  totalOverdueAmt: 'NA',
  totalAvgCurrUtilisationLiveAcct: 'NA',
  totalNonCCOutstanding: 'NA',
  writtenOffSettledWithin24Months_CC: 'NA',
  countOfwrittenOff_SettledCC: 'NA',
  totalSumOf30PlusLast24m: 'NA',
  sumOf30PlusCCAcctLast24m: 'NA',
  sumOf30PlusNonCCAcctLast24m: 'NA',
  totalCountOf30PlusLast24m: 'NA',
  countOf30PlusCCAcctLast24m: 'NA',
  countOf30PlusNonCCAcctLast24m: 'NA',
  totalNumEnqLast360Days: 'NA',
  numCCEnqLast360Days: 'NA',
  numNonCCEnqLast360Days: 'NA',
  numNonCCEnqLast180Days: 'NA',
  totalNumEnqLast90Days: 'NA',
  numNonCCEnqLast90Days: 'NA',
  totalNumEnqLast30Days: 'NA',
  numCCEnqLast30Days: 'NA',
  numNonCCEnqLast30Days: 'NA',
  noOfEnqInL6m: 'NA',
  maxDPD24Months_NonCCColor: 'NA',
  totalCibilScoreColor: 'NA',
  writtenOffSettledWithin24Months_CCColor: 'NA',
  writtenOffSettledBeyond24Months_CCColor: 'NA',
  totalNumEnqLast12MonthsColor: 'NA',
  currUtilisationLiveAcct_CCColor: 'NA',
  acctOpenedLast12Months_CCColor: 'NA',
  maxDPD24Months_CCColor: 'NA',
  acctOpenedLast12Months_NonCCColor: 'NA',
  writtenOffSettledWithin24Months_NonCCColor: 'NA',
  avgCurrUtilisationLiveAcct_NonCCColor: 'NA',
  writtenOffSettledBeyond24Months_NonCCColor: 'NA',
  totalCCOverdueAmtColor: 'NA',
  totalAvgCurrUtilisationLiveAcctColor: 'NA',
  totalMaxDelinquencyInlifeColor: 'NA',
  maxDPDBeyond24Months_NonCCColor: 'NA',
  noOfAcctOpenedinL12MonthsAndCurrActive_NonCCColor: 'NA',
  noOfEnqInL6mColor: 'NA',
  totalCCOverdueAmtSummary: 'NA',
  totalNonCCOverdueAmtColor: 'NA'
};
export interface coApplicantUser {
  name: string,
  entityId: number
}
