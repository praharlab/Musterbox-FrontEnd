import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-auto-mail-setup',
    templateUrl: './edit-auto-mail-setup.component.html',
    styleUrls: ['./edit-auto-mail-setup.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAutoMailSetupComponent implements OnInit {
  @ViewChild('editAutoMailSetup') editAutoMailSetup: NgForm;
  @ViewChild('accept') accept: NgForm;

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
  adminRoot = environment.adminRoot;
  weekDays = [
    { day: "Monday", value: "1" },
    { day: "Tuesday", value: "2" },
    { day: "Wednesday", value: "3" },
    { day: "Thursday", value: "4" },
    { day: "Friday", value: "5" },
    { day: "Saturday", value: "6" },
    { day: "Sunday", value: "7" },
  ];
  monthDays = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  dayData: null;
  selectedCompany: any;
  formValue: any;
  MailSetupData: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');
    this.selectedCompany = +this.company_id;
    this.getcompany();
    this.getIPAddress();
    this.editdata();
  }
  editdata() {
    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.GETBYIDAUTOMAILSETUP + this.formValue.ListAutoMailSetupComponent.id,
        {},
        'GET',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.MailSetupData = res.data;
          let temp = this.MailSetupData.userMasterID;
          this.selectcompany(this.MailSetupData.companyMasterID);
          this.MailSetupData.userMasterID = temp;
          this.spinner.stop('data');
        },
        (err) => {
          this.handleCatchError(err.error.message);
          this.spinner.stop('data');
        },
      );
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
          this.allcomp = res.data;

          this.spinner.stop();
        }
      });

  }

  selectcompany(event) {
    this.ownerList = [];
    this.MailSetupData.userMasterID = [];

    if (event) {
      this.company_id = event;
      const filterData = {
        companyMasterID: event,
      };
      this.spinner.start('users');
      this.api
        .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.ownerList = res.data;
            this.selectAllForDropdownItems(this.ownerList);
            this.spinner.stop('users');
          }
        });
    }
  }

  onSubmit() {

    if (!this.editAutoMailSetup.valid) {
      return;
    }
    
    const body = {
      id: this.formValue.ListAutoMailSetupComponent.id,
      companyMasterID: this.editAutoMailSetup.value.company,
      userMasterID: this.editAutoMailSetup.value.userMasterID,
      mailType:this.editAutoMailSetup.value.mailType,
      mailMode: this.editAutoMailSetup.value.mailMode,
      time: this.editAutoMailSetup.value.time,
      day: this.editAutoMailSetup.value.day,
    }

    this.spinner.start('add');
    this.api
      .callApi(this.constant.UPDATEAUTOMAILSETUP, body, 'PUT', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/utilitys/Auto-Mail-Setup']);
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


  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    // if (ext.toLowerCase() == 'png' && ext.toLowerCase() == 'jpg' && ext.toLowerCase() == 'jpeg') {
    //   //this.toastr.error('Selected file format is not supported!!', 'Success!',{timeOut:3000});
    //   this.notifications.create(
    //     'Error',
    //     'Selected file format is not supported',
    //     NotificationType.Bare,
    //     {
    //       theClass: 'outline primary',
    //       timeOut: 3000,
    //       showProgressBar: false,
    //     },
    //   )
    // }
    // else{

    this.file = event.target.files && event.target.files[0];
    if (this.file) {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      if (this.file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (this.file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      };
    }
    //}
  }

  handleCatchError(message: string) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }
  ChangeDay() {
    this.MailSetupData.day = null
  }
}
