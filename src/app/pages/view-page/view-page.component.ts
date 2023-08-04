import {
  Component,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ViewService } from '../../services/view.service';
import { Validators,FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { apiDetails } from 'src/app/utils/apiData'; 
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent implements OnInit {
  
  apiDetails=apiDetails;
  submitButton:boolean = false;
  pan_card_form: FormGroup;
  aadhar_xml_form: FormGroup;
  passport_form: FormGroup;
  driving_lincence_form: FormGroup;
  voterid_form: FormGroup;
  pan_aadhar_form: FormGroup;
  fda_form: FormGroup;
  fssai_form: FormGroup;
  hsn_form: FormGroup;
  shop_establishment_form: FormGroup;
  // ca_form: FormGroup;
  // icsi_form: FormGroup;
  // icwai_form: FormGroup;
  // mci_form: FormGroup;
  employment_form: FormGroup;
  google_form: FormGroup;
  fsa_form: FormGroup;
  gst_form: FormGroup;
  bsa_form: FormGroup;
  itr_form: FormGroup;
  pan_profile_form:FormGroup;
  // udin_form:FormGroup;
  gst_credlink_form: FormGroup;
  bsa_online_form: FormGroup;
  itr_online_form: FormGroup;
  gst_credlink_form_updated: FormGroup;
  company_crimecheck_form!: FormGroup;
  individual_crimecheck_form!: FormGroup;
  

  pageName = "viewPage";
  applicants: any[] = [];
  services: any[] = [];
  BSAInstitutions: any[] = [];
  currentAppct:any;
  fsa_year:any = "";
  itr_document_type:any = "";
  fsa_files:any = [];
  itr_files:any = [];
  gst_files:any = [];
  bsa_files:any = [];
  //fsa_scanned:boolean = true;
  applicantDetails: any;
  lan: String = "";
  loader = false;
  apimessage = false;
  apiStatus:any = [];
  months:any;
  isScannedDoc = true
  // medical_council_names: string[] = ["Andhra Pradesh Medical Council", "Arunachal Pradesh Medical Council", "Assam Medical Council","Bhopal Medical Council", "Bihar Medical Council","Bombay Medical Council","Chandigarh Medical Council","Chattisgarh Medical Council","Delhi Medical Council","Goa Medical Council","Gujarat Medical Council","Haryana Dental & Medical Councils","Himanchal Pradesh Medical Council","Hyderabad Medical Council","Jammu & Kashmir Medical Council","Jharkhand Medical Council","Karnataka Medical Council","Madhya Pradesh Medical Council","Madras Medical Council","Mahakoshal Medical Council","Maharashtra Medical Council","Manipur Medical Council","Medical Council of India","Medical Council of Tanganyika","Mizoram Medical Council","Mysore Medical Council","Nagaland Medical Council","Orissa Council of Medical Registration","Pondicherry Medical Council","Punjab Medical Council","Rajasthan Medical Council","Sikkim Medical Council","Tamil Nadu Medical Council","Telangana State Medical Council","Tripura State Medical Council","Uttar Pradesh Medical Council","Uttarakhand Medical Council","Vidharba Medical Council","West Bengal Medical Council"]

  bsaMonthFromMaximum: String = ""
  bsaMonthToMinimum: String = ""
  
  constructor(
    public fb: FormBuilder,
    private viewService: ViewService,
    private route: Router
  ) {
    
  }
  ngOnInit(): void {
    this.months = Array.from({ length: 1188 }, (_, i) => i+1);
    let userdetails:any  = JSON.parse( localStorage.getItem("userDetails") || '{}');
    if(Object.keys(userdetails).length === 0){
      this.route.navigate(['/'])
    }
    this.lan = userdetails.lan;
    
    Object.keys(this.apiDetails).map((key) => {
      this.apiDetails[key].checked = false
    })
    
    this.getApplicants(this.lan);
    this.getServices();
    this.getBsaInstitutionsId();

    // this.getCurrentMonth()
    // this.getMinimumMonth()
    
    this.pan_card_form = this.fb.group({
      pan: ["",Validators.required],
      dob: ["",Validators.required],
      name: ["",Validators.required],
      consent:["Y"],
      needKarza:["N"],
      user_name:[""],
      triggerBy:[""],
      lan:[""],
      user_type:[""],
    },{updateOn: 'blur'});
    
    this.aadhar_xml_form = this.fb.group({
      file1:[null,Validators.required],
      shareCode:[""],
      image:[null],
      dob:[""],
      name:[""],
      address:[""],
      mobile:[""],
      email:[""],
      consent:["Y"],
      lan:[],
      triggerBy:[],
      user_name:[],
      user_type:[],
    },{updateOn: 'blur'});
    
    this.passport_form = this.fb.group({
      fileNo: ["", Validators.required],
      passportNo: ["", Validators.required],
      doi: ["", Validators.required],
      name: ["", Validators.required],
      dob: ["", Validators.required],
      needKarza: ["N"],
      user_name: [""],
      triggerBy: [""],
      lan: [""],
      user_type: [""],
      consent: ["Y"]
    },{updateOn: 'blur'});
    
    this.driving_lincence_form = this.fb.group({
      dlNo: ["",Validators.required],
      dob: ["",Validators.required],
      consent: ["Y"],
      needKarza: ["N"],
      user_name: [""],
      triggerBy: [""],
      lan: [""],
      user_type: [""]
    },{updateOn: 'blur'});
    
    this.voterid_form = this.fb.group({
      consent:["Y"],
      needkarza:["N"],
      epicNo:["",Validators.required],
      lan:[""],
      triggerBy:[""],
      user_name:[""],
      user_type:[""]
    },{updateOn: 'blur'});
    
    this.pan_aadhar_form = this.fb.group({
      // lat: [],
      // longitude: [],
      // ipAddress: [],
      // userAgent: [],
      // deviceId: [],
      // deviceInfo: [],
      consent: ["Y"],
      needkarza:["N"],
      name: ["", Validators.required],
      clientData: this.fb.group({
        caseId: ["1234"]
      }),
      aadhaar: ["", Validators.required],
      pan: ["", Validators.required],
      monthYearOfBirth: ["", Validators.required],
      lan:[""],
      triggerBy:[""],
      user_name:[""],
      user_type:[""]
    },{updateOn: 'blur'})
    
    this.pan_profile_form = this.fb.group({
      pan:["",Validators.required],
      aadhaarLastFour:[""],
      dob:[""],
      name:[""],
      address:[""],
      getContactDetails:["Y"],
      needkarza:["N"],
      PANStatus:["Y"],
      isSalaried:["Y"],
      isDirector:["Y"],
      isSoleProp:["Y"],
      consent:["Y"],
      lan:[""], 
      triggerby:[""],
      user_name:[""],
      user_type:[""]
    },{updateOn: 'blur'})
    
    this.fda_form = this.fb.group({
      consent:["Y"],
      licence_no:["", Validators.required],
      state:["", Validators.required],
      needkarza:["N"],
      lan:[""],
      triggerBy:[""],
      user_name:[""],
      user_type:[""]
    },{updateOn: 'blur'})
    
    this.fssai_form = this.fb.group({
      consent:["Y"],
      needkarza:["N"],
      reg_no:["", Validators.required],
      lan:[""],
      triggerBy:[""],
      user_name:[""],
      user_type:[""]
    },{updateOn: 'blur'})
    
    this.hsn_form = this.fb.group({
      consent:["Y"],
      needkarza:["N"],
      hsCode:["", Validators.required],
      lan:[""],
      triggerBy:[""],
      user_name:[""],
      user_type:[""]
    },{updateOn: 'blur'})
    
    this.shop_establishment_form = this.fb.group({
      consent:["y"],
      regNo:["", Validators.required],
      areaCode:["", Validators.required],
      lan:[""],
      needKarza:["N"],
      triggerBy:[""],
      user_name:[""],
      user_type:[""]
    },{updateOn: 'blur'})


    // this.ca_form = this.fb.group({
    //   consent:["Y"],
    //   membership_no:["", Validators.required],
    //   lan:[""],
    //   needKarza:["N"],
    //   triggerBy:[""],
    //   user_name:[""],
    //   user_type:[""]
    // },{updateOn: 'blur'})
    
    // this.icsi_form = this.fb.group({
    //   consent:["Y"],
    //   membershipNo:["", Validators.required],
    //   cpNo:[""],
    //   lan:[""],
    //   needKarza:["N"],
    //   triggerBy:[""],
    //   user_name:[""],
    //   user_type:[""]
    // },{updateOn: 'blur'}) 
    
    // this.icwai_form = this.fb.group({
    //   consent:["Y"],
    //   membership_no:["", Validators.required],
    //   lan:[""],
    //   needKarza:["N"],
    //   triggerBy:[""],
    //   user_name:[""],
    //   user_type:[""]
    // },{updateOn: 'blur'})

    // this.mci_form = this.fb.group({
    //   consent:["Y"],
    //   registration_no:["", Validators.required],
    //   year_of_reg:["", Validators.required],
    //   medical_council:["", Validators.required],
    //   lan:[""],
    //   needKarza:["N"],
    //   triggerBy:[""],
    //   user_name:[""],
    //   user_type:[""]
    // },{updateOn: 'blur'})
    
    this.employment_form = this.fb.group({
      employerName: ["", Validators.required],
      employeeName: ["", Validators.required],
      mobile: ["", Validators.required],
      emailId: ["", Validators.required],
      needKarza: ["N"],
      cif: [""],
      pdf: [""],
      user_name: [""],
      triggerBy: [""],
      lan: [""],
      user_type: [""]
    },{updateOn: 'blur'})
    
    this.google_form = this.fb.group({
      query:["", Validators.required],
      lan:[""],
      triggerBy:[""],
      user_type:[""],
      user_name:[""]
    },{updateOn: 'blur'})
    

    this.fsa_form = this.fb.group({
      files:this.fb.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
      fsaMetaData:this.fb.group({
        loanAmount:["",Validators.required],
        loanDuration:["",Validators.required],
        loanType:["",Validators.required],
        lan:[""],
        triggerBy:[""],
        user_type:[""],
        user_name:[""],
        files:["",Validators.required],
        uploadingScannedStatements:[true],
      }),
      fsa_year:[""],
    },{updateOn: 'blur'})
    

    this.gst_form = this.fb.group({
      file:this.fb.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(48)]),
      gstIn:["", Validators.required],
      consent:[],
      extendedPeriod:[false],
      lan:[],
      user_name:[],
      user:[],
      user_type:[]
    },{updateOn: 'blur'})
    

    this.bsa_form = this.fb.group({
      files:this.fb.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(60)]),
      data:this.fb.group({
        loanAmount:["",Validators.required],
        loanDuration:["",Validators.required],
        loanType:["",Validators.required],
        employmentType:["",Validators.required],
        processingType:["",Validators.required],
        yearMonthFrom:["", Validators.required],
        yearMonthTo:["", Validators.required],
        facility: ["", Validators.required],
        uploadingScannedStatements:[true],
        accounts:this.fb.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(5)]),
        lan:[""],
        triggerBy:[""],
        user_type:[""],
        user_name:[""]
      })
    },{updateOn: 'blur'})

    
    this.itr_form = this.fb.group({
      files:this.fb.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
      data:this.fb.group({
        pan:["", Validators.required],
        fileData:["", Validators.required],
        scanned:[true],
        lan:[""],
        triggerBy:[""],
        user_type:[""],
        user_name:[""],
      }),
    },{updateOn: 'blur'})

    // this.udin_form = this.fb.group({
    //   consent:["Y"],
    //   udin:["",Validators.required],
    //   mobile:["",[Validators.required,Validators.pattern(/^[0-9]{10}\d*$/)]],
    //   lan:[""],
    //   needkarza:["N"],
    //   triggerBy:["Aakash"],
    //   user_type:[""],
    //   user_name:[""],
    // },{updateOn: 'blur'})

    this.gst_credlink_form = this.fb.group({
      mobile:[],
      email:[],
      consent:[true],
      gstCertFlag:[false],
      gstin:[],
      extendedPeriod:[true],
      customerName:[],
      // simulateEnable:[true],
      // inclusiveReports:[],
      businessName:[],
      applicationId:[],
      refId:[],
      lan:[""],
      triggerBy:[""],
      user_type:[""],
      user_name:[""]
    },{updateOn: 'blur'})
    
    this.gst_credlink_form_updated = this.fb.group({
      additionalContact:[],
      consent:[],
      gstCertFlag:[false],
      gstinList:[],
      // simulateData:this.fb.group({
      //   simulateEnable:[],
      //   inclusiveReports:[]
      // }),
      businessName: [], 
      applicationId: [], 
      refId: [],
      lan:[],
      user_name:[],
      user_type:[],
      triggerBy:[]
    },{updateOn: 'blur'})

    this.bsa_online_form = this.fb.group({
      loanType:["",Validators.required],
      employmentType:["",Validators.required],
      destination:["",Validators.required],
      loanAmount:["",Validators.required],
      acceptancePolicy:["",Validators.required],
      loanDuration:["",Validators.required],
      returnUrl:[env.redirectUrl.replace("dashboard", "trigger-services")],
      facility:["",],
      yearMonthFrom:[""],
      yearMonthTo:[""],
      lan:[""],
      triggerBy:[""],
      user_type:[""],
      user_name:[""]
    },{updateOn: 'blur'})

    this.itr_online_form = this.fb.group({
      pan:["",Validators.required],
      dob:["",Validators.required],
      redirectUrl:[env.redirectUrl.replace("dashboard", "trigger-services")],
      lan:[""],
      triggerBy:[""],
      user_type:[""],
      user_name:[""]
    },{updateOn: 'blur'})

    this.company_crimecheck_form = this.fb.group({
      companyName:["",Validators.required],
      companyType:["",Validators.required],
      companyAddress:["",Validators.required],
      ticketSize:["",Validators.required],
      selectCinOrGst: [""],
      directors: this.fb.array([], [Validators.maxLength(5)]),
      lan:[""],
      user_type:[""],
      user_name:[""]
    },{updateOn: 'blur'})

    this.individual_crimecheck_form = this.fb.group({
      name:["",Validators.required],
      fatherName:["",Validators.required],
      address:["",Validators.required],
      panNumber:["",[Validators.required, Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/)]],
      lan:[""],
      user_type:[""],
      user_name:[""]
    },{updateOn: 'blur'})
  }


  @ViewChild('fsaFileInput') fsaFileInput: any;
  @ViewChild('itrFileInput') itrFileInput: any;
  @ViewChild('gstFileInput') gstFileInput: any;
  @ViewChild('bsaFileInput') bsaFileInput: any;
  @ViewChild('applicantsElm') applicantsElm: any;
  @ViewChild("setvicesAvailable") setvicesAvailable: any;
  @ViewChild("SubmitDocuments") SubmitDocuments: any;
  @ViewChild("backdrop") backdrop: any;
  @ViewChild("errormodal") errormodal: any;

  onFileChange(event, formName, accIndex) {
    if (event.target.files.length > 0) {
      let files = event.target.files;
      let fieldName = String(event.target.id.split("_")[1]);
      
      if(formName == "fsa_form"){
        if(this.fsa_year == ""){
          this.displayFormError('17', "Please select year!", true)
          this.resetFileInput("fsa")
          return;
        }
        if (this.checkFileType(files[0].type)) {
          this.displayFormError('17', "", false)
        } else {
          this.displayFormError('17', `File ${files[0].name} is not a valid file type. Only PDF files are allowed!`, true)
          return;
        }

        if (this.checkFileSize(files[0].size, 25)) {
          this.displayFormError('17', `File ${files[0].name} exceeds the maximum allowed size of 25MB!`, true)
          return;
        } else {
          this.displayFormError('17', "", false)
        }

        if (this.fsafiles.length === 3) {
          this.displayFormError('17', "Maximum of 3 files are allowed!", true)
          return;
        }
        this.fsafiles.push(this.createItem(files[0]));
        this.fsa_files.push({
          fileName:files[0].name,
          fileType:"",
          financialYear: this.fsa_year,
          password:""
        }) 
        this.fsa_form.patchValue({
          fsaMetaData: {
            files: this.fsa_files
          }
        });
        this.fsa_form.controls['fsa_year'].reset()
        this.fsa_year = "";
      } else if(formName == "gst_form"){
        for (let file of files) {
          if (this.checkFileType(file.type)) {
            this.displayFormError('18', "", false)
          } else {
            this.displayFormError('18', `File ${file.name} is not a valid file type. Only PDF files are allowed!`, true)
            return;
          }

          if (this.checkFileSize(file.size, 30)) {
            this.displayFormError('18', `File ${file.name} exceeds the maximum allowed size of 30MB!`, true)
            return;
          } else {
            this.displayFormError('18', "", false)
          }
  
          if (this.gstfiles.length === 48) {
            this.displayFormError('18', "Maximum of 48 files are allowed!", true)
            return;
          }

          this.gstfiles.push(this.createItem(file));
          this.gst_files.push({
            fileName:file.name
          })
        }
      } else if(formName == "itr_form"){
        if (this.itr_form.value.data.scanned) {
          this.isScannedDoc = true
        } else {
          this.isScannedDoc = false
        }
        if (this.checkFileType(files[0].type)) {
          this.displayFormError('49', "", false)
        } else {
          this.displayFormError('49', `File ${files[0].name} is not a valid file type. Only PDF files are allowed!`, true)
          return;
        }

        if (this.checkFileSize(files[0].size, 30)) {
          this.displayFormError('49', `File ${files[0].name} exceeds the maximum allowed size of 30MB!`, true)
          return;
        } else {
          this.displayFormError('49', "", false)
        }

        if (this.itrfiles.length === 3) {
          this.displayFormError('49', "Maximum of 3 files are allowed!", true)
          return;
        }
        this.itrfiles.push(this.createItem(files[0]));
        this.itr_files.push({
          fileName:files[0].name,
          documentType: null,
          password:null
        }) 
        this.itr_form.patchValue({
          data: {
            fileData: this.itr_files
          }
        });
      } else if(formName == "bsa_form"){
        
        for (let file of files) {

          if (this.checkFileType(file.type)) {
            this.displayFormError('19', "", false)
          } else {
            this.displayFormError('19', `File ${file.name} is not a valid file type. Only PDF files are allowed!`, true)
            return;
          }

          if (this.checkFileSize(file.size, 25)) {
            this.displayFormError('19', `File ${file.name} exceeds the maximum allowed size of 25MB!`, true)
            return;
          } else {
            this.displayFormError('19', "", false)
          }
  
          if (this.bsafiles.length === 60) {
            this.displayFormError('19', "Maximum of 60 files are allowed!", true)
            return;
          }

          if (this.accFiledataArray(accIndex).length === 12) {
            this.displayFormError('19', "Maximum of 12 files per account are allowed!", true)
            return;
          }

          this.bsafiles.push(this.createItem(file));

          this.accFiledataArray(accIndex).push(
            this.fb.group({
              fileName: [file.name]
          })
          )
        }
      } else if(formName === "aadhar_xml_form") {
        fieldName = String(event.target.id);
        this[formName].patchValue({
          [fieldName]: files[0]
        });
      } else {
        this[formName].patchValue({
          [fieldName]: files[0]
        });
      }   
    }
  }

  checkFileType(fileType: string, extension: string = "application/pdf"): boolean {
    if (fileType) {
      if (fileType === extension) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  checkFileSize(fileSize: number, maxSize: number): boolean {
    const maxBytes = maxSize * 1024 * 1024;
    if (fileSize) {
      if (fileSize > maxBytes) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  
  resetFileInput(value: string) {
    const element = `${value}FileInput`
    this[element].nativeElement.value = '';
  }
  
  deleteFile(category, index, accIndex, fileIndex){
    if(category == "fsa"){
      this.fsafiles.removeAt(index);
      this.fsa_files.splice(index, 1);
      this.fsa_form.patchValue({
        fsaMetaData: {
          files: this.fsa_files
        }
      });
      console.log(this.fsafiles)
      console.log(this.fsafiles.length)
      if (this.fsafiles.length < 3) {
        this.displayFormError('17', "", false)
      }
      this.resetFileInput("fsa")

    } else if(category == "gst"){
      this.gstfiles.removeAt(index);
      this.gst_files.splice(index, 1);
      if (this.gstfiles.length < 48) {
        this.displayFormError('18', "", false)
      }
      this.resetFileInput("gst")

    } else if(category == "bsa"){
      this.bsafiles.removeAt(index);
      this.accFiledataArray(accIndex).removeAt(fileIndex)
      if (this.bsafiles.length < 60) {
        this.displayFormError('19', "", false)
      }

      if (this.accFiledataArray(accIndex).length < 12) {
        this.displayFormError('19', "", false)
      }
      this.resetFileInput("bsa")

    } else if (category === "itr") {
      this.itrfiles.removeAt(index);
      this.itr_files.splice(index, 1);
      if (this.itrfiles.length < 3) {
        this.displayFormError('49', "", false)
      }
      this.resetFileInput("itr")

    }
  }

  onPasswordChange(event, category, index, field){
    this[category][index][field] = event.target.value
  }

  onScannedDocChange(event, form_name) {
    if (form_name === "itr_form") {
      this.itrfiles.clear();
      this.itr_files = []
      this.resetFileInput("itr")
    }
  }

  fsa_year_select(event){
    if(event !== null){
      this.fsa_year = event.target.value;
    }
  }

  document_type_select(event){
    if(event !== null){
      this.itr_document_type = event.target.value;
    }
  }
  
  createItem(data): FormControl {
    return this.fb.control(data);
  }
  
  get fsafiles(): FormArray {
    return this.fsa_form.get('files') as FormArray;
  };
  
  get gstfiles(): FormArray {
    return this.gst_form.get('file') as FormArray;
  };
  
  get itrfiles(): FormArray {
    return this.itr_form.get('files') as FormArray;
  };
  
  get bsafiles(): FormArray {
    return this.bsa_form.get('files') as FormArray;
  };

  get bsaAccounts(): FormArray {
    return this.bsa_form.get('data')?.get('accounts') as FormArray;
  }

  get bsaDrawingPowerAmounts(): FormArray {
    return this.bsa_form.get('data')?.get('drawingPowerVariableAmounts') as FormArray;
  }

  get bsaFormData(): FormGroup {
    return this.bsa_form.get('data') as FormGroup;
  }

  getAccount(accIndex: number) {
    return this.bsaAccounts.at(accIndex)
  }

  accFiledataArray(accIndex: number): FormArray {
    return this.getAccount(accIndex).get("fileData") as FormArray;
  }

  bsafileName(accIndex: number, fileIndex: number) {
    return this.accFiledataArray(accIndex).at(fileIndex).get("fileName")?.value
  }

  get companyDirectors(): FormArray {
    return this.company_crimecheck_form.get('directors') as FormArray;
  }

  directorData(dirindex: number) {
    return this.companyDirectors.at(dirindex)
  }

  onBsaMonthChange(e: any) {
    this.bsaFormData.get("facility")?.setValue("",{
      onlySelf: true,
    })
    this.bsaFormData.removeControl("sanctionLimitFixed")
    this.bsaFormData.removeControl("sanctionLimitFixedAmount")
    this.bsaFormData.removeControl("drawingPowerVariableAmounts")
    this.displayFormError('19', "", false)
  }

  getMinimumMonth(): String {
    let today = new Date()
    let past72Month = new Date(today);

    past72Month.setMonth(today.getMonth() - 72);

    let year = past72Month.getFullYear()
    let month: any = past72Month.getMonth() + 1
    if (month < 10) {
      month = '0' + month;
    }
    this.bsaMonthToMinimum = `${year}-${month}`
    return `${year}-${month}`
  }

  getCurrentMonth(): String {
    let today = new Date()
    let year = today.getFullYear()
    let month: any = today.getMonth() + 1
    if (month < 10) {
      month = '0' + month;
    }
    this.bsaMonthFromMaximum = `${year}-${month}`
    return `${year}-${month}`
  }

  bsaAccountForm(): FormGroup {
    return this.fb.group({
      bankName: ["", Validators.required],
      password: [""],
      fileData: this.fb.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(12)])
    });
  }

  onBsaFacilityChange(e: any) {

    let facilty = e.target.value
    if (facilty === "OD") {

      let bsaMonthFrom = this.bsaFormData.get('yearMonthFrom')?.value
      let bsaMonthTo = this.bsaFormData.get('yearMonthTo')?.value
      
      let noOfMonths = this.monthDiff(new Date(bsaMonthFrom), new Date(bsaMonthTo))

      if (noOfMonths >= 0 && noOfMonths <= 13) {

        this.bsaFormData.addControl('sanctionLimitFixed', this.fb.control(true));
        this.bsaFormData.addControl('sanctionLimitFixedAmount', this.fb.control("", [Validators.required, Validators.min(1), Validators.max(9999999999)]));

        this.bsaFormData.removeControl("drawingPowerVariableAmounts")

      } else {
        this.displayBSAMonthError(noOfMonths)
      }

    } else if (facilty === "CC") {

      let bsaMonthFrom = this.bsaFormData.get('yearMonthFrom')?.value
      let bsaMonthTo = this.bsaFormData.get('yearMonthTo')?.value
      
      let noOfMonths = this.monthDiff(new Date(bsaMonthFrom), new Date(bsaMonthTo))
      
      if (noOfMonths >= 0 && noOfMonths <= 13) {

        this.bsaFormData.addControl('sanctionLimitFixed', this.fb.control(true));
        this.bsaFormData.addControl('sanctionLimitFixedAmount', this.fb.control("", [Validators.required, Validators.min(1), Validators.max(9999999999)]));

        this.bsaFormData.addControl('drawingPowerVariableAmounts', this.fb.array([]))

        for (let i=0; i <= noOfMonths; i++) {

          this.bsaDrawingPowerAmounts.push(
            this.fb.group({
              variableAmount: this.fb.group({
                amount: ["", [Validators.required, Validators.min(0), Validators.max(9999999999)]]
              })
          }))

          if (i === 11) {
            break
          }
        }

      } else {
        this.displayBSAMonthError(noOfMonths)
      }

    } else {

      let bsaMonthFrom = this.bsaFormData.get('yearMonthFrom')?.value
      let bsaMonthTo = this.bsaFormData.get('yearMonthTo')?.value
      
      let noOfMonths = this.monthDiff(new Date(bsaMonthFrom), new Date(bsaMonthTo))
      
      if (noOfMonths >= 0 && noOfMonths <= 13) {

        this.bsaFormData.removeControl("sanctionLimitFixed")
        this.bsaFormData.removeControl("sanctionLimitFixedAmount")
        this.bsaFormData.removeControl("drawingPowerVariableAmounts")

      } else {
        this.displayBSAMonthError(noOfMonths)
      }

    }
  }

  displayBSAMonthError(noOfMonths: any) {
    if (noOfMonths < 0) {

      this.bsaFormData.get("facility")?.setValue("",{
        onlySelf: true,
      })
      this.displayFormError('19', "Year Month From cannot be greater than Year Month To!", true)

    } else if (noOfMonths > 13) {

      this.bsaFormData.get("facility")?.setValue("", {
        onlySelf: true,
      })
      this.displayFormError('19', "Maximum of 13 Months are allowed!", true)

    } else {

      this.bsaFormData.get("facility")?.setValue("", {
        onlySelf: true,
      })
      this.displayFormError('19', "Please select Year Month From and Year Month To!", true)

    }
  }

  monthDiff(dateFrom, dateTo) {
    return dateTo.getMonth() - dateFrom.getMonth() + 
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  }

  addBsaAccount() {
    this.bsaAccounts.push(this.bsaAccountForm());
  }

  removeBsaAccount(accIndex: number) {
    this.bsaAccounts.removeAt(accIndex);
  }

  companyDirectorsForm(): FormGroup {
    return this.fb.group({
      name: ["", Validators.required],
      pan: ["", [Validators.required, Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/)]]
    });
  }

  addCompanyDirector() {
    this.companyDirectors.push(this.companyDirectorsForm());
  }

  removeCompanyDirector(directorIndex: number) {
    this.companyDirectors.removeAt(directorIndex);
  }

  onCinOrGstChange(e: any) {
    let value = e.target.value

    if (value === "cin") {

      this.company_crimecheck_form.removeControl("gstIn")
      this.company_crimecheck_form.addControl('cinNumber', this.fb.control("", [Validators.required, Validators.pattern(/^[A-Z]{1}\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/)]));

    } else if (value === "gst") {

      this.company_crimecheck_form.removeControl("cinNumber")
      this.company_crimecheck_form.addControl('gstIn', this.fb.control("", [Validators.required, Validators.pattern(/^(\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[A-Z]{2})$/)]));
      
    } else {
      this.company_crimecheck_form.removeControl("gstIn")
      this.company_crimecheck_form.removeControl("cinNumber")
    }
  }

  onFormatCheck(e: any, field, key, index) {
    console.log(field, e.target.value)

    if (field === "gst") {

      if (this.company_crimecheck_form.get('gstIn')?.errors?.['pattern']) {
        this.displayFormError(key, "Please enter a valid GST number.", true)
      } else {
        this.displayFormError(key, "", false)
      }

    } else if (field === "cin") {
      if (this.company_crimecheck_form.get('cinNumber')?.errors?.['pattern']) {
        this.displayFormError(key, "Please enter a valid CIN number.", true)
      } else {
        this.displayFormError(key, "", false)
      }
    } else if (field === "pan") {

      if (key === "51") {
        if (this.directorData(index).get('pan')?.errors?.['pattern']) {
          this.displayFormError(key, "Please enter a valid PAN number.", true)
        } else {
          this.displayFormError(key, "", false)
        }
      } else {
        if (this.individual_crimecheck_form.get('panNumber')?.errors?.['pattern']) {
          this.displayFormError(key, "Please enter a valid PAN number.", true)
        } else {
          this.displayFormError(key, "", false)
        }
      }
    } 
  }
  
  async submitForm() {
    this.loader = true
    for (var key of Object.keys(this.apiDetails)) {
      if (this.apiDetails[key].checked) {
        this.updateDefaultParams(this[this.apiDetails[key].form], this.apiDetails[key].form)

        // if(key == "22"){
        //   await Promise.all([
        //     this.getLatLogDetails()
        //   ]);
        // }
        let form
        if(key == "27"){
          this.updateCredlinkForm()
          form = this[this.apiDetails[key].form + "_updated"];
        } else {
          form = this[this.apiDetails[key].form];
        }

        let formData = form.value
        if (key === "1") {
          let dob = formData.dob;
          const [year, month, day] = dob.split('-');
          const result = `${day}/${month}/${year}`
          formData["dob"] = result

          form = this[this.apiDetails[key].form];
        }

        if (key === "3") {
          let dob = formData.dob;
          let doi = formData.doi;
          let [year, month, day] = dob.split('-');
          let result = `${day}/${month}/${year}`
          formData["dob"] = result

          year = doi.split('-')[0];
          month = doi.split('-')[1];
          day = doi.split('-')[2];
          result = `${day}/${month}/${year}`
          formData["doi"] = result

          form = this[this.apiDetails[key].form];
        }

        if (key === "4") {
          let dob = formData.dob;
          const [year, month, day] = dob.split('-');
          const result = `${day}-${month}-${year}`
          formData["dob"] = result

          form = this[this.apiDetails[key].form];
        }

        if (key === "22") {
          let monthYearOfBirth = formData.monthYearOfBirth;
          const [year, month] = monthYearOfBirth.split('-');
          const result = `${month}-${year}`
          formData["monthYearOfBirth"] = result

          form = this[this.apiDetails[key].form];
        }
        
        console.log("form", form);
        
        let contentType = this.apiDetails[key].apiContentType;
        let url = this.apiDetails[key].url;
        try{
          let res = await this.viewService.submitForm(form, url, contentType);
          // if(this.apiDetails[key].form == "udin_form" && res.data){
          //   await this.submitUDINOtp(res.data, key);
          //   continue;
          // } 
          // if(this.apiDetails[key].form == "gst_form" && res.data){
          //   await this.triggerRemainingFiles(res, key);
          //   continue;
          // }
          console.log(res)
          if(res.status){
            console.log(key)
            this.apiDetails[key].checked = false;
            this.apiDetails[key].error = false;
            this.apiDetails[key].error_message = false;
            this[this.apiDetails[key].form].reset();
            this.bsaAccounts.reset()
            this.companyDirectors.reset()
            this.company_crimecheck_form.removeControl("cinNumber")
            this.company_crimecheck_form.removeControl("gstIn")
            this.bsaFormData.removeControl("sanctionLimitFixed")
            this.bsaFormData.removeControl("sanctionLimitFixedAmount")
            this.bsaFormData.removeControl("drawingPowerVariableAmounts")
            this.updateMessage(key, res);
            this.getTriggerServices()

            this.itr_files = []
            this.bsa_files = []
            this.gst_files = []
            this.fsa_files = []
            this.itrfiles.clear()
            this.bsafiles.clear()
            this.gstfiles.clear()
            this.fsafiles.clear()
          } else {
            console.log(key)
            this.apiDetails[key].checked = false;
            this.apiDetails[key].error = false;
            this.apiDetails[key].error_message = false;
            this[this.apiDetails[key].form].reset();
            this.bsaAccounts.reset()
            this.companyDirectors.reset()
            this.company_crimecheck_form.removeControl("cinNumber")
            this.company_crimecheck_form.removeControl("gstIn")
            this.bsaFormData.removeControl("sanctionLimitFixed")
            this.bsaFormData.removeControl("sanctionLimitFixedAmount")
            this.bsaFormData.removeControl("drawingPowerVariableAmounts")
            this.updateMessage(key, res);
            this.getTriggerServices()

            this.itr_files = []
            this.bsa_files = []
            this.gst_files = []
            this.fsa_files = []
            this.itrfiles.clear()
            this.bsafiles.clear()
            this.gstfiles.clear()
            this.fsafiles.clear()
          }
        } catch(err:any){
          console.log(err)
          this.updateMessage(key, err)
        }
      }
    }
    this.checkValidation();
    this.loader = false;
    this.apimessage = true;
  }
  
  updateCredlinkForm(){
    let form = this.gst_credlink_form_updated;
    let additionalContact = [{
      mobile:this.gst_credlink_form.getRawValue().mobile,
      email:this.gst_credlink_form.getRawValue().email
    }]
    console.log(additionalContact);
    let gstinList = [{
      mobile:this.gst_credlink_form.getRawValue().mobile,
      email:this.gst_credlink_form.getRawValue().email,
      gstin:this.gst_credlink_form.getRawValue().gstin,
      customerName:this.gst_credlink_form.getRawValue().customerName,
      extendedPeriod:this.gst_credlink_form.getRawValue().extendedPeriod
    }]
    // let simulateData = {
    //   simulateEnable : this.gst_credlink_form.getRawValue().simulateEnable,
    //   inclusiveReports : [this.gst_credlink_form.getRawValue().inclusiveReports]
    // }
    console.log("=========",this.gst_credlink_form.getRawValue());

    form.patchValue({
      additionalContact:additionalContact,
      consent:this.gst_credlink_form.getRawValue().consent,
      gstCertFlag:this.gst_credlink_form.getRawValue().gstCertFlag,
      gstinList:gstinList,
      // simulateData: simulateData,
      businessName:this.gst_credlink_form.getRawValue().businessName,
      applicationId:"",
      refId:"",
      lan:this.lan,
      user_name:this.currentAppct.custshrtname,
      user_type:this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
      triggerBy:""
    })

    if (this.gst_credlink_form.value.consent){
      this.gst_credlink_form_updated.patchValue({
        consent: "Y"
      })
    } else {
      this.gst_credlink_form_updated.patchValue({
        consent: "N"
      })
    }

    // if (this.gst_credlink_form.value.inclusiveReports === null){
    //   this.gst_credlink_form_updated.patchValue({
    //     simulateData: {
    //       inclusiveReports : ["GST", "MCA"]
    //     }
    //   })
    // } 
    // else {
    //   this.gst_credlink_form_updated.patchValue({
    //     consent: "N"
    //   })
    // }

    // console.log("gst", form)
  }

  async triggerRemainingFiles(data, key){
    if(window.confirm('Are sure you want to parse the remaining files?')){
      let body = {
         requestId:data.data.requestId,
         isProceed:true,
         lan:this.lan,
         user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
         user_name: this.currentAppct.custshrtname,
         triggerBy:""
       }
       let res = await this.viewService.submitGSTConfirmation(body);
       console.log(res)
       if(res.status){
         this.apiDetails[key].checked = false;
         this[this.apiDetails[key].form].reset();
         this.updateMessage(key, res)
       } else {
         this.updateMessage(key, res)
       }
    }
  }

  async submitUDINOtp(data, key){
      console.log(data);
      var otp = prompt("Please enter your OTP");
      let body = {
        consent:"y",
        requestId:data.requestId,
        otp:otp,
        lan:this.lan,
        user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
        user_name: this.currentAppct.custshrtname,
        triggerBy:""
      }
      let res = await this.viewService.submitUDINOtp(body);
      console.log(res)
      if(res.status){
        this.apiDetails[key].checked = false;
        this[this.apiDetails[key].form].reset();
        this.updateMessage(key, res)
        this.getTriggerServices()
      } else {
        this.updateMessage(key, res)
        this.getTriggerServices()
      }
  }

  closePupup(){
    this.apimessage = false;
    this.apiStatus = [];
  }
  
  updateMessage(key, res){
    let temp = {};
    console.log(res);
    temp["form"] = this.apiDetails[key].name  
    
    if(res.error){
      if(res.error.message)
        temp["message"] =  res.error.message;
      else
        temp["message"] =  res.message;
      temp["status"] = "Error";
    } else {
      if (key === "26"){
        console.log("bsa online")
        if (res.status){
          temp["status"] = "Success"
          temp["message"] =  res.data.url;
        } else {
          temp["status"] = "Error" 
          temp["message"] =  res.message;
        }
      } else if (key === "27") {
        console.log("gst credlink")
        if (res.status){
          temp["status"] = "Success"
          if (res.data.result) {
            if (res.data.result.weblink) {
              temp["message"] =  `${res.message} - ${res.data.result.weblink}` ;
            } else {
              temp["message"] =  res.message ;
            }
          } else {
            temp["message"] =  res.message ;
          }
        } else {
          temp["status"] = "Error" 
          temp["message"] =  res.message;
        }
      } else if (key === "50") {
        console.log("itr online")
        if (res.status){
          temp["status"] = "Success"
          temp["message"] =  res.data.url;
        } else {
          temp["status"] = "Error" 
          temp["message"] =  res.message;
        }
      } else {
        console.log(res.message);

        if (res.status){
          temp["status"] = "Success" 
          temp["message"] =  res.message;
        } else {
          temp["status"] = "Error" 
          temp["message"] =  res.message;
        }
      }
    }
    this.apiStatus.push(temp);
  }
  
  displayFormError(key, message, error){
    this.apiDetails[key].error = error;
    this.apiDetails[key].error_message = message;
  }

  updateDefaultParams(form, form_name){
    if(form_name == "fsa_form"){
      form.patchValue({
        fsaMetaData:{
          lan:this.lan,
          user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
          user_name: this.currentAppct.custshrtname,
          user_id: this.currentAppct.user_id,
          //dob: this.currentAppct.custdob,
          consent:"Y",
          needKarza:"N",
          triggerBy:"Akash"
        }
        
      })
      return;
    }
    if(form_name == "bsa_form"){
      form.patchValue({
        data:{
          lan:this.lan,
          user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
          user_name: this.currentAppct.custshrtname,
          user_id: this.currentAppct.user_id,
          triggerBy:""
        }
      })
      return;
    }
    if(form_name == "itr_form"){
      form.patchValue({
        data:{
          lan:this.lan,
          user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
          user_name: this.currentAppct.custshrtname,
          //dob: this.currentAppct.custdob,
          triggerBy:"Hemant"
        }
      })
      return;
    }

    if(form_name === "voterid_form") {
      form.patchValue({
        lan:this.lan,
        user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
        user_name: this.currentAppct.custshrtname,
        user_id: this.currentAppct.user_id,
        //dob: this.currentAppct.custdob,
        consent:"Y",
        needkarza:"N",
        triggerBy:"Akash"
      })
      return;
    }
    if(form_name === "pan_aadhar_form") {
      form.patchValue({
        lan:this.lan,
        user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
        user_name: this.currentAppct.custshrtname,
        user_id: this.currentAppct.user_id,
        //dob: this.currentAppct.custdob,
        consent:"Y",
        needkarza:"N",
        triggerBy:"Akash"
      })
      return;
    }
    if(form_name === "pan_profile_form") {
      form.patchValue({
        lan:this.lan,
        user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
        user_name: this.currentAppct.custshrtname,
        user_id: this.currentAppct.user_id,
        //dob: this.currentAppct.custdob,
        consent:"Y",
        needkarza:"N",
        triggerBy:"Akash"
      })
      return;
    }
    if(form_name === "fda_form") {
      form.patchValue({
        lan:this.lan,
        user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
        user_name: this.currentAppct.custshrtname,
        user_id: this.currentAppct.user_id,
        //dob: this.currentAppct.custdob,
        consent:"Y",
        needkarza:"N",
        triggerBy:"Akash"
      })
      return;
    }
    if(form_name === "fssai_form") {
      form.patchValue({
        lan:this.lan,
        user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
        user_name: this.currentAppct.custshrtname,
        user_id: this.currentAppct.user_id,
        //dob: this.currentAppct.custdob,
        consent:"Y",
        needkarza:"N",
        triggerBy:"Akash"
      })
      return;
    }
    if(form_name === "hsn_form") {
      form.patchValue({
        lan:this.lan,
        user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
        user_name: this.currentAppct.custshrtname,
        user_id: this.currentAppct.user_id,
        //dob: this.currentAppct.custdob,
        consent:"Y",
        needkarza:"N",
        triggerBy:"Akash"
      })
      return;
    }
    if(form_name === "gst_credlink_form") {
      form.patchValue({
        lan:this.lan,
        user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
        user_name: this.currentAppct.custshrtname,
        user_id: this.currentAppct.user_id,
        //dob: this.currentAppct.custdob,
        triggerBy:"Akash"
      })
      return;
    }

    if (form_name === "bsa_online_form") {
      form.patchValue({
        returnUrl: env.redirectUrl.replace("dashboard", "trigger-services"),
      })
    }

    if (form_name === "itr_online_form") {
      form.patchValue({
        redirectUrl: env.redirectUrl.replace("dashboard", "trigger-services"),
      })
    }

    if (form_name === "company_crimecheck_form") {
      form.patchValue({
        lan:this.lan,
        user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
        user_name: this.currentAppct.custshrtname,
      })
      return;
    }

    if (form_name === "individual_crimecheck_form") {
      form.patchValue({
        lan:this.lan,
        user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
        user_name: this.currentAppct.custshrtname,
      })
      return;
    }

    form.patchValue({
      lan:this.lan,
      user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
      user_name: this.currentAppct.custshrtname,
      user_id: this.currentAppct.user_id,
      //dob: this.currentAppct.custdob,
      consent:"Y",
      needKarza:"N",
      triggerBy:"Akash"
    })
  }

  getApplicants(lan) {
    this.viewService.getApplicants({ lan: lan })
      .subscribe(data => {
        let dataHFC = data.data.HFC
        let dataNBFC = data.data.NBFC

        if (dataHFC.applicant && (dataHFC.applicant.length > 0)){
          console.log("HFC")
          this.applicants = dataHFC.applicant;
        } else if (dataNBFC.applicant && (dataNBFC.applicant.length > 0)) {
          console.log("NBFC")
          this.applicants = dataNBFC.applicant;
        } else {
          console.log("No Applicants")
        }
        // if (data.data.HFC.applicant.length > 0) {
        //   this.applicants = data.data.HFC.applicant;
        // } else {
        //   this.applicants = data.data.NBFC.applicant;
        // }
        console.log("applicant data", this.applicants);
        setTimeout(() => {
          this.applicantsElm.nativeElement.querySelectorAll('.card:first-child').forEach(
            applicant => {
              applicant.click();
            }
          )
        }, 0);
      })
  }

  getServices() {
    this.viewService.getServices()
      .subscribe(data => {
        this.services = data.data;
        setTimeout(() => {
          this.applicantsElm.nativeElement.querySelectorAll('.card:first-child').forEach(
            applicant => {
              applicant.click();
            }
          )
        }, 0);
      })
  }

  getBsaInstitutionsId(){
    this.viewService.getBsaInstitutionsId()
      .subscribe(data => {
        this.BSAInstitutions = data.data.institutions.institution;
        // console.log(this.BSAInstitutions, "================");
      })
  }

  getApplicantDetails(event, appct) {
    this.currentAppct = appct;
    this.applicantsElm.nativeElement.querySelectorAll('.card.active').forEach(
      applicant => {
        applicant.classList.remove('active');
      }
    )
    event.currentTarget.classList.add('active');
    //console.log(appct);
    let body = {
      lan: this.lan,
      user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
      user_name: this.currentAppct.custshrtname,
      user_id: this.currentAppct.user_id
    }
    this.viewService.getApplicantDetails(body)
      .subscribe(res => {
        let tempService = JSON.parse(JSON.stringify(this.services));
        if (res.data !== null) {
          this.applicantDetails = tempService.map((service) => {
              for(let i = 0; i < service.values.length; i++){
                for(let j = 0; j < res.data.services.length; j++){
                  if(res.data.services[j].service == service.values[i].name)
                  service.values[i].status = res.data.services[j].status
                }
              }
              
              return service;
          })
          //console.log(this.applicantDetails);
        } else {
          this.applicantDetails = tempService;
        }
      })
  }

  getTriggerServices(){
    let body = {
      lan: this.lan,
      user_type: this.currentAppct.applicant_type == "mainapp" ? "ma" : "ca",
      user_name: this.currentAppct.custshrtname,
      user_id: this.currentAppct.user_id
    }
    this.viewService.getApplicantDetails(body)
      .subscribe(res => {
        let tempService = JSON.parse(JSON.stringify(this.services));
        if (res.data !== null) {
          this.applicantDetails = tempService.map((service) => {
              for(let i = 0; i < service.values.length; i++){
                for(let j = 0; j < res.data.services.length; j++){
                  if(res.data.services[j].service == service.values[i].name)
                  service.values[i].status = res.data.services[j].status
                }
              }
              
              return service;
          })
          //console.log(this.applicantDetails);
        } else {
          this.applicantDetails = tempService;
        }
      })
  }

  expandAll(event, task) {
    if (event.target.textContent == "Expand All") {
      this[task].nativeElement.querySelectorAll('.accordion-button').forEach(
        expand => {
          if (expand.classList.contains("collapsed")) {
            event.target.textContent = "Collaps All"
            expand.click();
          }
        }
      )
    } else {
      this[task].nativeElement.querySelectorAll('.accordion-button').forEach(
        expand => {
          if (!expand.classList.contains("collapsed")) {
            event.target.textContent = "Expand All"
            expand.click();
          }
        }
      )
    }
  }

  sub:any = {};
  onServiceSelect(event) {
    this.apiDetails[event.target.value].checked = event.target.checked;
    if(event.target.checked){
      this.itr_files = []
      this.bsa_files = []
      this.gst_files = []
      this.fsa_files = []
      this.itrfiles.clear()
      this.bsafiles.clear()
      this.gstfiles.clear()
      this.fsafiles.clear()
      this.apiDetails[event.target.value].error = false;
      this.apiDetails[event.target.value].error_message = false;
      if(event.target.value == 26){
        this.apiDetails["19"].disabled = true;
      } else if(event.target.value == 27){
        this.apiDetails["18"].disabled = true;
      } else if(event.target.value == 19){
        this.apiDetails["26"].disabled = true;
      } else if(event.target.value == 18){
        this.apiDetails["27"].disabled = true;
      } else if(event.target.value == 49){
        this.apiDetails["50"].disabled = true;
      } else if(event.target.value == 50){
        this.apiDetails["49"].disabled = true;
      }
      this.sub[event.target.value] = this[this.apiDetails[event.target.value].form].valueChanges.subscribe(() => {
        this.checkValidation();
      });
      this.submitButton = false;
      
    } else {
      this.itr_files = []
      this.bsa_files = []
      this.gst_files = []
      this.fsa_files = []
      this.itrfiles.clear()
      this.bsafiles.clear()
      this.gstfiles.clear()
      this.fsafiles.clear()
      this.apiDetails[event.target.value].error = false;
      this.apiDetails[event.target.value].error_message = false;
      this.sub[event.target.value].unsubscribe();
      this[this.apiDetails[event.target.value].form].reset();
      if(event.target.value == 26){
        this.apiDetails["19"].disabled = false;
      } else if(event.target.value == 27){
        this.apiDetails["18"].disabled = false;
      } else if(event.target.value == 19){
        this.apiDetails["26"].disabled = false;
      } else if(event.target.value == 18){
        this.apiDetails["27"].disabled = false;
      } else if(event.target.value == 49){
        this.apiDetails["50"].disabled = false;
      } else if(event.target.value == 50){
        this.apiDetails["49"].disabled = false;
      } else {
        this.checkValidation();
      }
      
    }
    
  }

  checkValidation(){
    this.submitButton = false;
    for (var key of Object.keys(this.apiDetails)) {
      if (this.apiDetails[key].checked && this[this.apiDetails[key].form].valid) {
        this.submitButton = true;
        console.log(this.apiDetails[key].form, this.submitButton, this[this.apiDetails[key].form].valid);
      }
    }
  }

  // async getLatLogDetails(){
  //   return new Promise((resolve, reject) => {
  //     navigator.geolocation.getCurrentPosition(async resp => {
  //       this.pan_aadhar_form.patchValue({
  //         longitude: resp.coords.longitude, 
  //         lat: resp.coords.latitude,
  //         userAgent: navigator.userAgent
  //       });
  //       resolve(1);
  //     })
  //   }) 
  // }

  updateCheckBoxValue(event, form, field){
    console.log(event.target.checked);
    if(event.target.checked){
      this[form].patchValue({
        [field]: "Y"
      })
    } else {
      this[form].patchValue({
        [field]: "N"
      })
    }
  }
}
