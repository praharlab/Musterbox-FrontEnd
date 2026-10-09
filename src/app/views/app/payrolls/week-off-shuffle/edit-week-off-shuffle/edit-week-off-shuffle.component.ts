import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-edit-week-off-shuffle',
    templateUrl: './edit-week-off-shuffle.component.html',
    styleUrls: ['./edit-week-off-shuffle.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditWeekOffShuffleComponent implements OnInit {
  @ViewChild('addPayment') addPayment: NgForm;
  adminRoot = environment.adminRoot;

  datefilter = '';
  PaymentMode = '';
  refNo = '';
  refDate = '';
  expensefiltervalue: any;
  expense_data = [];
  amount = '';
  expensefiltervalueAfterSubmit: any;
  company_id: any;
  users_Body = {
    companyMasterID: '',
    branchMasterID: []
  }
  company1: any;
  alluser: any;
  allbranch: any;
  selectedBranch: any;
  selectedUser: any;
  formValue: any;
  getdata: any;
  userMasterID: '';
  remarks: '';
  weekoffShuffled: any;
  shuffled: any;
  userId: any;
  ipAddress: any;

  constructor(private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData(); 
     
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.users_Body = {
      companyMasterID: '',
      branchMasterID: [],
    }
    // this.getUsers();
    this.editdata();
    this.getIPAddress();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  }
  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('company');
        }
      });
  }

  getUsers() {
    this.users_Body.branchMasterID = this.users_Body.branchMasterID && this.users_Body.branchMasterID.length > 0 ? this.users_Body.branchMasterID : null

    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;

          this.selectAllForDropdownItems(this.alluser);
        }
        this.spinner.stop('users');
      });
  }

  selectcompany(id: any) {
    this.alluser = [];
    this.allbranch = [];

    this.selectedBranch = [];


    this.users_Body = {
      companyMasterID: '',
      branchMasterID: null,
    }

    if (!id) return;

    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.selectAllForDropdownItems(this.allbranch);
        this.spinner.stop('branch');
      });
    this.users_Body.companyMasterID = id;
    this.getUsers();
  }


  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  selectbranch() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.branchMasterID = this.addPayment.value.branch;
    this.getUsers();
  }
  // AddPayment


  editdata() {
    const id = this.formValue.ListWeekOffShuffleComponent.id
    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.GETWEEKOFFSHUFLLEBYID + id, {},
        'POST',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.getdata = res.data;
          this.userId = this.getdata.userMasterID;

          if (this.getdata.weekoffShuffled) {
            this.getdata.weekoffShuffled = this.formatDate(this.getdata.weekoffShuffled);
          }
          if (this.getdata.shuffled) {
            this.getdata.shuffled = this.formatDate(this.getdata.shuffled);
          }

          this.spinner.stop('data');
        },
        (err) => {
          this.handleCatchError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }


  onSubmit() {
    if (!this.addPayment.valid) {
      return;
    }

    const body = {
      userMasterID: this.userId,
      weekoffShuffled: this.addPayment.value.weekoffshuffled,
      shuffled: this.addPayment.value.shuffled,
      remarks: this.addPayment.value.remarks,
    };

    this.spinner.start('start');
    this.api
      .callApi(
        this.constant.UPDATEWEEKOFFSHUFLLE + this.formValue.ListWeekOffShuffleComponent.id,
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
              this.router.navigate([this.adminRoot + '/payrolls/weekoff_shuffle']);
            }, 3000);
          } else {
            this.handleError(res.message);

          }
          this.spinner.stop('start');

        },
        (err) => {

          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });

          this.spinner.stop('start');
        },
      );
  }


  handleCatchError(message: string) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
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
