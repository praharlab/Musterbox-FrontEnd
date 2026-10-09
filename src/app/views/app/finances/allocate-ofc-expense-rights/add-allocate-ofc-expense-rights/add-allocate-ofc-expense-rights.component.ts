import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { officeExpenseTypeArray, officeExpenseTypes } from 'src/app/constants/commonVariables';
import { ApiService } from 'src/app/services/api.service';
import { CommonNotificationService } from 'src/app/services/common-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-allocate-ofc-expense-rights',
    templateUrl: './add-allocate-ofc-expense-rights.component.html',
    styleUrls: ['./add-allocate-ofc-expense-rights.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddAllocateOfcExpenseRightsComponent implements OnInit {

  @ViewChild('allocationAddForm') allocationAddForm: NgForm;

  company_id: any
  company: any = []
  allbranch: any = []
  allSites: any = []
  allUsers: any = []
  selectedBranch: any
  selectedSite: any
  adminRoot = environment.adminRoot
  officeExpenseTypeArrayData = officeExpenseTypeArray;
  officeExpenseTypes = officeExpenseTypes;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private api: ApiService,
    private constant: ConstantService,
    private commonNotificationService: CommonNotificationService,
  ) { }

  ngOnInit(): void {
    this.company_id = +localStorage.getItem('company_id')
    this.getcompany()
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
          this.selectCompany(this.company_id);
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
    if(!this.allocationAddForm.valid) return;

    const body: any = {}
    body.siteID = this.allocationAddForm.value?.site
    body.branchMasterID = this.allocationAddForm.value?.branch
    body.userMasterID = this.allocationAddForm.value?.user

    this.spinner.start();
    this.api
      .callApi(this.constant.ADDALLOCATEOFFICEEXPENSERIGHTS, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.commonNotificationService.handleSuccess(res.message);
          setTimeout(() => {
            this.cancel()
          }, 3000);
        }else{
          this.spinner.stop();
        }
      },(err) => {
        this.spinner.stop();
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
