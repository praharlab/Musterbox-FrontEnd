import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm, NgModel } from '@angular/forms';
import { saveAs } from 'file-saver';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { CommonFilterButtonFields, CommonFilterFields, ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-checklist-admin',
    templateUrl: './checklist-admin.component.html',
    styleUrls: ['./checklist-admin.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ChecklistAdminComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  hideFilters: CommonFilterFields[] = [CommonFilterFields.Status];
  showButtons: CommonFilterButtonFields[] = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  showExtraButton: boolean = false;

  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  // selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  filterData = {
    page: 1,
    limit: 10,
    userMasterID: [],
    searchQuery: '',
    toDate: '',
    fromDate: '',
    companyMasterID: localStorage.getItem('company_id'),
    checkListID: [],
  };
  page = {
    totalCount: 0,
    offset: 0,
  };

  permissioncreate = [];
  permissionedit = [];
  permissionview: any = [];
  permissiondelete = [];
  events: any;
  date: any;
  allChecklist: any = [];
  checkedCheckedList: any;

  selected: any[];
  allbranch: any[];

  adminRoot = environment.adminRoot;
  checkListData: any = [];
  selectedchecklist: string;
  showexport: boolean = false;

  constructor(
    private spinner: NgxUiLoaderService,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.checkpermission();
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
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
              permissionval.formName == 'AdminCheckList' &&
              permissionval.operationName.includes('View')
            );
          });

          this.spinner.stop();
        }
      });
  }
  updateFilter(event: any): void {
    if (event.target) {
      const val = event.target.value.toLowerCase().trim();
      this.events = val;
    }
    this.filterData.searchQuery = this.events;

    this.getAllAdminChecklist();
  }

  onSelect({ selected }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.rows];
    } else {
      this.selected = [];
    }
    // this.setSelectAllState();
  }
  onSubmit(val?: any) {
    if (new Date(val?.enddate) < new Date(val?.startdate)) {
      this.notifications.create('Error', 'Please Enter valid Date range', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }
    this.showexport = true;
    this.filterData.fromDate = val?.startdate;
    this.filterData.toDate = val?.enddate;
    this.filterData.userMasterID = val?.user;
    this.filterData.checkListID = val?.checklistID;

    this.getAllAdminChecklist()
  }

  onChange(e: any) {
    this.filterData.page = e.offset + 1;
    this.getAllAdminChecklist()
  }

  onLimitChange(ev: any) {
    this.filterData.limit = ev;
    this.getAllAdminChecklist()
  }
  showAddNewModal() {
    this.router.navigate([this.adminRoot + '/checklists/add_userCheckList']);
  }
  view(row: any) {
    this.getAllChecklist(row.checkListID, row);
  }

  getAllChecklist(id: any, editData: any) {
    this.allChecklist = [];
    if (id) {
      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLCHECKISTQBYUSER + id, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allChecklist = res.data;
            this.checkedCheckedList = editData.filledChecklistQID;
            for (var i = 0; i < this.allChecklist.length; i++) {
              if (editData.filledChecklistQID.includes(this.allChecklist[i].checkListQuestionID)) {
                this.allChecklist[i].status = true;
                let index = editData.filledChecklistQID.indexOf(this.allChecklist[i].checkListQuestionID);
                this.allChecklist[i].createdAt = editData.filledChecklistQDate[index]
              } else {
                this.allChecklist[i].status = false;
                this.allChecklist[i].createdAt = ''
              }
            }
            this.spinner.stop();
          }
        });
    }
  }

  downloadFilteredData(withdate: any) {

    let data = {
      page: '',
      limit: '',
      userMasterID: this.filterData.userMasterID,
      searchQuery: this.filterData.searchQuery,
      toDate: this.filterData.toDate,
      fromDate: this.filterData.fromDate,
      companyMasterID: this.filterData.companyMasterID,
      excelData: true,
      exportFileType: 'csv',
      checkListID: this.filterData.checkListID,
      withDate: withdate,
    };

    this.spinner.start('main');
    this.api
      .callApi(this.constant.LISTADMINCHECKLIST, data, 'POST', true, false, true, true)
      .subscribe((res: any) => {
        var blob = new Blob([res], { type: 'text/xlsx' });
        saveAs(blob, 'Checklist.xlsx');

        this.spinner.stop('main');
      }, (error) => {
        this.notifications.create('Error', error.error.message, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop('main');
      });
  }

  getChecklistData(companyMasterID: any){
    this.spinner.start();
    const filterData1 = {
      limit: '',
      page: '',
      searchQuery: '',
      companyMasterID: companyMasterID,
      designationId: '',
    };
    this.api
      .callApi(this.constant.GETALLCHECKLISTDATA, filterData1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.checkListData = res.data;
          this.selectAllForDropdownItems(this.checkListData);
          this.spinner.stop();
        }
      });
  }

  getAllAdminChecklist(){
    this.spinner.start('main');
    this.api
      .callApi(this.constant.LISTADMINCHECKLIST, this.filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.date = res.date;
          if(this.rows.length > 0){
            this.showExtraButton = true
            this.showButtons.push(CommonFilterButtonFields.Excel);
          }else{
            this.showExtraButton = false;
            this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
          }
          this.page.totalCount = res.totalcount;
        }
        this.spinner.stop('main');
      });
  }

  getCompany(companyMasterID: any){
    this.getChecklistData(companyMasterID);
  }

  clear(){
    this.rows = [];
    this.showExtraButton = false;
    this.showButtons = [CommonFilterButtonFields.Submit, CommonFilterButtonFields.Clear];
  }
}
