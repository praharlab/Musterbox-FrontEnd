import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-bank-branch',
    templateUrl: './edit-bank-branch.component.html',
    styleUrls: ['./edit-bank-branch.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditBankBranchComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  companydata: any = [];
  adminRoot = environment.adminRoot;
  formValue: any;
  allBank: any = []
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();
    this.getBankData()

    this.getIPAddress();
    this.editdata();
  }
  getBankData() {
    const filterData = {
      page: '',
      limit: '',
      searchQuery: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETBANKDATA, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allBank = res.data;
          this.spinner.stop();
        }
      });
  }
  editdata() {
    let queryString = `?bankBranchID=${this.formValue.ListBankBranchComponent.id}`;
    this.spinner.start('edit');
    this.api
      .callApi(this.constant.GETBANKBRANCHBYID + queryString, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.companydata = res.data;
          // this.selectcompany(this.editData.companyMasterID)
          this.spinner.stop('edit');
        },
        (err) => {
          this.spinner.stop('edit');
          this.handleError(err.error.message);
        },
      );
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    let body = {
      bankBranchID: this.formValue.ListBankBranchComponent.id,
      bankMasterID: this.companydata.bankMasterID,
      bankBranchName: this.addcomp.value.bankBranchName,
      bankBranchCode: this.addcomp.value.bankBranchCode,
    };
    this.spinner.start('submit');
    this.api.callApi(this.constant.EDITBANKBRANCH, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/superadminmenus/bankBranch']);
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.handleError(res.message);
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('submit');
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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
