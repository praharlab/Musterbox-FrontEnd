import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { UserFormValueStorageService } from 'src/app/services/user-form-value-storage.service';

@Component({
    selector: 'app-edit-user-ip',
    templateUrl: './edit-user-ip.component.html',
    styleUrls: ['./edit-user-ip.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditUserIpComponent implements OnInit {
  @ViewChild('addtask') addtask: NgForm;
  @ViewChild('accept') accept: NgForm;
  apiURL = environment.apiUrl;
  adminRoot = environment.adminRoot;

  images: any = [];
  values: any = [];
  file: any = [];
  taskName: any;
  company_id: any;
  empList: any;
  taskdata: any;
  taskdata1: any;
  fileToUpload: any;
  imageUrl: any;
  taskSummary: any;
  taskStatus: any;
  selected1: any = [];
  alluser: any;
  selected: any = [];
  ipAddress: any;
  rowshow: any;
  priority: any;
  taskauth: any;
  getStatus: any;
  date: any;
  url: any;
  datashow: any;
  leaveshow: any;
  day: any;
  format: any;
  allcomp: any;
  usertype: any;
  childcompany: any;
  finalholidaypolicy: string;
  ownerList: any;
  finalbranch: string;
  allbranch: any[];
  edit_Data: any;
  formValue: any;
  selectedUser:any;
  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
    private userFormValueStorageService: UserFormValueStorageService,
  ) { }

  ngOnInit(): void {
    this.formValue = this.userFormValueStorageService.getData();


    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');
    this.company_id = localStorage.getItem('company_id');
    this.editData();
    // this.getcompany();
    this.getallemployee();
    this.getIPAddress();
  }

  getcompany() {
    if (this.usertype == 2) {
      const body = {
        page: '',
        limit: '',
      };
      this.spinner.start();
      this.api
        .callApi(this.constant.GETCOMPANYDATA, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.allcomp = res.data;
            this.spinner.stop();
          }
        });
    } else {
      const body = {
        companyMasterID: this.company_id,
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
  }
  editData() {
    const id = this.userFormValueStorageService.getData();
  
    this.spinner.start('editData');
    this.api
      .callApi(this.constant.GETBYUSERIP + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.edit_Data = res.data;
  
          // Extract userMaster details if they are nested
          if (this.edit_Data.userMaster) {
            this.edit_Data.userMasterID = this.edit_Data.userMaster.userMasterID;
            this.edit_Data.userMaster.displayName = this.edit_Data.userMaster.displayName;
          }
  
  
          // Optionally fetch all users if needed
          const boddy = {
            companyMasterID: this.edit_Data['userMaster.companyMaster.companyMasterID'],
          };
          this.api
            .callApi(this.constant.GETALLUSERS, boddy, 'POST', true, false, true)
            .subscribe((userRes: any) => {
              if (userRes.status === 200) {
                this.ownerList = userRes.data;
                // Optionally set selected user
                this.selectedUser = this.ownerList.find(user => user.userMasterID === this.edit_Data.userMasterID);
                this.spinner.stop('getuser');
              }
            });
  
          this.spinner.stop('editData');
        }
      });
  }
  
  

  onSubmit() {
    if (!this.addtask.valid) {
      return;
    }

    const body1 = {
      userMasterID: this.addtask.value.userMasterID,
      ip: this.addtask.value.taskname
    }

    const formData = new FormData();
    const id = this.userFormValueStorageService.getData()
    formData.append('userMasterID', this.addtask.value.userMasterID);
    formData.append('ip', this.addtask.value.taskname);
    this.spinner.start('add');
    this.api

      .callApi(
        this.constant.UPDATEUSERIP + id, body1, 'PUT', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/userIp']);
            this.spinner.stop('add');
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop('add');
        }
      });
  }


  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getallemployee() {
    this.alluser = [];
    let bb1 = {
      page: '',
      limit: '',
      companyMasterID: this.company_id,
    };
    this.api
      .callApi(this.constant.GETALLUSERS, bb1, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.alluser = res.data;

          this.selectAllForDropdownItems(this.alluser);
          this.alluser.map((el) => {
            el.name = el.firstName + ' ' + el.lastName + ' (' + el.userNumber + ')';
          });
          // let data1=[];
          // this.alldepartment.forEach(async (rating) => {
          //   data1.push(rating.departmentId)
          // });
          // this.selected1=data1;
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




}
