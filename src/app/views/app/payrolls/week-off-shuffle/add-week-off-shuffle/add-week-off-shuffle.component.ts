import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent, id, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';

@Component({
    selector: 'app-add-week-off-shuffle',
    templateUrl: './add-week-off-shuffle.component.html',
    styleUrls: ['./add-week-off-shuffle.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddWeekOffShuffleComponent implements OnInit {
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
  userMasterID = [];
  remarks: '';

  constructor(private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,) { }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.getcompany();
    this.users_Body = {
      companyMasterID: '',
      branchMasterID: [],
    }
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
    ``
    allSelect(items);
  }

  selectbranch() {
    this.alluser = [];
    this.selectedUser = [];
    this.users_Body.branchMasterID = this.addPayment.value.branch;
    this.getUsers();
  }

  onSubmit() {
    if (!this.addPayment.valid) {
      return;
    }
    let body = {
      userMasterID : this.addPayment.value.user,
      weekoffShuffled : this.addPayment.value.weekoffshuffled,
      shuffled : this.addPayment.value.shuffled,
      remarks : this.addPayment.value.remarks,
    }

    this.spinner.start('AddPayment');
    this.api
      .callApi(this.constant.ADDWEEKOFFSHUFLLE, body, 'POST', true, true, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/payrolls/weekoff_shuffle']);
          }, 3000);
          this.spinner.stop('submit');
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('AddPayment');
        }
      });
  }

}

