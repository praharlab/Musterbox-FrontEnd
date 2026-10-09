import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { officeExpenseTypeArray, officeExpenseTypes } from 'src/app/constants/commonVariables';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-allocate-ofc-expense-rights',
    templateUrl: './edit-allocate-ofc-expense-rights.component.html',
    styleUrls: ['./edit-allocate-ofc-expense-rights.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAllocateOfcExpenseRightsComponent implements OnInit {

  @ViewChild('allocationEditForm') allocationEditForm: NgForm;

  company_id: any
  company: any = []
  allbranch: any = []
  allSites: any = []
  allUsers: any = []
  selectedBranch: any
  adminRoot = environment.adminRoot
  editData: any
  formValue: any
  officeExpenseTypeArrayData = officeExpenseTypeArray;
  officeExpenseTypes = officeExpenseTypes;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id');
    this.getcompany();
    this.formValue = this.formValueStorageService.getData();
    const allocateOfficeExpenseRightsID = this.formValue.ListAllocateOfcExpenseRightsComponent.id;
    if(allocateOfficeExpenseRightsID)
    this.getEditData(allocateOfficeExpenseRightsID);
  }

  getEditData(allocateOfficeExpenseRightsID: any) {
    this.spinner.start('GETOFFICEEXPENSEALLOCATIONRIGHTSBYID');
    this.api
      .callApi(this.constant.GETOFFICEEXPENSEALLOCATIONRIGHTSBYID + allocateOfficeExpenseRightsID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editData = res.data;
          this.selectCompany(this.company_id);
          if(this.editData?.branchMasterID)
          this.getAllSites(this.editData?.branchMasterID)
          this.spinner.stop('GETOFFICEEXPENSEALLOCATIONRIGHTSBYID');
        }
      });
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.company = res.data;
          this.spinner.stop();
        }
      });
  }

  selectCompany(companyMasteID: number) {
    this.company_id = companyMasteID
    this.getAllBranches(companyMasteID);
    this.getAllUsers()
  }

  getAllBranches(companyMasterID: number) {
    this.spinner.start('getAllbranches');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + companyMasterID, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('getAllbranches');
      });
  }

  selectBranch(branchMasterID: number){
    this.editData.siteID = null
    this.getAllSites(branchMasterID);
  }

  getAllSites(branchMasterID: number) {
    this.spinner.start('getAllSites');
    this.api
      .callApi(this.constant.LISTSITE, { branchMasterID, companyMasterID: this.company_id }, 'POST', true, false, true)
      .subscribe((res: any) => {
        this.allSites = res.data;
        this.spinner.stop('getAllSites');
      });
  }

  onSubmit(){
    if(!this.allocationEditForm.valid) return;

    const body: any = {
      allocateOfficeExpenseRightsID: this.editData?.allocateOfficeExpenseRightsID,
      siteID : this.editData.siteID,
      branchMasterID : this.editData?.branchMasterID,
      userMasterID : this.editData?.userMasterID
    }

    this.spinner.start('UPDATEOFFICEEXPENSEALLOCATIONRIGHTS');
    this.api
      .callApi(this.constant.UPDATEOFFICEEXPENSEALLOCATIONRIGHTS, body, 'PUT', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.spinner.stop('UPDATEOFFICEEXPENSEALLOCATIONRIGHTS');
            this.cancel()
          }, 3000);
        }else{
          this.spinner.stop('UPDATEOFFICEEXPENSEALLOCATIONRIGHTS');
        }
      },(err) => {
        this.spinner.stop('UPDATEOFFICEEXPENSEALLOCATIONRIGHTS');
        this.commonNotificationService.handleError(err.error.message)
      });

  }

  getAllUsers(){
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, {
        companyMasterID: this.company_id
      }, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allUsers = res.data;
          this.selectAllForDropdownItems(this.allUsers);
          this.spinner.stop();
        }
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

  cancel(){
    this.router.navigate([this.adminRoot + '/finances/allocateOfcExpRights']);
  }
}
