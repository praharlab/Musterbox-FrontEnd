import { Component, ViewChild, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-view-food-allowance-policy',
    templateUrl: './view-food-allowance-policy.component.html',
    styleUrls: ['./view-food-allowance-policy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ViewFoodAllowancePolicyComponent implements OnInit {
  id: any;
  company_id: any;

  @Input()
  set getFoodAllowancePolicyID(getFoodAllowancePolicyID: any) {
    this.id = getFoodAllowancePolicyID;
  }
  adminRoot = environment.adminRoot;
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
    public datepipe: DatePipe,
    public activatedRoute: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.editdata(this.id);
    }
  }

  editdata(id: any) {
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETFOODALLOWANCEPOLICYBYID + id, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.foodAllowancePolicyData = res.data;

          this.company_id = this.foodAllowancePolicyData.companyMasterID;

          if (this.foodAllowancePolicyData.foodAllowanceType == 'noFoodAllowance') {
            this.noFoodAllowance = true;
            this.setFoodAllowanceOnWorkingHours = false;
            this.setFoodAllowanceOnInOutTime = false;
            this.foodAllowanceOnBasisOfInTime = false;
            this.foodAllowanceOnBasisOfOutTime = false;
            this.inTimeValues = [];
            this.outTimeValues = [];
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
            this.inTimeValues = [];
            this.outTimeValues = [];

            this.setInOutValues(
              this.foodAllowancePolicyData.foodAllowancePolicyDetails.filter(
                (e) => e.allowanceType == 'food',
              ),
            );
          }
          if (this.foodAllowancePolicyData.foodAllowanceType == 'onWorkingHours') {
            this.setFoodAllowanceOnWorkingHours = true;
            this.setFoodAllowanceOnInOutTime = false;
            this.foodAllowanceOnBasisOfInTime = false;
            this.foodAllowanceOnBasisOfOutTime = false;
            this.noFoodAllowance = false;

            this.inTimeValues = [];
            this.outTimeValues = [];
            this.foodAllowanceCompleteHours = false;
          }

          if (this.foodAllowancePolicyData.teaAllowanceType == 'noTeaAllowance') {
            this.noTeaAllowance = true;
            this.setTeaAllowanceOnAttnStatus = false;
            this.setTeaAllowanceOnInTime = false;
            this.inTimeTeaValues = [];
          } else if (this.foodAllowancePolicyData.teaAllowanceType == 'onInTime') {
            this.setTeaAllowanceOnInTime = true;
            this.setTeaAllowanceOnAttnStatus = false;
            this.noTeaAllowance = false;
            this.inTimeTeaValues = [];

            this.setInTeaValues(
              this.foodAllowancePolicyData.foodAllowancePolicyDetails.filter(
                (e) => e.allowanceType == 'tea',
              ),
            );
          } else if (this.foodAllowancePolicyData.teaAllowanceType == 'onAttnStatus') {
            this.setTeaAllowanceOnInTime = false;
            this.setTeaAllowanceOnAttnStatus = true;
            this.noTeaAllowance = false;
            this.inTimeTeaValues = [];
          }

          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
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

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
}
