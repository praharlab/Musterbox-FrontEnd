import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-resignation-process',
    templateUrl: './edit-resignation-process.component.html',
    styleUrls: ['./edit-resignation-process.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditResignationProcessComponent implements OnInit {
  @ViewChild('editcomp') editcomp: NgForm;
  @ViewChild('addtable') addtable: NgForm;
  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  comp: any;
  adminRoot = environment.adminRoot;

  dbname1: any;
  tablename1: any;
  serialNo1: any;
  serialNumberIds: any = [];
  values = [];
  checkSerialNo: any;
  defaultTable: any;
  defaultSno: any;
  finalDBNAME: any;
  allcomp: any;
  company_id: any;
  finalholidaypolicy: any;
  alldepartment: any;
  allbranch: any;
  ownerList: any;
  resignProcessData: any | undefined;
  formValue: any;

  users_Body = {
    companyMasterID: '',
    designationID: '',
    branchMasterID: '',
  };

  departID: any;
  allusers: any = [];
  ownerList1: any;
  constructor(
    private spinner: NgxUiLoaderService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.company_id = localStorage.getItem('company_id');

    this.getIPAddress();
    this.getcompany();
    this.editData();
  }

  async selectbranch1(event: number): Promise<any> {
    // this.users_Body.branchMasterID = event;
    const filterData = {
      companyMasterID: this.company_id,
      branchMasterID: event,
    };

    return new Promise((resolve, reject) => {
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              resolve(res.data);
            } else {
              reject(new Error('Error retrieving data'));
            }
          },
          (error) => reject(error)
        );
    });
  }

  async editData(): Promise<void> {
    const id = this.formValue.ListResignationProcessComponent.id;

    this.spinner.start('start');
    this.api
      .callApi(this.constant.GETRESIGNPROCESSBYID + id, {}, 'GET', false, true, true)
      .subscribe(
        async (res: any) => {
          if (res.data) {
            this.resignProcessData = res.data;
            this.selectcompany(this.resignProcessData.companyMasterID);
            this.departID = +this.resignProcessData.departmentID;

            // Wait for each selectbranch1 call to complete before setting this.values
            this.values = await Promise.all(
              this.resignProcessData.resignTasks.map(async (task) => {
                const ownerList = task.userMaster.employeeBranches && task.userMaster.employeeBranches[0].branchMaster
                  ? await this.selectbranch1(task.userMaster.employeeBranches[0].branchID)
                  : [];

                return {
                  userMasterID: +task.userMasterID,
                  description: task.description,
                  branch:
                    task.userMaster.employeeBranches && task.userMaster.employeeBranches[0].branchMaster
                      ? task.userMaster.employeeBranches[0].branchMaster.branchName
                      : '',
                  ownerList: ownerList,
                  deleted: false,
                };

              })
            );
          } else {
            this.handleError(res.message);
          }
          this.spinner.stop('start');
        },
        (err) => {
          this.handleError(err.error.message);
          this.spinner.stop('start');
        }
      );
  }

  getcompany() {
    const body = {
      companyMasterID: this.company_id,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allcomp = res.data;

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
  selectcompany(event) {
    if (event) {
      this.company_id = event;
      this.finalholidaypolicy = '';
      this.alldepartment = []; // Clear the department list
      this.users_Body.companyMasterID = event;
      this.spinner.start('dep');
      this.api
        .callApi(this.constant.DEPARTMENTBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.alldepartment = res.data;
          this.spinner.stop('dep');
        });


      this.spinner.start('branch');
      this.api
        .callApi(this.constant.BRANCHBYCOMPANYDATA1 + event, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allbranch = res;
          this.spinner.stop('branch');
        });
      this.getUsers(); // Fetch users related to the company
    }
  }

  selectdepart(event) {
    this.getUsers();
  }

  getUsers() {
    this.spinner.start('users');
    this.api
      .callApi(this.constant.GETALLUSERS, this.users_Body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ownerList = res.data;
          this.allusers = res.data
        }
        this.spinner.stop('users');
      });
  }

  addvalue() {
    this.values.push({ branch: null, userMasterID: null, description: '', ownerList: this.allusers, deleted: false, });
  }
  removevalue(i) {
    this.values[i].deleted = true;
  }

  onSubmit() {   
    if (!this.editcomp.valid) {
      return;
    }
    this.values = this.values.filter(e => !e.deleted);
    const taskData = [];
    this.values.forEach((element) => {
      taskData.push({
        userMasterID: element.userMasterID,
        description: element.description,
      });
    });

    const formData = {
      companyMasterID: this.editcomp.value.company,
      departmentID: this.editcomp.value.department,
      taskData: taskData,
    };

    let id = this.formValue.ListResignationProcessComponent.id;

    this.api
      .callApi(this.constant.UPDATERESIGNPROCESS + id, formData, 'PUT', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.router.navigate([this.adminRoot + '/masters/clearance-and-exit']);
            }, 3000);
          } else {
            this.handleError(res.message);
          }
        },
        (err) => {
          this.handleError(err.error.message);
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

  selectbranch(event, i) {
    this.values[i].userMasterID = null;
    this.values[i].description = null

    if (event) {
      const filterData = {
        companyMasterID: this.company_id,
        branchMasterID: event,
      };
      this.spinner.start('users');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList1 = res.data;
            this.values[i].ownerList = res.data;
            this.spinner.stop('users');
          }
        });
    } else {
      const filterData = {
        companyMasterID: this.company_id,
      };
      this.spinner.start('userss');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList1 = res.data;
            this.values[i].ownerList = res.data;
            this.spinner.stop('userss');
          }
        });
    }
  }
}
