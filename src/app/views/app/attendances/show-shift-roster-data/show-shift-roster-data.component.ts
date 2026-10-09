import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment'
@Component({
    selector: 'app-show-shift-roster-data',
    templateUrl: './show-shift-roster-data.component.html',
    styleUrls: ['./show-shift-roster-data.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ShowShiftRosterDataComponent implements OnInit {
  @ViewChild('tableForm') tableForm: NgForm;

  @Input('permissioncreate') permissioncreate: any = [];
  @Input('permissionview') permissionview: any = [];
  @Input('rows') rows = [];
  @Input('dateRange') dateRange = [];
  @Input('allshift') allshift = [];
  @ViewChild('weekOffShuffleModal', { static: false }) weekOffShuffleModal: ModalDirective;
  @ViewChild('closeModal') closeModal: ElementRef;

  @ViewChild('weekOffShuffleForm') weekOffShuffleForm: NgForm;

  @Output() onSaveData: EventEmitter<void> = new EventEmitter();

  selectedUsers: any = [];
  currentData: any
  currentUserData: any
  showShuffle: any = 'true';
  showShuffleFields: any = 'true';

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,) { }

  ngOnInit(): void {
  }

  saveData() {
    if (!this.tableForm.valid) {
      return;
    }
    this.onSaveData.emit();
  }

  onChange(data, item) {
    this.currentData = data;
    this.currentUserData = item;
    this.showShuffle = 'true'
    this.showShuffleFields = 'true'
    setTimeout(() => {

      if (data.isWeekOff == false) {
        this.weekOffShuffleForm.form.get('weekoffshuffled').setValue(data.shiftRosterDate)
      } else {
        this.weekOffShuffleForm.form.get('shuffled').setValue(data.shiftRosterDate)
      }
      this.weekOffShuffleForm.form.get('userMasterID').setValue(data.userMasterID)
      this.weekOffShuffleForm.form.get('isWeekOff').setValue(data.isWeekOff)
      this.weekOffShuffleForm.form.get('currentDate').setValue(data.shiftRosterDate)

    }, 0);
    this.weekOffShuffleModal.show();

  }


  onaddsamAsMainTaskChange(event) {
    // this.values = [];
    const data = this.currentData
    this.showShuffle = 'true';
    this.showShuffleFields = event.target.value;
    if (event.target.value == 'true') {
      setTimeout(() => {
        if (data.isWeekOff == false) {
          this.weekOffShuffleForm.form.get('weekoffshuffled').setValue(data.shiftRosterDate)
        } else {
          this.weekOffShuffleForm.form.get('shuffled').setValue(data.shiftRosterDate)
        }
        this.weekOffShuffleForm.form.get('userMasterID').setValue(data.userMasterID)
        this.weekOffShuffleForm.form.get('isWeekOff').setValue(data.isWeekOff)
        this.weekOffShuffleForm.form.get('currentDate').setValue(data.shiftRosterDate)
      }, 0);
    }
    // this.addValuesWithSame();
  }
  onSubmit() {
    if (!this.weekOffShuffleForm.valid) {
      return;
    }
    if (this.showShuffle == 'true' && this.showShuffleFields == 'true') {
      let body = {
        userMasterID: [this.weekOffShuffleForm.value.userMasterID],
        weekoffShuffled: this.weekOffShuffleForm.value.weekoffshuffled,
        shuffled: this.weekOffShuffleForm.value.shuffled,
        remarks: this.weekOffShuffleForm.value.remarks,
      }
      this.spinner.start('AddPayment');
      this.api
        .callApi(this.constant.ADDWEEKOFFSHUFLLE, body, 'POST', true, true, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            if (res.addedCount > 0) {
              this.currentUserData.rosterData.forEach(e => {
                if (e.shiftRosterDate == this.weekOffShuffleForm.value.shuffled) {
                  e.isWeekOff = true
                }
                if (e.shiftRosterDate == this.weekOffShuffleForm.value.weekoffshuffled) {
                  e.isWeekOff = false
                }
              })
            } else {
              this.currentUserData.rosterData.forEach(e => {
                if (e.shiftRosterDate == this.weekOffShuffleForm.value.shuffled) {
                  e.isWeekOff = false
                }
                if (e.shiftRosterDate == this.weekOffShuffleForm.value.weekoffshuffled) {
                  e.isWeekOff = true
                }
              })
            }
            setTimeout(() => {
              this.spinner.stop('AddPayment');
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.weekOffShuffleModal.hide();
              this.weekOffShuffleForm.resetForm();
            }, 3000);

          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('AddPayment');
          }
        });
    } else {
      let body = {
        userMasterID: this.weekOffShuffleForm.value.userMasterID,
        date: this.weekOffShuffleForm.value.currentDate,
        isWeekOff: this.weekOffShuffleForm.value.isWeekOff,
      }
      this.spinner.start('AddPayment');
      this.api
        .callApi(this.constant.CHANGEWEEKOFF, body, 'POST', true, true, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            // if (res.addedCount > 0) {
            //   this.currentUserData.rosterData.forEach(e => {
            //     if (e.shiftRosterDate == this.weekOffShuffleForm.value.currentDate) {
            //       e.isWeekOff = true
            //     }
            //     if (e.shiftRosterDate == this.weekOffShuffleForm.value.weekoffshuffled) {
            //       e.isWeekOff = false
            //     }
            //   })
            // } else {
            //   this.currentUserData.rosterData.forEach(e => {
            //     if (e.shiftRosterDate == this.weekOffShuffleForm.value.shuffled) {
            //       e.isWeekOff = false
            //     }
            //     if (e.shiftRosterDate == this.weekOffShuffleForm.value.weekoffshuffled) {
            //       e.isWeekOff = true
            //     }
            //   })
            // }
            setTimeout(() => {
              this.spinner.stop('AddPayment');
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.weekOffShuffleModal.hide();
              this.weekOffShuffleForm.resetForm();
              this.showShuffle == 'true'
            }, 500);

          } else {
            this.notifications.create('Error', res.message, NotificationType.Error, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            });
            this.spinner.stop('AddPayment');
          }
        });
      // setTimeout(() => {
      //   this.weekOffShuffleModal.hide();
      //   this.weekOffShuffleForm.resetForm();
      //   this.showShuffle == 'true'
      // }, 500);
    }
  }

  resetForm() {
    this.weekOffShuffleForm.resetForm();
    this.currentData.isWeekOff = !this.currentData.isWeekOff;
  }
}
