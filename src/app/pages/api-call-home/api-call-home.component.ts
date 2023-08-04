import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-api-call-home',
  templateUrl: './api-call-home.component.html',
  styleUrls: ['./api-call-home.component.scss']
})
export class ApiCallHomeComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;
  config: any;
  fileField: any = [{ fileId: 0, file: [] }];
  year = new Date().getFullYear();
  fileName: any = ['txt', 'txt1'];
  selectedFile?: FileList;
  selectedFileName: any[] = [];
  selectedFiles?: FileList;
  selectedFileNames: any = [];
  messages: any = [];
  progressInfo: any = [];
  preview: any = [];
  finalTriggerData: any = [];
  tabs: any = [];
  constructor(private datepipe: DatePipe, private fb: FormBuilder) {
    this.config = {
      applicant: [],
      finYear: '',
      checkBoxValue: false,
      index: 0,
      triggersArray: [],
      applicantResponse: [],
      triggerList: [],
      servicesList: [],
      financialYear: [],
      formFields: null,
      fileStatus: false
    }
  }

  ngOnInit(): void {
    this.intializeData();
    this.initForm();
    this.getFinancialYear();
  }

  getFinancialYear() {
    for (let i = this.year; i >= 1980; i--) {
      this.config.financialYear.push({
        year: i
      });
    }
  }

  initForm() {
    this.config.formFields = this.fb.group({
      loanAmount: ['', Validators.required],
      loanType: ['', Validators.required],
      loanDuration: ['', Validators.required],
      financialYear: [''],
      scannedStatement: ['', Validators.required]
    })
  }

  intializeData() {
    this.config.applicantResponse =
    {
      "status": true,
      "data": {
        "HFC": {
          "applicant": [

          ]
        },
        "NBFC": {
          "applicant": [
            {
              "fincategory": "LAP",
              "finamount": "2500000000",
              "fintype": "LP",
              "source": "NBFC",
              "custsegment": "SEG1",
              "custctgcode": "RETAIL",
              "custfname": "First Name115 Middle Name115 Last Name115",
              "finbranch": "3401",
              "custshrtname": "Shrt Name115",
              "user_id": "GFL3401LP0000048First Name115Last Name115",
              "applicant_type": "mainapp",
              "custdob": "1968-08-25 05:30:00.0",
              "finreference": "GFL3401LP0000048"
            },
            {
              "fincategory": "LAP",
              "finamount": "2500000000",
              "fintype": "LP",
              "source": "NBFC",
              "custsegment": "Shrt Name117",
              "custctgcode": "RETAIL",
              "custfname": "First Name117 Middle Name117 Last Name117",
              "finbranch": "3401",
              "custshrtname": "SEG2",
              "user_id": "GFL3401LP0000048First Name117Last Name117",
              "applicant_type": "co-app",
              "custdob": "1969-06-12 05:30:00.0",
              "finreference": "GFL3401LP0000048"
            }
          ]
        }
      },
      "message": "Lan details retrieved",
      "statusCode": "Dashboard-200",
      "traceId": "e888d9ff-3c0e-4ca4-aa2f-4157f96a3df0"
    }
    let HFC = this.config.applicantResponse.data.HFC.applicant;
    let NBFC = this.config.applicantResponse.data.NBFC.applicant;
    if (NBFC.length > 0) {
      NBFC.forEach((element: any) => {
        this.config.applicant.push({
          fields: [
            { label: 'Name', value: element.custshrtname },
            { label: 'Category', value: element.fincategory },
            { label: 'Segment', value: element.fintype },
            { label: 'Loan Amount', value: element.finamount },
            { label: 'Product', value: element.custsegment }
          ]
        }
        )
      });
    }

    if (HFC.length > 0) {
      HFC.forEach((element: any) => {
        this.config.applicant.push({
          fields: [
            { label: 'Name', value: element.custshrtname },
            { label: 'Category', value: element.fincategory },
            { label: 'Segment', value: '' },
            { label: 'Loan Amount', value: element.finamount },
            { label: 'Product', value: '' },
          ]
        }
        )
      });
    }
    this.config.triggersArray = {
      "status": true,
      "data": {
        "user_id": "GHF1001FG23Hlakasma",
        "lan": "GHF1001FG23Hl",
        "services": [
          {
            "service_type": "income",
            "triggeredTimestamp": "2022-10-20T13:29:40.899045",
            "service": "GST",
            "name": "akash",
            "approx_time_pending": 0.0,
            "applicant_type": "mainapp",
            "status": "Ready",
            "triggeredBy": "akash",
          },
          {
            "service_type": "income",
            "triggeredTimestamp": "2022-10-20T17:36:11.320657",
            "service": "ITR",
            "name": "akash",
            "approx_time_pending": 2700.0,
            "applicant_type": "mainapp",
            "status": "PENDING",
            "triggeredBy": "Hemant"
          }
        ]
      },
      "message": "triggered services retrived",
      "statusCode": "Dashboard-200",
      "traceId": "edc04146-9418-4f42-9a6d-2ee605eac325"
    }

    this.config.servicesList = {
      "status": true,
      "data": [
        {
          "values": [
            {
              "service_type": "Kyc",
              "name": "Pan Card",
              "id": 1.0
            },
            {
              "service_type": "Kyc",
              "name": "Aadhar Card",
              "id": 2.0
            },
            {
              "service_type": "Kyc",
              "name": "Passport",
              "id": 3.0
            },
            {
              "service_type": "Kyc",
              "name": "Drivers License",
              "id": 4.0
            },
            {
              "service_type": "Kyc",
              "name": "Voter ID",
              "id": 5.0
            },
            {
              "service_type": "Kyc",
              "name": "Pan Aadhar",
              "id": 22.0
            }
          ],
          "key": "Kyc"
        },
        {
          "values": [
            {
              "service_type": "industryCheck",
              "name": "FDA",
              "id": 6.0
            },
            {
              "service_type": "industryCheck",
              "name": "FSSAI",
              "id": 7.0
            },
            {
              "service_type": "industryCheck",
              "name": "HSN",
              "id": 8.0
            },
            {
              "service_type": "industryCheck",
              "name": "SHOP&Establishment Check",
              "id": 9.0
            }
          ],
          "key": "industryCheck"
        },
        {
          "values": [
            {
              "service_type": "professionalCheck",
              "name": "CA",
              "id": 10.0
            },
            {
              "service_type": "professionalCheck",
              "name": "ICSI",
              "id": 11.0
            },
            {
              "service_type": "professionalCheck",
              "name": "ICWAI",
              "id": 12.0
            },
            {
              "service_type": "professionalCheck",
              "name": "MCI",
              "id": 13.0
            },
            {
              "service_type": "professionalCheck",
              "name": "UDIN",
              "id": 14.0
            }
          ],
          "key": "professionalCheck"
        },
        {
          "values": [
            {
              "service_type": "others",
              "name": "Employment Fetch",
              "id": 15.0
            }
          ],
          "key": "others"
        },
        {
          "values": [
            {
              "service_type": "social",
              "name": "Google Check",
              "id": 16.0
            }
          ],
          "key": "social"
        },
        {
          "values": [
            {
              "service_type": "income",
              "name": "FSA",
              "id": 17.0
            },
            {
              "service_type": "income",
              "name": "GST",
              "id": 18.0
            },
            {
              "service_type": "income",
              "name": "BSA",
              "id": 19.0
            },
            {
              "service_type": "income",
              "name": "ITR",
              "id": 21.0
            }
          ],
          "key": "income"
        },
        {
          "values": [
            {
              "service_type": "Bueau",
              "name": "CIBIL",
              "id": 20.0
            }
          ],
          "key": "beuar"
        }
      ],
      "message": "All Services",
      "statusCode": "Dashboard-200",
      "traceId": "43b94b3c-d6ef-4402-976d-14d121a724b6"
    }

    this.setTriggerData(this.config.triggersArray);

  }

  setTriggerData(resp: any) {
    let originalServiceList: any = [];
    let checkStatus: any = [];
    let triggerArr = resp.data;
    for (let serviceData of this.config.servicesList.data) {
      for (let data of serviceData.values) {
        triggerArr.services.forEach((element: any) => {
          if (element.service_type == data.service_type) {
            checkStatus.push({
              checked: data.service_type
            })
            if (element.service == data.name) {
              originalServiceList.push(
                {
                  service_type: element.service_type,
                  service: element.service,
                  status: element.status,
                  date: this.datepipe.transform(element.triggeredTimestamp),
                  disable: false,
                },
              )
            }
          }
          else {
            var status;
            if (originalServiceList.length > 0) {
              originalServiceList.filter((obj: any) => {
                if (obj.service != data.name) {
                  status = false;
                }
                else {
                  status = true;
                }
              });
              if (status == false) {
                originalServiceList.push(
                  {
                    service_type: data.service_type,
                    service: data.name,
                    status: '',
                    date: '',
                    disable: true,
                  }
                )
              }
            }
            else {
              originalServiceList.push(
                {
                  service_type: data.service_type,
                  service: data.name,
                  status: '',
                  date: '',
                  disable: true,
                }
              )
            }
          }
        })
      }
      this.finalTriggerData.push({
        "key": serviceData.key,
        "values": originalServiceList,
        "checkStatus": checkStatus
      })
      originalServiceList = [];
    }
  }

  activeCard(i: any) {
    this.config.index = i
  }

  checkboxEvent(selectedData: any, event: any) {
    this.tabs.push(selectedData);
  }

  addFileField(event: any) {
    let id;
    if (event == -1) {
      id = 0;
    }
    else {
      id = event + 1;
    }
    this.fileField.push({ fileId: id, file: [] });
  }

  deleteFile(index: any) {
    this.selectedFileName.splice(index, 1);
  }

  selectFile(event: any): void {
    if (this.config.finYear != '') {
      this.messages = [];
      this.progressInfo = [];
      // this.selectedFileName = [];
      this.selectedFile = event.target.files;
      this.preview = [];
      if (this.selectedFile && this.selectedFile[0]) {
        const numberOfFiles = this.selectedFile.length;
        for (let i = 0; i < numberOfFiles; i++) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            console.log(e.target.result);
            this.preview.push(e.target.result);
          };
          reader.readAsDataURL(this.selectedFile[i]);
          this.selectedFileName.push(
            {
              file: this.selectedFile[i],
              finYear: this.config.finYear
            },
          );
          this.config.finYear = '';
        }
      }
    }
  }

  allowNumbers(event: any) {
    let e;
    e = event.charCode;
    return (
      e === 8 ||
      (e >= 48 && e <= 57)
    )
  }

  allowCharacters(event: any) {
    let e;
    e = event.charCode;
    return (
      e === 8 || e === 32 ||
      (e >= 97 && e <= 122) ||
      (e >= 65 && e <= 90)
    )
  }
}


