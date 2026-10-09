import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'app-fnf-assets',
    templateUrl: './fnf-assets.component.html',
    styleUrls: ['./fnf-assets.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FnfAssetsComponent implements OnInit {
  @ViewChild('addcomp2') addcomp2: NgForm;
  @ViewChild('closeModal') closeModal: ElementRef;
  apiURL = environment.apiUrl;
  applicationData: any = []
  showloader: boolean = false
  userMasterID: any
  editbyid: any;
  currDate: any = new Date().toISOString().slice(0, 10);
  minDate: any;
  buttonDisabled = false;
  buttonState = ''
  @Output('isAssetCompleted') isAssetCompleted = new EventEmitter<boolean>();
  @Output('reloadAsset') reloadAsset = new EventEmitter<any>();

  constructor(
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void { }

  getUserAssets() {
    this.showloader = true;
    this.api
      .callApi(
        this.constant.GETPENDINGASSETS + this.userMasterID,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.showloader = false;
          this.applicationData = res.data;
          if (this.applicationData.length == 0) {
            this.isAssetCompleted.emit(true)
          } else {
            this.isAssetCompleted.emit(false)
          }
        },
        (err) => {
          this.commonNotificationService.handleError(err.error.message);
          this.showloader = false;
        },
      );
  }

  return(application) {
    this.minDate = application.assignDate;
    this.editbyid = application;
  }

  onSubmit2() {
    if (!this.addcomp2.valid) {
      return;
    }

    const body = {
      assignAssetToEmployeeID: this.editbyid.assignAssetToEmployeeID,
      returnDate: this.addcomp2.value.returnDate,
    };

    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.showloader = true;
    this.api.callApi(this.constant.RETURNEMPLOYEEASSIGN, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message)
          this.reloadAsset.emit();
          this.closeModal.nativeElement.click();
        } else {
          this.commonNotificationService.handleError(res.message);

        }
        this.showloader = false;
        this.buttonDisabled = false;
        this.buttonState = ''
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.showloader = false;

        this.buttonDisabled = false;
        this.buttonState = ''

      },
    );
  }

  viewDocument(attachment) {
    window.open(`${this.apiURL}uploads/resignation/${attachment}`, '_blank');
  }
}
