import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-add-food-allowance-policy',
    templateUrl: './add-food-allowance-policy.component.html',
    styleUrls: ['./add-food-allowance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddFoodAllowancePolicyComponent implements OnInit {
  @ViewChild('AddFoodAllowancePolicy') AddFoodAllowancePolicy: NgForm;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  setFoodAllowanceOnInOutTime: boolean = false;
  setFoodAllowanceOnWorkingHours: boolean = false;
  noFoodAllowance: boolean = false;
  foodAllowanceOnBasisOfInTime: boolean = false;
  foodAllowanceOnBasisOfOutTime: boolean = false;
  shiftData: any = [];
  inTimeValues: any = [];
  outTimeValues: any = [];
  foodAllowanceOnBasisOfInOutDetails: any = [];
  foodAllowanceCompleteHours: boolean = false;
  noTeaAllowance: boolean = false;
  setTeaAllowanceOnInTime: boolean = false;
  setTeaAllowanceOnAttnStatus: boolean = false;

  // CLONE
  foodAllowancePolicyData = {
    foodAllowanceType: null,
    foodAllowanceOnBasisOfInTime: false,
    foodAllowanceOnBasisOfOutTime: false,
    foodAllowanceCompleteHours: false,
    minimumWorkingMinutes: null,
    workingTimeAmount: null,
    foodAllowancePolicyDetails: [],
    teaAllowanceType: null,
    halfDayTeaAllowanceAmount: null,
    fullDayTeaAllowanceAmount: null,
  };
  formValue: any;
  inTimeTeaValues: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = Number(localStorage.getItem('company_id'));
    this.getcompany();
    if (
      this.formValue &&
      this.formValue.foodAllowancePolicy_cloneData &&
      this.formValue.foodAllowancePolicy_cloneData.id
    ) {
      this.cloneData();
    }
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
    if (!this.AddFoodAllowancePolicy.valid) {
      return;
    }

    if (
      this.AddFoodAllowancePolicy.submitted &&
      this.setFoodAllowanceOnInOutTime &&
      !this.foodAllowanceOnBasisOfInTime &&
      !this.foodAllowanceOnBasisOfOutTime
    ) {
      return;
    }

    const finalInTimeValues = this.inTimeValues
      .filter((e) => !e.isDeleted)
      .map((e) => ({
        id: e.id,
        allowanceType: 'food',
        shiftID: e.inShiftID,
        foodAllowanceType: e.inShiftType,
        foodAllowanceTime: e.inShiftTime,
        foodAllowanceAmount: e.inShiftAmount,
      }));

    const finalOutTimeValues = this.outTimeValues
      .filter((e) => !e.isDeleted)
      .map((e) => ({
        id: e.id,
        allowanceType: 'food',
        shiftID: e.outShiftID,
        foodAllowanceType: e.outShiftType,
        foodAllowanceTime: e.outShiftTime,
        foodAllowanceAmount: e.outShiftAmount,
      }));

    const finalInTeaTimeValues = this.inTimeTeaValues
      .filter((e) => !e.isDeleted)
      .map((e) => ({
        id: e.id,
        allowanceType: 'tea',
        shiftID: e.inShiftID,
        foodAllowanceType: e.inShiftType,
        foodAllowanceTime: null,
        foodAllowanceAmount: e.inShiftAmount,
      }));

    this.foodAllowanceOnBasisOfInOutDetails = [
      ...finalInTimeValues,
      ...finalOutTimeValues,
      ...finalInTeaTimeValues,
    ];

    const body = {
      foodAllowancePolicyName: this.AddFoodAllowancePolicy.value.foodAllowancePolicyName,
      companyMasterID: this.AddFoodAllowancePolicy.value.companyMasterID,
      foodAllowanceType: this.AddFoodAllowancePolicy.value.foodAllowanceType,

      foodAllowanceOnBasisOfInTime: this.foodAllowanceOnBasisOfInTime,
      foodAllowanceOnBasisOfOutTime: this.foodAllowanceOnBasisOfOutTime,
      foodAllowanceOnBasisOfInOutDetails: this.foodAllowanceOnBasisOfInOutDetails,
      foodAllowanceCompleteHours: this.foodAllowanceCompleteHours,
      minimumWorkingMinutes: this.AddFoodAllowancePolicy.value.workingTimeMinutes || null,
      workingTimeAmount: this.AddFoodAllowancePolicy.value.workingTimeAmount || null,
      teaAllowanceType: this.AddFoodAllowancePolicy.value.teaAllowanceType,
      teaHalfDayAmount: this.AddFoodAllowancePolicy.value.halfDayAmount || null,
      teaFullDayAmount: this.AddFoodAllowancePolicy.value.fullDayAmount || null,
    };


    this.spinner.start('add');
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api
      .callApi(this.constant.ADDFOODALLOWANCEPOLICY, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/masters/foodAllowancePolicy']);
              this.buttonDisabled = false;
              this.buttonState = '';
              this.spinner.stop('add');
            }, 3000);
          } else {
            this.buttonDisabled = false;
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('add');
          }
        },
        (err) => {
          this.buttonDisabled = false;
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('add');
        },
      );
  }

  setTeaAllowance(event: any) {
    if (event.target.value == 'noTeaAllowance') {
      this.noTeaAllowance = true;
      this.setTeaAllowanceOnInTime = false;
      this.setTeaAllowanceOnAttnStatus = false;
      this.inTimeTeaValues = [];
    } else if (event.target.value == 'onInTime') {
      this.setTeaAllowanceOnInTime = true;
      this.setTeaAllowanceOnAttnStatus = false;
      this.noTeaAllowance = false;
      this.AddFoodAllowancePolicy.value.halfDayAmount = null;
      this.AddFoodAllowancePolicy.value.fullDayAmount = null;
      if (this.inTimeTeaValues && this.inTimeTeaValues.length === 0) this.addInTeaValue();
      if (this.shiftData && this.shiftData.length === 0) this.getShift();
    } else if (event.target.value == 'onAttnStatus') {
      this.setTeaAllowanceOnAttnStatus = true;
      this.setTeaAllowanceOnInTime = false;
      this.noTeaAllowance = false;
      this.inTimeTeaValues = [];
    }
  }

  setFoodAllowance(event: any) {
    if (event.target.value == 'noFoodAllowance') {
      this.noFoodAllowance = true;
      this.setFoodAllowanceOnWorkingHours = false;
      this.setFoodAllowanceOnInOutTime = false;
      this.foodAllowanceOnBasisOfInTime = false;
      this.foodAllowanceOnBasisOfOutTime = false;
      this.foodAllowancePolicyData.foodAllowanceOnBasisOfInTime = false
      this.foodAllowancePolicyData.foodAllowanceOnBasisOfOutTime = false
      this.inTimeValues = [];
      this.outTimeValues = [];
      this.foodAllowanceCompleteHours = false;
    } else if (event.target.value == 'onInOutTime') {
      this.setFoodAllowanceOnInOutTime = true;
      this.setFoodAllowanceOnWorkingHours = false;
      this.noFoodAllowance = false;
    }
    if (event.target.value == 'onWorkingHours') {
      this.setFoodAllowanceOnWorkingHours = true;
      this.setFoodAllowanceOnInOutTime = false;
      this.foodAllowanceOnBasisOfInTime = false;
      this.foodAllowanceOnBasisOfOutTime = false;
      this.noFoodAllowance = false;
      this.inTimeValues = [];
      this.outTimeValues = [];
      this.foodAllowanceCompleteHours = false;
      this.foodAllowancePolicyData.foodAllowanceOnBasisOfInTime = false
      this.foodAllowancePolicyData.foodAllowanceOnBasisOfOutTime = false
    }
  }

  onBasisoFInTime(event) {
    if (event) {
      this.foodAllowanceOnBasisOfInTime = true;
      if (this.inTimeValues && this.inTimeValues.length === 0) this.addInValue();
      if (this.shiftData && this.shiftData.length === 0) this.getShift();
    } else {
      this.foodAllowanceOnBasisOfInTime = false;
      this.inTimeValues = [];
    }
  }

  onBasisoFOutTime(event) {
    if (event) {
      this.foodAllowanceOnBasisOfOutTime = true;
      if (this.outTimeValues && this.outTimeValues.length === 0) this.addOutValue();
      if (this.shiftData && this.shiftData.length === 0) this.getShift();
    } else {
      this.foodAllowanceOnBasisOfOutTime = false;
      this.outTimeValues = [];
    }
  }

  onFoodAllowanceCompleteHours(event) {
    if (event) {
      this.foodAllowanceCompleteHours = true;
    } else {
      this.foodAllowanceCompleteHours = false;
    }
  }

  getShift() {
    this.spinner.start('shift');
    this.api
      .callApi(this.constant.SHIFTBYCOMPANYDATA2 + this.company_id, {}, 'GET', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.shiftData = res.data;
            this.spinner.stop('shift');
          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('shift');
          }
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('shift');
        },
      );
  }

  addInTeaValue() {
    this.inTimeTeaValues.push({
      inShiftID: null,
      inShiftType: 'in',
      inShiftTime: null,
      inShiftAmount: null,
      isDeleted: false,
    });
  }

  addInValue() {
    this.inTimeValues.push({
      inShiftID: null,
      inShiftType: 'in',
      inShiftTime: null,
      inShiftAmount: null,
      isDeleted: false,
    });
  }

  addOutValue() {
    this.outTimeValues.push({
      outShiftID: null,
      outShiftType: 'out',
      outShiftTime: null,
      outShiftAmount: null,
      isDeleted: false,
    });
  }

  removeInTimeValues(i: number) {
    this.inTimeValues[i].isDeleted = true;
    this.inTimeValues[i]['delete'] = true;
  }

  removeInTeaTimeValues(i: number) {
    this.inTimeTeaValues[i].isDeleted = true;
    this.inTimeTeaValues[i]['delete'] = true;
  }

  removeOutTimeValues(i: number) {
    this.outTimeValues[i].isDeleted = true;
    this.outTimeValues[i]['delete'] = true;
  }

  cloneData() {
    const id = this.formValue.foodAllowancePolicy_cloneData.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETFOODALLOWANCEPOLICYBYID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.foodAllowancePolicyData = res.data;

          if (this.foodAllowancePolicyData.foodAllowanceType == 'noFoodAllowance') {
            this.noFoodAllowance = true;
            this.setFoodAllowanceOnWorkingHours = false;
            this.setFoodAllowanceOnInOutTime = false;
            this.foodAllowanceOnBasisOfInTime = false;
            this.foodAllowanceOnBasisOfOutTime = false;
            this.deleteAllInTimeValues();
            this.deleteAllOutTimeValues();

            this.foodAllowanceCompleteHours = false;
          } else if (this.foodAllowancePolicyData.foodAllowanceType == 'onInOutTime') {
            this.setFoodAllowanceOnInOutTime = true;
            this.setFoodAllowanceOnWorkingHours = false;
            this.noFoodAllowance = false;
            this.foodAllowanceOnBasisOfInTime =
              this.foodAllowancePolicyData.foodAllowanceOnBasisOfInTime;
            this.foodAllowanceOnBasisOfOutTime =
              this.foodAllowancePolicyData.foodAllowanceOnBasisOfOutTime;
            this.foodAllowanceCompleteHours =
              this.foodAllowancePolicyData.foodAllowanceCompleteHours;

            this.setInOutValues(this.foodAllowancePolicyData.foodAllowancePolicyDetails.filter(e => e.allowanceType == 'food'));
          }
          if (this.foodAllowancePolicyData.foodAllowanceType == 'onWorkingHours') {
            this.setFoodAllowanceOnWorkingHours = true;
            this.setFoodAllowanceOnInOutTime = false;
            this.foodAllowanceOnBasisOfInTime = false;
            this.foodAllowanceOnBasisOfOutTime = false;
            this.noFoodAllowance = false;
            this.deleteAllInTimeValues();
            this.deleteAllOutTimeValues();

            this.foodAllowanceCompleteHours = false;
          }

          if (this.foodAllowancePolicyData.teaAllowanceType == 'noTeaAllowance') {
            this.noTeaAllowance = true;
            this.setTeaAllowanceOnAttnStatus = false;
            this.setTeaAllowanceOnInTime = false;
            this.deleteAllInTeaTimeValues();

          } else if (this.foodAllowancePolicyData.teaAllowanceType == 'onInTime') {
            this.setTeaAllowanceOnInTime = true;
            this.setTeaAllowanceOnAttnStatus = false;
            this.noTeaAllowance = false;

            this.setInTeaValues(this.foodAllowancePolicyData.foodAllowancePolicyDetails.filter(e => e.allowanceType == 'tea'));
          }
          else if (this.foodAllowancePolicyData.teaAllowanceType == 'onAttnStatus') {
            this.setTeaAllowanceOnInTime = false;
            this.setTeaAllowanceOnAttnStatus = true;
            this.noTeaAllowance = false;
            this.deleteAllInTeaTimeValues();
          }

          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }

  setInOutValues(foodAllowanceOnBasisOfInOutDetails: any) {
    if (foodAllowanceOnBasisOfInOutDetails.length == 0) return;

    this.getShift();

    foodAllowanceOnBasisOfInOutDetails.map((e) => {
      if (e.foodAllowanceType == 'in') {
        this.inTimeValues.push({
          inShiftID: +e.shiftID,
          inShiftType: e.foodAllowanceType,
          inShiftTime: e.foodAllowanceTime,
          inShiftAmount: e.foodAllowanceAmount,
          isDeleted: false,
        });
      } else if (e.foodAllowanceType == 'out') {
        this.outTimeValues.push({
          outShiftID: +e.shiftID,
          outShiftType: e.foodAllowanceType,
          outShiftTime: e.foodAllowanceTime,
          outShiftAmount: e.foodAllowanceAmount,
          isDeleted: false,
        });
      }
    });
  }

  setInTeaValues(foodAllowanceOnBasisOfInOutDetails: any) {
    if (foodAllowanceOnBasisOfInOutDetails.length == 0) return;

    this.getShift();

    foodAllowanceOnBasisOfInOutDetails.map((e) => {
      if (e.foodAllowanceType == 'in') {
        this.inTimeTeaValues.push({

          inShiftID: +e.shiftID,
          inShiftType: e.foodAllowanceType,
          inShiftTime: null,
          inShiftAmount: e.foodAllowanceAmount,
          isDeleted: false,
        });
      }
    });
  }

  deleteAllInTimeValues() {
    this.inTimeValues.forEach((element) => {
      element.isDeleted = true;
    });
  }

  deleteAllOutTimeValues() {
    this.outTimeValues.forEach((element) => {
      element.isDeleted = true;
    });
  }

  deleteAllInTeaTimeValues() {
    this.inTimeTeaValues.forEach((element) => {
      element.isDeleted = true;
    });
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
