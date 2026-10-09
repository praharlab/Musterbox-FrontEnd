import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { preboardingFormCustomizeFieldDropDown } from 'src/app/constants/commonVariables';
import { CommonUtils } from 'src/app/utils/common.utils';
import { NationalityListService } from 'src/app/services/nationality-list.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { labelUtils } from 'src/app/constants/labelUtils';

@Component({
    selector: 'app-add-preboarding-form',
    templateUrl: './add-preboarding-form.component.html',
    styleUrls: ['./add-preboarding-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddPreboardingFormComponent implements OnInit {
  @ViewChild('addPreboardingForm') addPreboardingForm: NgForm;
  @ViewChild('addPreboardingCustomizedField') addPreboardingCustomizedField: NgForm;
  @ViewChild('editPreboardingCustomizedField') editPreboardingCustomizedField: NgForm;
  @ViewChild('addModal', { static: false }) addModal: ModalDirective;
  @ViewChild('editModal', { static: false }) editModal: ModalDirective;

  allCompanyData: any = [];
  adminRoot = environment.adminRoot;
  customizeFields: any = [];
  preboardingCustomizeData = {
    sortingindex: null,
    fieldLabel: null,
    inputType: null,
    isRequired: null,
    mousehovermessage: null,
    value: []
  };
  field: any = [];
  company_id: any
  preboardingMaster: any;
  employeeType1: string = 'national';
  nationalityList: any[] = []
  selectedNationality: string = 'Indian'

  curEditIndex: number | null = null;

  body = {
    preboardingMasterName: null,
    preBoardingCustomize: [],
    companyMasterID: +localStorage.getItem('company_id'),
  };
  preboardingFormCustomizeFieldDropDownValues: any = preboardingFormCustomizeFieldDropDown
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
  editIndex: number
  formValue: any
  showCountryCodeSelected: boolean = labelUtils.showCountryCodeSelected
  selectedCountryCode: any = null
  defaultNationality: any
  deafultEmployeeType: any
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private nationalityListService: NationalityListService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    if (this.showCountryCodeSelected) {
      this.selectedCountryCode = 103 //Default Selected India for Tankhwa Patra
      this.defaultNationality = 'Indian'
      this.deafultEmployeeType = 'national'
    }
    this.formValue = this.formValueStorageService.getData();
    if (
      this.formValue &&
      this.formValue.preboardingform_cloneData &&
      this.formValue.preboardingform_cloneData.id
    ) {
      this.cloneData()
    }
    this.nationalityListService.fetchNationality().subscribe((res) => { this.nationalityList = res })
    this.getcompany();
  }
  getcompany() {
    const body = {
      companyMasterID: this.body.companyMasterID,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allCompanyData = res.data;

          this.spinner.stop();
        }
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


  onSubmit() {
    if (!this.addPreboardingForm.valid) {
      return;
    }
    this.body.companyMasterID = this.addPreboardingForm.value.companyMasterID
    this.body.preboardingMasterName = this.addPreboardingForm.value.preBoardingFormName
    this.body.preBoardingCustomize = this.customizeFields

    this.spinner.start('addForm');
    this.api.callApi(this.constant.ADDPREBOARDINGMASTER, this.body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/preboardings/preboarding_form']);
            this.spinner.stop('addForm');
          }, 3000);
        } else {
          this.commonNotificationService.handleSuccess(res.message)
          this.spinner.stop('addForm');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message)
        this.spinner.stop('addForm');
      },
    );
  }

  addvalue() {
    this.preboardingCustomizeData.value.push({ value: '' });
  }

  removevalue(i: any) {
    this.preboardingCustomizeData.value.splice(i, 1);
  }


  onAddFields() {
    if (!this.addPreboardingCustomizedField.valid) {
      return;
    }

    if (this.addPreboardingCustomizedField.value.sortingindex < 0) {
      this.commonNotificationService.handleWarning('Enter Valid Index!')
      return
    }
    const existIndex = this.customizeFields.some(x => x.sortingindex == this.addPreboardingCustomizedField.value.sortingindex);
    if (existIndex) {
      this.commonNotificationService.handleWarning('Index already exist')
      return
    }

    const value = [];
    for (let val of this.preboardingCustomizeData.value) {
      value.push(val.value);
    }

    if (this.addPreboardingCustomizedField.value.inputType == this.dropDownLabel || this.addPreboardingCustomizedField.value.inputType == this.radioTypeLabel) {
      if (value.length == 0) {
        this.commonNotificationService.handleWarning('Add Atleast One Value')
        return
      }
    }
    this.customizeFields.push({
      fieldLabel: this.addPreboardingCustomizedField.value.fieldLabel,
      inputType: this.addPreboardingCustomizedField.value.inputType,
      sortingindex: this.addPreboardingCustomizedField.value.sortingindex,
      value: value,
      isRequired: this.addPreboardingCustomizedField.value.isRequired,
      mousehovermessage: this.addPreboardingCustomizedField.value.mousehovermessage,
      companyMasterID: this.body.companyMasterID,
    });
    this.sortData()
    this.addModalClear()
  }
  onEditFields() {
    if (!this.editPreboardingCustomizedField.valid) {
      return;
    }
    if (this.addPreboardingCustomizedField.value.sortingindex < 0) {
      this.commonNotificationService.handleWarning('Enter Valid Index!')
      return
    }
    const newIndex = Number(this.addPreboardingCustomizedField.value.sortingindex);
    const currentIndex = Number(this.curEditIndex);

    if (newIndex !== currentIndex) {

      const indexExists = this.customizeFields.some(
        field => Number(field.sortingindex) === newIndex
      );

      if (indexExists) {
        this.commonNotificationService.handleWarning('Index already exists');
        return;
      }
    }

    const value = [];
    for (let val of this.preboardingCustomizeData.value) {
      value.push(val.value);
    }
    if (this.preboardingCustomizeData.inputType == this.dropDownLabel || this.preboardingCustomizeData.inputType == this.radioTypeLabel) {
      if (value.length == 0) {
        this.commonNotificationService.handleWarning('Add Atleast One Value')
        return
      }
    }
    let body = {
      fieldLabel: this.preboardingCustomizeData.fieldLabel,
      inputType: this.preboardingCustomizeData.inputType,
      sortingindex: this.preboardingCustomizeData.sortingindex,
      value: value,
      isRequired: this.preboardingCustomizeData.isRequired,
      mousehovermessage: this.preboardingCustomizeData.mousehovermessage,
      companyMasterID: this.body.companyMasterID,
    };
    this.customizeFields[this.editIndex] = body;
    this.sortData()
    this.editModalClear()

  }


  openAddModal() {
    this.preboardingCustomizeData = {
      sortingindex: null,
      fieldLabel: null,
      inputType: null,
      isRequired: null,
      mousehovermessage: null,
      value: []
    };
    this.addModal.show()
  }

  openEditModal(item: any, index: any) {
    this.editIndex = index
    this.preboardingCustomizeData.sortingindex = item.sortingindex;
    this.curEditIndex = item.sortingindex;
    this.preboardingCustomizeData.fieldLabel = item.fieldLabel;
    this.preboardingCustomizeData.inputType = item.inputType;
    this.preboardingCustomizeData.isRequired = item.isRequired;
    this.preboardingCustomizeData.mousehovermessage = item.mousehovermessage;
    this.preboardingCustomizeData.value = []
    if(item?.value?.length > 0){
      for (let val of item?.value) {
        this.preboardingCustomizeData.value.push({ value: val });
      }
    }
    this.editModal.show()
  }

  removefields(index: any) {
    this.customizeFields.splice(index, 1);
  }


  addModalClear() {
    this.addModal.hide()
    this.addPreboardingCustomizedField.resetForm()
    this.preboardingCustomizeData = {
      sortingindex: null,
      fieldLabel: null,
      inputType: null,
      isRequired: null,
      mousehovermessage: null,
      value: []
    };
  }

  editModalClear() {
    this.editModal.hide()
    this.editPreboardingCustomizedField.resetForm()
    this.preboardingCustomizeData = {
      sortingindex: null,
      fieldLabel: null,
      inputType: null,
      isRequired: null,
      mousehovermessage: null,
      value: []
    };
  }


  sortData() {
    this.customizeFields = CommonUtils.sortDataByFieldName(
      this.customizeFields, "sortingindex"
    );
  }

  cloneData() {
    const body = {
      preboardingMasterID: this.formValue.preboardingform_cloneData.id
    }
    this.spinner.start('main')
    this.api
      .callApi(this.constant.GETPREBOARDINGMASTER, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.preboardingMaster = res;
          this.customizeFields = res.customizeData.map((x) => ({
            fieldLabel: x.fieldLabel,
            inputType: x.inputType,
            sortingindex: x.sortingindex,
            value: x.value,
            isRequired: x.isRequired,
            mousehovermessage: x.mousehovermessage,
            companyMasterID: this.company_id,
          }))
        }
        this.spinner.stop('main');
      });
  }

  ngOnDestroy(): void {
    this.formValueStorageService.removeComponentData('ListPreboardingFormComponent', true)
  }
}
