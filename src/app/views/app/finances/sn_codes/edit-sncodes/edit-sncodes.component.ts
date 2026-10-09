import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { labelUtils } from 'src/app/constants/labelUtils';

@Component({
    selector: 'app-edit-sncodes',
    templateUrl: './edit-sncodes.component.html',
    styleUrls: ['./edit-sncodes.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditSncodesComponent implements OnInit {
  @ViewChild('edit_sncodes') edit_sncodes: NgForm;
  ipAddress: any;
  company: any = [];
  usertype: any;
  company_id: any;
  buttonDisabled = false;
  buttonState = '';
  childcompany: string;
  adminRoot = environment.adminRoot;
  allcomp: any;
  allbranch: any[];
  alldepartment: any[];
  ownerList: any[];
  finalbranch: string;
  finalholidaypolicy: string;
  selected: any[];
  sn_codeData: any;
  formValue: any;
  tankhwaPatraNameLabel: string = labelUtils.tankhwaPatraNameLabel;
  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) {}

  ngOnInit(): void {

    this.formValue = this.formValueStorageService.getData();

    this.childcompany = localStorage.getItem('childcompany');
    this.usertype = localStorage.getItem('usertype');
    this.company_id = Number(localStorage.getItem('company_id'));
    this.getIPAddress();
    this.getcompany();
    this.editdata();
  }

  editdata() {
    let sncodeID = this.formValue.ListSncodesComponent.id;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETSNCODESBYID + sncodeID, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.sn_codeData = res.data;
          this.sn_codeData.userMaster.companyMasterId =
            +this.sn_codeData.userMaster.companyMasterId;
          let temp = this.sn_codeData.userMasterID;
          this.selectcompany(this.sn_codeData.userMaster.companyMasterId);
          this.sn_codeData.userMasterID = temp;
          this.spinner.stop('edit');
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('edit');
        },
      );
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;

          this.spinner.stop();
        }
      });
  }
  selectcompany(event) {
    this.ownerList = [];
    this.allbranch = [];
    this.alldepartment = [];
    this.sn_codeData.userMasterID = null;
    this.finalbranch = '';
    this.selected = [];
    this.finalholidaypolicy = '';

    if (event) {
      const filterData = {
        page: '',
        limit: '',
        companyMasterID: event,
      };
      this.company_id = event;
      this.spinner.start('emp');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.displayName + ' (' + el.userNumber + ')';
            });
            this.spinner.stop('emp');
          }
        });
    }
  }

  selectbranch(event) {
    this.selected = [];
    this.finalholidaypolicy = '';

    if (event) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: event,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
            });
            this.spinner.stop();
          }
        });
    } else {
      const filterData = {
        companyMasterID: this.company_id,
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.ownerList.map((el) => {
              el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
            });
            this.spinner.stop();
          }
        });
    }
  }

  onSubmit() {
    if (!this.edit_sncodes.valid) {
      return;
    }
    let  body = {
      companyMasterID: this.sn_codeData.userMaster.companyMasterId,
      sn_codeID: this.formValue.ListSncodesComponent.id,
      sn_code: this.edit_sncodes.value.sn_code,
      tankhwaPatra_code: this.edit_sncodes.value.tankhwaPatra_code,
      userMasterID: this.sn_codeData.userMasterID,
      updateBy: localStorage.getItem('id'),
      updateByIp: this.ipAddress,
    };

    this.spinner.start();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.api.callApi(this.constant.UPDATESNCODES, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/finances/sn_codes']);
            this.buttonDisabled = false;
            this.buttonState = '';
            this.spinner.stop();
          }, 3000);
        } else {
          this.buttonDisabled = false;
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.spinner.stop();
        }
      },
      (err) => {
        this.buttonDisabled = false;
        this.notifications.create('Error', err.error.message, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.buttonDisabled = false;
        this.buttonState = '';
        this.spinner.stop();
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
}
