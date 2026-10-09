import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';
import { environment } from 'src/environments/environment';

var Size = Quill.import('attributors/style/size');
import Quill from 'node_modules/quill';
import { letterHeadOptions } from 'src/app/constants/commonVariables';


Size.whitelist = [
  '8px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px',
  '34px',
  '36px',
  '38px',
  '40px',
  '42px',
  '44px',
  '46px',
  '48px',
  '50px',
];
Quill.register(Size, true);

let Font = Quill.import('formats/font');
Font.whitelist = ['inconsolata', 'roboto', 'mirza', 'arial', 'calibri'];
Quill.register(Font, true);


@Component({
    selector: 'app-edit-appointment-letter',
    templateUrl: './edit-appointment-letter.component.html',
    styleUrls: ['./edit-appointment-letter.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAppointmentLetterComponent implements OnInit {
  @ViewChild('lettertemp') lettertemp: NgForm;
  adminRoot = environment.adminRoot;

  letterHeadOptions = letterHeadOptions

  ipAddress: any;
  company1: any;
  permissiondelete: any;
  permissionedit: any;
  permissionview: any;
  permissioncreate: any;
  fields: boolean;
  letterfields: any = [];
  databasefields: any = ["PageBreak"]

  joiningletterdata: any;
  formValue: any;
  allData: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    private formValueStorageService: FormValueStorageService,

  ) { }
  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.getIPAddress();
    this.getcompany();
    this.editdata();
    this.getFields();
  }
  getFields() {
    const body = {
      letterTypeID: 6,
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLLETTERTEMPLATETYPEBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.allData = res.data;
          for (var item of this.allData) this.letterfields.push(item.letterFieldsname);
          this.spinner.stop('company');
        } else {
          // this.handleCatchError('something went weong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.spinner.stop('company');
        this.handleCatchError(err.error.message);
      },
    );
  }
  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
    };
    this.spinner.start('company');
    this.api.callApi(this.constant.GETALLCOMPANYBYID, body, 'POST', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.company1 = res.data;
          this.spinner.stop('company');
        } else {
          this.handleCatchError('something went weong!');
          this.spinner.stop('company');
        }
      },
      (err) => {
        this.spinner.stop('company');
        this.handleCatchError(err.error.message);
      },
    );
  }

  editdata() {
    
    this.spinner.start('data');
    this.api
      .callApi(
        this.constant.GETAPPOINMENTLETTER,
        {
          appointmentLetterID: this.formValue.ListAppointmentLetterComponent.id,
        },
        'POST',
        false,
        true,
        true,
      )
      .subscribe(
        (res: any) => {
          this.joiningletterdata = res.data;
          this.spinner.stop('data');
          
        },
        (err) => {
          this.handleCatchError(err.error.message);
          this.spinner.stop('data');
        },
      );
  }

  onSubmit() {
    if (!this.lettertemp.valid) {
      return;
    }
    let body = {
      appointmentLetterName: this.lettertemp.value.appointmentLetterName,
      letterTemplate: this.lettertemp.value.body,
      letterHead: this.lettertemp.value.letter_head,
      companyMasterID: this.lettertemp.value.company,
      appointmentLetterID: this.formValue.ListAppointmentLetterComponent.id,
    };

    this.spinner.start('submit');
    this.api.callApi(this.constant.UPDATEAPPOINMENTLETTER, body, 'PUT', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create(
            'Done',
            res.message,
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            },
          );
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/utilitys/appoinment']);
            this.spinner.stop('submit');
          }, 3000);
        } else {
          this.notifications.create(
            'Oops!',
            res.message,
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: false,
            },
          );
          this.spinner.stop('submit');
        }
      },
      (err) => {
        this.spinner.stop('submit');
        this.handleCatchError(err.error.message);
      },
    );
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  handleCatchError(message: string) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 2000,
      showProgressBar: false,
    });
  }


  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }

}
