import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { labelUtils } from 'src/app/constants/labelUtils';
import { preboardingFormCustomizeFieldDropDown } from 'src/app/constants/commonVariables';

@Component({
    selector: 'app-edit-preboarding-form',
    templateUrl: './edit-preboarding-form.component.html',
    styleUrls: ['./edit-preboarding-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditPreboardingFormComponent implements OnInit {
  @ViewChild('editPreboardingForm') editPreboardingForm: NgForm;
  @ViewChild('addpreboardingcustom') addpreboardingcustom: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('editpreboardingcustom') editpreboardingcustom: NgForm;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  numberTypeLabel: string = 'number'
  imageTypeLabel: string = 'image'
  pdfTypeLabel: string = 'pdf'
  textTypeLabel: string = 'text'
  radioTypeLabel: string = 'radio'
  dropDownLabel: string = 'dropdown'
  signatureLabel: string = 'signature'
  textareaLabel: string = 'textarea'
  dateTypeLabel: string = 'date'
  monthTypeLabel: string = 'month'
  titleTypeLabel: string = 'title'


  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  alldesignation: any;
  field: any = [];
  addsortingIndex: any;
  valueshow: boolean;
  egDisplayMessage: string = '';
  values: any = [];
  customizedata: any;
  required: any;
  index: any;
  preboardingMaster: any;
  removeID: any = [];
  formValue: any;
  curEditIndex: number | null = null;

  showCountryCodeSelected: boolean = labelUtils.showCountryCodeSelected
  selectedCountryCode: any = null
  defaultNationality: any
  deafultEmployeeType: any
  preboardingFormCustomizeFieldDropDownValues: any = preboardingFormCustomizeFieldDropDown

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    if (this.showCountryCodeSelected) {
      this.selectedCountryCode = 103 //Default Selected India for SalaryPatra
      this.defaultNationality = 'Indian'
      this.deafultEmployeeType = 'national'
    }
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.getIPAddress();
    this.editData();
  }

  editData() {
    const body = {
      preboardingMasterID: this.formValue.ListPreboardingFormComponent.id
    }
    this.spinner.start('main')
    this.api
      .callApi(this.constant.GETPREBOARDINGMASTER, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.preboardingMaster = res.data;
          this.company_id = this.preboardingMaster.companyMasterID;
          this.getcompany();
          this.field = res.customizeData
        }
        this.spinner.stop('main');
      });
  }

  getalldesignation() {
    const body = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
    };
    this.api
      .callApi(this.constant.DESIGNATIONBYCOMPANYDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alldesignation = res.data;
        }
      });
  }

  getcompany() {

    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop();
        }
      });

  }

  onSubmit() {
    if (!this.editPreboardingForm.valid) {
      return;
    }
    const body = {
      preboardingMasterID: this.formValue.ListPreboardingFormComponent.id,
      preboardingMasterName: this.editPreboardingForm.value.preBoardingFormName,
      preBoardingCustomize: this.field,
      companyMasterID: this.editPreboardingForm.value.companyMasterID,
      removeID: this.removeID,
    };

    this.spinner.start('addForm');
    this.api.callApi(this.constant.UPDATEPREBOARDINGMASTER, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/preboardings/preboarding_form']);
            this.spinner.stop('addForm');
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message)
          this.spinner.stop('addForm');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
        this.spinner.stop('addForm');
      },
    );
  }

  selectCompany(id: any) {
    if (!id) return;

    this.company_id = id;
    this.getalldesignation();
  }

  onSubmitFields() {
    if (!this.addpreboardingcustom.valid) {
      return;
    }

    if (this.addpreboardingcustom.value.index < 0) {
      this.commonNotificationService.handleWarning('Enter Valid Index!')
      return
    }
    const newIndex = Number(this.addpreboardingcustom.value.index);
    const currentIndex = Number(this.curEditIndex);

    if (newIndex !== currentIndex) {
      const indexExists = this.field.some(
        field => Number(field.sortingindex) === newIndex
      );

      if (indexExists) {
        this.commonNotificationService.handleWarning('Index already exists');
        return;
      }
    }

    const value = [];
    for (var i = 0; i < this.values.length; i++) {
      value.push(this.values[i].value);
    }

    let body = {
      fieldLabel: this.addpreboardingcustom.value.fieldLabel,
      inputType: this.addpreboardingcustom.value.inputType,
      sortingindex: this.addpreboardingcustom.value.index,
      value: value,
      isRequired: this.addpreboardingcustom.value.isRequired,
      mousehovermessage: this.addpreboardingcustom.value.egMessage,
      companyMasterID: this.company_id,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
      deleteShow: true
    };
    this.field.push(body);
    this.closeModal.nativeElement.click();

    this.addpreboardingcustom.resetForm();
  }
  selectinput(event: any) {
    if (event == 'radio') {
      this.valueshow = true;
    } else if (event == 'dropdown') {
      this.valueshow = true;
    } else {
      this.valueshow = false;
    }
  }

  addvalue() {
    this.values.push({ value: '' });
  }
  removevalue(i: any) {
    this.values.splice(i, 1);
  }


  editfields(item: any, index: any) {
    this.customizedata = item;
    this.required = this.customizedata.isRequired.toString();
    this.index = index;
    this.egDisplayMessage = this.customizedata.mousehovermessage.toString();
    this.selectinput(this.customizedata.inputType);
    var respo: any = [];

    for (var i = 0; i < this.customizedata.value.length; i++) {
      respo.push({ value: this.customizedata.value[i] });
    }

    this.values = respo;

  }

  removefields(index: any) {
    if (this.field[index].preboardingFormCustomizeID) this.removeID.push(this.field[index].preboardingFormCustomizeID)
    this.field.splice(index, 1);
  }

  onEditFields() {
    if (!this.editpreboardingcustom.valid) {
      return;
    }
    const value = [];
    for (var i = 0; i < this.values.length; i++) {
      value.push(this.values[i].value);
    }

    let body = {
      fieldLabel: this.customizedata.fieldLabel,
      inputType: this.customizedata.inputType,
      sortingindex: this.customizedata.sortingindex,
      value: value,
      isRequired: this.customizedata.isRequired,
      mousehovermessage: this.egDisplayMessage,
      companyMasterID: this.company_id,
      createBy: localStorage.getItem('id'),
      createByIp: this.ipAddress,
    };
    this.field[this.index] = body;

    this.closeModal1.nativeElement.click();

    this.editpreboardingcustom.resetForm();

  }
  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getinputType(type, i) {
    if (type == this.numberTypeLabel) {
      return this.numberTypeLabel
    } else if (type == this.imageTypeLabel || type == this.pdfTypeLabel) {
      return 'file'
    } else if (this.textTypeLabel) {
      return this.textTypeLabel
    } else if (type == this.radioTypeLabel) {
      return this.radioTypeLabel
    }
  }
}
