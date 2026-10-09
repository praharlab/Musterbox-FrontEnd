import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-food-allowance-policy',
    templateUrl: './edit-food-allowance-policy.component.html',
    styleUrls: ['./edit-food-allowance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditFoodAllowancePolicyComponent implements OnInit {
  @ViewChild('editFoodAllowancePolicy') editFoodAllowancePolicy: NgForm;
  company: any = [];
  designationdata: any;
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  formValue: any;
  foodAllowancePolicyData: any;

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
  inTimeTeaValues: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.editdata();
  }
  editdata() {
    const id = this.formValue.ListFoodAllowancePolicyComponent.id;
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




  deleteAllInTeaTimeValues() {
    this.inTimeTeaValues.forEach((element) => {
      element.isDeleted = true;
    });
  }

  setInTeaValues(foodAllowanceOnBasisOfInOutDetails: any) {
    if (foodAllowanceOnBasisOfInOutDetails.length == 0) return;

    this.getShift();

    foodAllowanceOnBasisOfInOutDetails.map((e) => {
      if (e.foodAllowanceType == 'in') {
        this.inTimeTeaValues.push({
          id: e.id,
          inShiftID: +e.shiftID,
          inShiftType: e.foodAllowanceType,
          inShiftTime: null,
          inShiftAmount: e.foodAllowanceAmount,
          isDeleted: false,
        });
      }
    });
  }


  setInOutValues(foodAllowanceOnBasisOfInOutDetails: any) {
    if (foodAllowanceOnBasisOfInOutDetails.length == 0) return;

    this.getShift();

    foodAllowanceOnBasisOfInOutDetails.map((e) => {
      if (e.foodAllowanceType == 'in') {
        this.inTimeValues.push({
          id: +e.id,
          inShiftID: +e.shiftID,
          inShiftType: e.foodAllowanceType,
          inShiftTime: e.foodAllowanceTime,
          inShiftAmount: e.foodAllowanceAmount,
          isDeleted: false,
        });
      } else if (e.foodAllowanceType == 'out') {
        this.outTimeValues.push({
          id: +e.id,
          outShiftID: +e.shiftID,
          outShiftType: e.foodAllowanceType,
          outShiftTime: e.foodAllowanceTime,
          outShiftAmount: e.foodAllowanceAmount,
          isDeleted: false,
        });
      }
    });
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company = res.data;

          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  onSubmit() {
    if (!this.editFoodAllowancePolicy.valid) {
      return;
    }

    if (
      this.editFoodAllowancePolicy.submitted &&
      this.setFoodAllowanceOnInOutTime &&
      !this.foodAllowanceOnBasisOfInTime &&
      !this.foodAllowanceOnBasisOfOutTime
    ) {
      return;
    }

    const finalInTimeValues = [];

    this.inTimeValues.forEach((e) => {
      if (e.hasOwnProperty('id')) {
        finalInTimeValues.push({
          id: e.id,
          allowanceType: 'food',
          shiftID: e.inShiftID,
          foodAllowanceType: e.inShiftType,
          foodAllowanceTime: e.inShiftTime,
          foodAllowanceAmount: e.inShiftAmount,
          delete: e.isDeleted,
        });
      } else {
        if (!e.isDeleted) {
          finalInTimeValues.push({
            shiftID: e.inShiftID,
            allowanceType: 'food',
            foodAllowanceType: e.inShiftType,
            foodAllowanceTime: e.inShiftTime,
            foodAllowanceAmount: e.inShiftAmount,
          });
        }
      }
    });

    const finalOutTimeValues = [];

    this.outTimeValues.forEach((e) => {
      if (e.hasOwnProperty('id')) {
        finalInTimeValues.push({
          id: e.id,
          allowanceType: 'food',
          shiftID: e.outShiftID,
          foodAllowanceType: e.outShiftType,
          foodAllowanceTime: e.outShiftTime,
          foodAllowanceAmount: e.outShiftAmount,
          delete: e.isDeleted,
        });
      } else {
        if (!e.isDeleted) {
          finalInTimeValues.push({
            allowanceType: 'food',
            shiftID: e.outShiftID,
            foodAllowanceType: e.outShiftType,
            foodAllowanceTime: e.outShiftTime,
            foodAllowanceAmount: e.outShiftAmount,
          });
        }
      }
    });

    const finalInTeaTimeValues = [];

    this.inTimeTeaValues.forEach((e) => {
      if (e.hasOwnProperty('id')) {
        finalInTeaTimeValues.push({
          id: e.id,
          allowanceType: 'tea',
          shiftID: e.inShiftID,
          foodAllowanceType: e.inShiftType,
          foodAllowanceTime: null,
          foodAllowanceAmount: e.inShiftAmount,
          delete: e.isDeleted,
        });
      } else {
        if (!e.isDeleted) {
          finalInTeaTimeValues.push({
            allowanceType: 'tea',
            shiftID: e.inShiftID,
            foodAllowanceType: e.inShiftType,
            foodAllowanceTime: null,
            foodAllowanceAmount: e.inShiftAmount,
          });
        }
      }
    });

    this.foodAllowanceOnBasisOfInOutDetails = [...finalInTimeValues, ...finalOutTimeValues, ...finalInTeaTimeValues];

    const body = {
      foodAllowancePolicyName: this.editFoodAllowancePolicy.value.foodAllowancePolicyName,

      foodAllowanceType: this.editFoodAllowancePolicy.value.foodAllowanceType,

      foodAllowanceOnBasisOfInTime: this.foodAllowanceOnBasisOfInTime,
      foodAllowanceOnBasisOfInOutDetails: this.foodAllowanceOnBasisOfInOutDetails,
      foodAllowanceCompleteHours: this.foodAllowanceCompleteHours,

      foodAllowanceOnBasisOfOutTime: this.foodAllowanceOnBasisOfOutTime,

      minimumWorkingMinutes: this.editFoodAllowancePolicy.value.workingTimeMinutes || null,
      workingTimeAmount: this.editFoodAllowancePolicy.value.workingTimeAmount || null,

      teaAllowanceType: this.editFoodAllowancePolicy.value.teaAllowanceType,
      teaHalfDayAmount: this.editFoodAllowancePolicy.value.halfDayAmount || null,
      teaFullDayAmount: this.editFoodAllowancePolicy.value.fullDayAmount || null,
    };


    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.spinner.start('submit');
    this.api
      .callApi(
        this.constant.UPDATEFOODALLOWANCEPOLICY +
        this.formValue.ListFoodAllowancePolicyComponent.id,
        body,
        'PUT',
        true,
        true,
        true,
      )
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
              this.spinner.stop('submit');
            }, 3000);
          } else {
            this.handleError(res.message);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop('submit');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop('submit');
        },
      );
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  setFoodAllowance(event: any) {
    if (event.target.value == 'noFoodAllowance') {
      this.noFoodAllowance = true;
      this.setFoodAllowanceOnWorkingHours = false;
      this.setFoodAllowanceOnInOutTime = false;
      this.foodAllowanceOnBasisOfInTime = false;
      this.foodAllowanceOnBasisOfOutTime = false;

      this.foodAllowancePolicyData.foodAllowanceOnBasisOfInTime = false;
      this.foodAllowancePolicyData.foodAllowanceOnBasisOfOutTime = false;

      this.foodAllowancePolicyData.dayShiftInTime = null;
      this.foodAllowancePolicyData.nightShiftInTime = null;
      this.foodAllowancePolicyData.shiftInTimeAmount = null;

      this.foodAllowancePolicyData.dayShiftOutTime = null;
      this.foodAllowancePolicyData.nightShiftOutTime = null;
      this.foodAllowancePolicyData.shiftOutTimeAmount = null;

      this.foodAllowancePolicyData.minimumWorkingMinutes = null;
      this.foodAllowancePolicyData.workingTimeAmount = null;

      this.deleteAllInTimeValues();
      this.deleteAllOutTimeValues();

      this.foodAllowanceCompleteHours = false;
      this.foodAllowancePolicyData.foodAllowanceCompleteHours = false;
    } else if (event.target.value == 'onInOutTime') {
      this.setFoodAllowanceOnInOutTime = true;
      this.setFoodAllowanceOnWorkingHours = false;
      this.noFoodAllowance = false;

      this.foodAllowancePolicyData.minimumWorkingMinutes = null;
      this.foodAllowancePolicyData.workingTimeAmount = null;
    }
    if (event.target.value == 'onWorkingHours') {
      this.setFoodAllowanceOnWorkingHours = true;
      this.setFoodAllowanceOnInOutTime = false;
      this.foodAllowanceOnBasisOfInTime = false;
      this.foodAllowanceOnBasisOfOutTime = false;
      this.noFoodAllowance = false;

      this.foodAllowancePolicyData.foodAllowanceOnBasisOfInTime = false;
      this.foodAllowancePolicyData.foodAllowanceOnBasisOfOutTime = false;
      this.deleteAllInTimeValues();
      this.deleteAllOutTimeValues();

      this.foodAllowanceCompleteHours = false;
      this.foodAllowancePolicyData.foodAllowanceCompleteHours = false;
    }
  }

  setTeaAllowance(event: any) {
    if (event.target.value == 'noTeaAllowance') {
      this.noTeaAllowance = true;
      this.setTeaAllowanceOnInTime = false;
      this.setTeaAllowanceOnAttnStatus = false;
      this.foodAllowancePolicyData.teaHalfDayAmount = null;
      this.foodAllowancePolicyData.teaFullDayAmount = null;
      this.deleteAllInTeaTimeValues();
    } else if (event.target.value == 'onInTime') {
      this.setTeaAllowanceOnInTime = true;
      this.setTeaAllowanceOnAttnStatus = false;
      this.noTeaAllowance = false;
      this.foodAllowancePolicyData.teaHalfDayAmount = null;
      this.foodAllowancePolicyData.teaFullDayAmount = null;

      if (this.inTimeTeaValues && this.inTimeTeaValues.length === 0) {
        this.addInTeaValue();
      } else {
        if (this.inTimeTeaValues.every((e) => e.isDeleted)) {
          this.addInTeaValue();
        }
      }
      if (this.shiftData && this.shiftData.length === 0) this.getShift();
    } else if (event.target.value == 'onAttnStatus') {
      this.setTeaAllowanceOnAttnStatus = true;
      this.setTeaAllowanceOnInTime = false;
      this.noTeaAllowance = false;
      this.deleteAllInTeaTimeValues();
    }
  }

  onBasisoFInTime(event) {
    if (event) {
      this.foodAllowanceOnBasisOfInTime = true;

      if (this.inTimeValues && this.inTimeValues.length === 0) {
        this.addInValue();
      } else {
        if (this.inTimeValues.every((e) => e.isDeleted)) {
          this.addInValue();
        }
      }

      if (this.shiftData && this.shiftData.length === 0) this.getShift();
    } else {
      this.foodAllowanceOnBasisOfInTime = false;

      this.deleteAllInTimeValues();
    }
  }

  onBasisoFOutTime(event) {
    if (event) {
      this.foodAllowanceOnBasisOfOutTime = true;
      if (this.outTimeValues && this.outTimeValues.length === 0) {
        this.addOutValue();
      } else {
        if (this.outTimeValues.every((e) => e.isDeleted)) {
          this.addOutValue();
        }
      }
      if (this.shiftData && this.shiftData.length === 0) this.getShift();
    } else {
      this.foodAllowanceOnBasisOfOutTime = false;
      this.foodAllowancePolicyData.foodAllowanceCompleteHours = false;

      this.deleteAllOutTimeValues();
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

  addInTeaValue() {
    this.inTimeTeaValues.push({
      inShiftID: null,
      inShiftType: 'in',
      inShiftTime: null,
      inShiftAmount: null,
      isDeleted: false,
    });
  }

  removeInTeaTimeValues(i: number) {
    let count = 0;
    this.inTimeTeaValues.forEach((element) => {
      if (element.isDeleted == false) {
        count += 1;
      }
    });

    if (count > 1) {
      this.inTimeTeaValues[i].isDeleted = true;
    } else {
      return;
    }


    
  }

  removeInTimeValues(i: number) {
    let count = 0;
    this.inTimeValues.forEach((element) => {
      if (element.isDeleted == false) {
        count += 1;
      }
    });

    if (count > 1) {
      this.inTimeValues[i].isDeleted = true;
    } else {
      return;
    }
  }

  removeOutTimeValues(i: number) {
    let count = 0;
    this.outTimeValues.forEach((element) => {
      if (element.isDeleted == false) {
        count += 1;
      }
    });

    if (count > 1) {
      this.outTimeValues[i].isDeleted = true;
    } else {
      return;
    }
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
}
