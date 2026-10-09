import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
var Size = Quill.import('attributors/style/size');
import Quill from 'node_modules/quill';


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
Font.whitelist = ['inconsolata', 'roboto', 'mirza', 'arial','calibri'];
Quill.register(Font, true);
@Component({
    selector: 'app-add-letter-editor',
    templateUrl: './add-letter-editor.component.html',
    styleUrls: ['./add-letter-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddLetterEditorComponent implements OnInit {
  @ViewChild('lettertemp') lettertemp: NgForm;
  adminRoot = environment.adminRoot;

  file: any = [];
  format: any;
  url: any;
  ipAddress: any;
  usertype: any;
  childfields: boolean;
  company_id: string;
  cid: string;
  childcompany: string;
  company1: any;
  employee: any;
  selected3: any[];
  permissiondelete: any;
  permissionedit: any;
  permissionview: any;
  permissioncreate: any;
  isdisabled: boolean;
  lettertype_id: any;
  letter: any;
  lettertype: any;
  selectedOption: any;
  customPercentage: boolean;
  lettertempt: boolean = false;
  lettertempt1: boolean = false;
  uploadfile1: any;
  ttype: any = '';
  letterfields: any = [];
  fields: boolean;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) {}
  ngOnInit(): void {
    this.lettertype_id = localStorage.getItem('lettertype_id');
    this.childfields = localStorage.getItem('childfields') === 'false'; // Convert to boolean
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');

    this.getIPAddress();
    this.getlettertype();
    this.getcompany();
  }

  changelettertemp(value: any) {
    if (value == '1') {
      this.lettertempt = true;
      this.lettertempt1 = false;
      this.fields = false;
    } else {
      this.lettertempt = false;
      this.lettertempt1 = true;
      this.fields = true;
    }
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
          this.company1 = res.data;
          this.spinner.stop();
        }
      });
  }

  getlettertype() {
    let body = {
      page: '',
      limit: '',
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETLETTERTEMPLATETYPEDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.letter = res.data;

          this.spinner.stop();
        }
      });
  }

  getletterfields(id) {
    if (id == undefined) {
      this.letterfields = [];
    } else {
      let body = {
        letterTypeID: id,
        page: '',
        limit: '',
      };

      this.spinner.start();
      this.api
        .callApi(this.constant.GETALLLETTERTEMPLATETYPEBYID, body, 'POST', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.letterfields = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  selectcompany(id) {
    if (id == undefined) {
      this.ttype = '';
      return;
    }

    let bb = {
      page: '',
      limit: '',
      companyMasterID: id,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.GETALLUSERS, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.employee = res.data;
          let data1 = [];
          this.employee.forEach(async (rating) => {
            data1.push(rating.userMasterID);
          });
          this.selected3 = data1;
        }
      });
  }

  onSubmit() {
    if (!this.lettertemp.valid) {
      return;
    }

    const formData = new FormData();

    if (!this.lettertemp.value.starttime) {
      this.lettertemp.value.starttime = '';
    }

    if (!this.lettertemp.value.day) {
      this.lettertemp.value.day = '';
    }

    let zero = '0';

    formData.append('companyMasterID', this.lettertemp.value.company);
    formData.append('letterTypeID', this.lettertemp.value.lettertype);
    formData.append('path', this.file[0]);
    formData.append('letter', this.lettertemp.value.body);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);
    formData.append('letterhead', this.lettertemp.value.letter_head);

    this.spinner.start();
    this.api.callApi(this.constant.ADDLETTEREDITOR, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.isdisabled = true;
          this.notifications.create(
            'Done',
            'Letter Template Added successfully',
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            },
          );
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/utilitys/List-Letter-Template']);
            this.spinner.stop();
          }, 3000);
          // window.location.reload();
          // this.spinner.stop();
        } else {
          this.notifications.create('Error', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Bare, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  onSelectuploadfile(event: any) {
    this.uploadfile1.push(event.target.files && event.target.files[0]);
  }

  onfileechange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.file.push(event.target.files[i]);
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onToolbarRightClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default browser context menu
    event.stopPropagation(); // Stop event propagation to prevent other listeners from receiving it
  }

}
