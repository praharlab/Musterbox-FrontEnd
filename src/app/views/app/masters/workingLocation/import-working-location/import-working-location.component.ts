import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-import-working-location',
    templateUrl: './import-working-location.component.html',
    styleUrls: ['./import-working-location.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportWorkingLocationComponent implements OnInit {
  @ViewChild('addimportuser') addimportuser: NgForm;
  @ViewChild('table') table: DatatableComponent;
  @ViewChild('tableForm') tableForm: NgForm;

  rows = [];
  ipAddress: any;
  selected = [];
  companyData: any;
  file: any;
  filterData = {
    companyMasterID: +localStorage.getItem('company_id'),
  };
  adminRoot = environment.adminRoot;
  remarksCount: any = 0;
  isEdited: any = true;
  isValidated: any = false;
  fileName: any = '';
  cityData: any;
  country: any = [];
  state: any = [];
  city: any = [];
  cityid: any;
  stateid: any;
  finalrows: any = [];
  branchData: any = [];

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.filterData.companyMasterID = +localStorage.getItem('company_id');
    this.getcompany();
    this.getIPAddress();
    this.getallcountry();
  }
  getallcountry() {
    let body = {
      page: '',
      limit: '',
    };
    this.api
      .callApi(this.constant.GETCOUNTRYDATA, body, 'POST', true, false, false)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.country = res.data;
        }
      });
  }
  getcompany() {
    const body = {
      companyMasterID: this.filterData.companyMasterID,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
          this.spinner.stop('company');
        } else {
          this.handleError(res.message);
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('company');
      },
    );
  }
  // getAllBranchByCompany(id: any) {
  //   if (id) {
  //     this.spinner.start('branch');
  //     this.api
  //       .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
  //       .subscribe((res: any) => {
  //         this.branchData = res;
  //         this.spinner.stop('branch');
  //       });
  //   }
  // }
  validateData() {
    if (!this.addimportuser.valid) return;
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('companyMasterID', this.addimportuser.value.company);

      this.spinner.start('validate');
      this.api
        .callApi(this.constant.VALIDATEWORKINGLOCATIONEXCEL, formData, 'POST', true, true, true)
        .subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.rows = res.data;
              // this.getAllBranchByCompany(this.addimportuser.value.company)
              const rowPromises = this.rows.map(async (row, index) => {
                const stateDropdown = await this.selectcountry(row.countryMasterID, index);
                const cityDropdown = await this.selectstate(row.stateMasterID, index);
                const selectcity = await this.selectcity(row.cityMasterID);

                return {
                  ...row,
                  selectcity,
                  stateDropdown,
                  cityDropdown,
                };
              });

              Promise.all(rowPromises).then((finalRows) => {
                this.finalrows = finalRows;
              });

              this.remarksCount = this.finalrows.filter(
                (item: any) => item.remarks !== '' && item.remarks !== null,
              ).length;
              this.notifications.create('Done', res.message, NotificationType.Bare, {
                theClass: 'outline primary',
                timeOut: 3000,
                showProgressBar: true,
              });
              this.isValidated = true;
              this.file = {};
              this.spinner.stop('validate');
            } else {
              this.file = {};
              this.handleError(res.message);
              this.spinner.stop('validate');
            }
          },
          (err) => {
            this.file = {};
            this.handleError(err.error.message);
            this.spinner.stop('validate');
          },
        );
    }
  }

  reValidateData() {
    if (!this.tableForm.valid) {
      return;
    }

    const dataArray = this.rows.map((item) => ({
      // branchMasterID: item.branchMasterID,
      workingLocationName: item.workingLocationName,
      latitude: item.latitude,
      longitude: item.longitude,
      radius: item.radius,
      workingLocationAddress: item.workingLocationAddress,
      cityMasterID: item.cityMasterID,
      countryMasterID: item.countryMasterID,
      stateMasterID: item.stateMasterID,
    }));
    this.spinner.start('revalidate');
    let body = {
      workingLocationData: dataArray,
      companyMasterID: this.addimportuser.value.company,
    };

    this.api
      .callApi(this.constant.REVALIDATEWORKINGLOCATIONDATA, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.rows = res.data;

            const rowPromises = this.rows.map(async (row, index) => {
              const stateDropdown = await this.selectcountry(row.countryMasterID, index);
              const cityDropdown = await this.selectstate(row.stateMasterID, index);
              const selectcity = await this.selectcity(row.cityMasterID);

              return {
                ...row,
                selectcity,
                stateDropdown,
                cityDropdown,
              };
            });

            Promise.all(rowPromises).then((finalRows) => {
              this.finalrows = finalRows;
            });
            this.remarksCount = this.rows.filter(
              (item: any) => item.remarks !== '' && item.remarks !== null,
            ).length;
            this.isEdited = this.remarksCount > 0;
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.spinner.stop('revalidate');
          } else {
            this.handleError(res.message);
            this.spinner.stop('revalidate');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('revalidate');
        },
      );
  }

  saveData() {
    if (!this.tableForm.valid) {
      return;
    }
    const dataArray = this.rows.map((item) => ({
      // branchMasterID: item.branchMasterID,
      workingLocationName: item.workingLocationName,
      latitude: item.latitude,
      longitude: item.longitude,
      radius: item.radius,
      workingLocationAddress: item.workingLocationAddress,
      cityMasterID: item.cityMasterID,
      countryMasterID: item.countryMasterID,
      stateMasterID: item.stateMasterID,
    }));
    this.spinner.start('saveData');
    let body = {
      workingLocationData: dataArray,
      companyMasterID: this.addimportuser.value.company,
    };
    this.api
      .callApi(this.constant.ADDVALIDATEWORKINGLOCATION, body, 'POST', false, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            this.rows = [];
            this.fileName = '';
            this.file = {};
            this.isValidated = false;
            setTimeout(() => {
              this.ngOnInit();
              this.spinner.stop('saveData');
            }, 3000);
          } else {
            this.handleError(res.message);
            this.spinner.stop('saveData');
          }
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('saveData');
        },
      );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onFileChange(event: any) {
    this.file = event.target.files && event.target.files[0];
    this.fileName = this.file.name;
    this.rows = [];
    this.isValidated = false;
    event.target.value = '';
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }
  private handleFileDownload(res: any) {
    var blob = new Blob([res], { type: 'text/xlsx' });
    saveAs(blob, 'Demo Working Location.xlsx');
    this.spinner.stop('start');
  }
  downloadDemoExcel() {
    this.spinner.start('start');

    let mainbody: any = {
      page: '',
      limit: '',
    };

    this.api
      .callApi(
        this.constant.GENERATEWORKINGLOCATIONDEMOEXCEL,
        mainbody,
        'POST',
        true,
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => this.handleFileDownload(res),
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        },
      );
  }

  addRow() {
    this.rows.push({
      remarks: '',
      // branchMasterID: '',
      workingLocationName: '',
      latitude: '',
      longitude: '',
      radius: '',
      workingLocationAddress: '',
      countryMasterID: null,
      stateMasterID: null,
      cityMasterID: null,
      stateDropdown: [],
      cityDropdown: [],
    });
    this.isEdited = true;
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
    this.isEdited = true;
  }

  clear() {
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.spinner.start('company');
    setTimeout(() => {
      this.ngOnInit();
      this.spinner.stop('company');
    }, 3000);
    this.isValidated = false;
  }

  onWorkingLocationDataChange(event) {
    this.isEdited = true;
  }

  prev() {
    this.router.navigate([this.adminRoot + '/masters/workingLocation']);
  }

  async selectcountry(countryID: string, rowIndex: number): Promise<any> {
    if (!countryID) return;

    this.spinner.start('selectcountry');
    try {
      const res = await this.api
        .callApi(this.constant.GETSTATEBYCOUNTRY + countryID, {}, 'GET', false, false, false)
        .toPromise();
      this.rows[rowIndex].stateDropdown = res.data; // Make sure to bind the response data
    } catch (err) {
      this.handleError(err.error.message);
    } finally {
      this.spinner.stop('selectcountry');
    }
  }

  async selectstate(stateID: string, rowIndex: number): Promise<any> {
    if (!stateID) return;

    this.spinner.start('selectstate');
    try {
      const res = await this.api
        .callApi(this.constant.GETCITYBYSTATE + stateID, {}, 'GET', false, false, false)
        .toPromise();
      this.rows[rowIndex].cityDropdown = res.data; // Make sure to bind the response data
    } catch (err) {
      this.handleError(err.error.message);
    } finally {
      this.spinner.stop('selectstate');
    }
  }

  selectcity(cityID: string): Promise<any> {
    return Promise.resolve(cityID); // Return the city directly
  }

  async Changeselectcountry(countryID: string, rowIndex: number): Promise<any> {
    if (!countryID) return;

    this.spinner.start('selectcountry');
    try {
      const res = await this.api
        .callApi(this.constant.GETSTATEBYCOUNTRY + countryID, {}, 'GET', false, false, false)
        .toPromise();
      this.rows[rowIndex].stateDropdown = res.data; // Make sure to bind the response data
      this.rows[rowIndex].stateMasterID = null; // Clear state and city when country changes
      this.rows[rowIndex].cityMasterID = null;
    } catch (err) {
      this.handleError(err.error.message);
    } finally {
      this.spinner.stop('selectcountry');
    }
  }

  async Changeselectstate(stateID: string, rowIndex: number): Promise<any> {
    if (!stateID) return;

    this.spinner.start('selectstate');
    try {
      const res = await this.api
        .callApi(this.constant.GETCITYBYSTATE + stateID, {}, 'GET', false, false, false)
        .toPromise();
      this.rows[rowIndex].cityDropdown = res.data; // Make sure to bind the response data
      this.rows[rowIndex].cityMasterID = null; // Clear city when state changes
    } catch (err) {
      this.handleError(err.error.message);
    } finally {
      this.spinner.stop('selectstate');
    }
  }

  Changeselectcity(cityID: string): Promise<any> {
    return Promise.resolve(cityID); // Return the city directly
  }

  companyChange(event) {
    this.filterData.companyMasterID = this.addimportuser.value.company;
    this.rows = [];
    this.fileName = '';
    this.file = {};
    this.isValidated = false;
  }
}
