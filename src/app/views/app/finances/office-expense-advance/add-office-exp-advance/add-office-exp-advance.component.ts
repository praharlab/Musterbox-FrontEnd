import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { officeExpenseAdvanceTransactionType } from 'src/app/constants/commonVariables';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-office-exp-advance',
    templateUrl: './add-office-exp-advance.component.html',
    styleUrls: ['./add-office-exp-advance.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddOfficeExpAdvanceComponent implements OnInit {
  @ViewChild('addOfficeExpenseAdvance') addOfficeExpenseAdvance: NgForm;
  adminRoot = environment.adminRoot

  companyData: any = [];
  branchData: any = [];
  siteData: any = [];
  userData: any = [];

  filterData = {
    companyMasterID: null,
    branchMasterID: undefined,
    siteID: null
  }
  
  selectedUser: any = null;
  selectedPaymentMode: any = null;
  selectedTransactionType: any = null;
  maxDate: any

  officeExpenseAdvanceTransactionTypes = officeExpenseAdvanceTransactionType

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private commonNotificationService: CommonNotificationService
  ) { }

  ngOnInit(): void {
    this.getCompany()
    this.maxDate = new Date().toISOString().split('T')[0];
  }

  getCompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
          const currentCompany = +localStorage.getItem('company_id');
          this.selectCompany(currentCompany);
          this.spinner.stop('company');
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }

  getAllBranches(id?: any) {
    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.branchData = res;
        this.spinner.stop('branch');
      });
  }

  getAllUsers() {
    const body = {
      branchMasterID: this.filterData.branchMasterID,
      siteID: this.filterData.siteID
    }
    this.spinner.start('user');
    this.api.callApi(this.constant.GETASSIGNEDUSERSBYBRANCHANDSITE, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.userData = res.data;
        }
        this.spinner.stop('user');
      },
      (error) => {
        this.spinner.stop('user');
      },
    );
  }

  getAllSites() {
    this.spinner.start('getAllSites');
    this.api
      .callApi(this.constant.LISTSITE, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.siteData = res.data;
        this.spinner.stop('getAllSites');
      });
  }


  selectCompany(companyMasterID: any){
    this.filterData.branchMasterID = null;
    this.filterData.siteID = null;
    this.selectedUser = null;
    this.branchData = [];
    this.siteData = [];
    this.userData = [];
    this.filterData.companyMasterID = companyMasterID;
    if(!companyMasterID) return;
    this.getAllBranches(companyMasterID);
  }
  
  selectBranch(branchMasterID: any){
    this.filterData.siteID = null;
    this.filterData.branchMasterID = branchMasterID;
    this.selectedUser = null;
    this.getAllSites();
    this.getAllUsers();
  }
  
  selectSite(siteID: any){
    this.selectedUser = null;
    this.filterData.siteID = siteID
    this.getAllUsers();
  }

  onSubmit(){
    if(!this.addOfficeExpenseAdvance.valid) return;
    const body = {
      branchMasterID: this.addOfficeExpenseAdvance.value?.branch,
      siteID: this.addOfficeExpenseAdvance.value?.siteID,
      userMasterID: this.addOfficeExpenseAdvance.value?.user,
      amount: this.addOfficeExpenseAdvance.value?.amount,
      date: this.addOfficeExpenseAdvance.value?.date,
      transactionType: this.addOfficeExpenseAdvance.value?.transactionType,
      paymentMode: this.addOfficeExpenseAdvance.value?.paymentMode,
      referenceNo: this.addOfficeExpenseAdvance.value?.referenceNo,
      referenceDate: this.addOfficeExpenseAdvance.value?.referenceDate,
      remarks: this.addOfficeExpenseAdvance.value?.remarks,
    }

    this.spinner.start('CREDITDEBITOFFICEEXPENSEADVANCE');
    this.api.callApi(this.constant.CREDITDEBITOFFICEEXPENSEADVANCE, body, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/finances/officeExpenseAdvance']).then(() => {
              this.spinner.stop('CREDITDEBITOFFICEEXPENSEADVANCE');
            });
          }, 3000);
        } else {
          this.commonNotificationService.handleError(res.message);
          this.spinner.stop('CREDITDEBITOFFICEEXPENSEADVANCE');
        }
      },
      (err) => {
        this.commonNotificationService.handleError(err.error.message);

        this.spinner.stop('CREDITDEBITOFFICEEXPENSEADVANCE');
      },
    );
  }

}
