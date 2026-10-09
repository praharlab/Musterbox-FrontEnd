import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { UserFormValueStorageService } from 'src/app/services/user-form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-userprofile',
    templateUrl: './userprofile.component.html',
    styleUrls: ['./userprofile.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserprofileComponent implements OnInit {
  permissionview: any;
  rows: any = [];
  apiURL = environment.apiUrl;
  imgshow1: boolean;
  formValue: any;
  formUserID: any;

  // @Output() myEvent = new EventEmitter<boolean>();

  constructor(
    private lightbox: Lightbox,
    private api: ApiService,
    private constant: ConstantService,
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,
    private userFormValueStorageService: UserFormValueStorageService,
  ) {}

  ngOnInit() {
    this.formValue = this.formValueStorageService.getData();

    this.formUserID = this.userFormValueStorageService.getData();

    this.alldata();

    this.checkpermission();
  }

  openLightbox(src: string): void {
    this.lightbox.open([{ src, thumb: '' }], 0, {
      centerVertically: true,
      positionFromTop: 0,
      disableScrolling: true,
      wrapAround: true,
    });
  }

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'DailyAttendance' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }

  alldata() {
    if (this.formUserID != null) {

      let filterData = {
        userMasterID: this.formUserID,
      };
      this.spinner.start();

      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.rows = res.data;
            this.spinner.stop();
          }
        });
      if (this.rows.photo != '' && this.rows.photo != null) {
        var img = new Image();
        img.src = this.apiURL + 'uploads/user/photo/' + this.rows.photo;

        if (img.complete) {
          this.imgshow1 = true;
        } else {
          img.onload = () => {
            this.imgshow1 = true;
          };

          img.onerror = () => {
            this.imgshow1 = false;
          };
        }
      } else {
        this.imgshow1 = false;
      }
    }
  }
}
