import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'app-add-asset-master',
    templateUrl: './add-asset-master.component.html',
    styleUrls: ['./add-asset-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddAssetMasterComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('addcomp1') addcomp1: NgForm;
  @ViewChild('lgModal1') lgModal1: any;
  @ViewChild('closeModal2') closeModal2: ElementRef;

  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  parentformdata: any = ['a', 'b', 'c', 'd'];
  employee: any;
  assetcategory1: any;
  fileselected?: Blob;
  pdfUrl?: string;
  base64: string;
  comp: any;
  usertype: any;
  company_id: any;
  childcompany: string;
  adminRoot = environment.adminRoot;
  quantityValue: number = 1;
  values = [];
  i: any;
  value: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private sant: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');

    this.getIPAddress();
    this.getcompany();
  }

  get quantityValid(): boolean {
    return this.quantityValue >= 0 || isNaN(this.quantityValue);
  }
  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
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
          this.comp = res.data;
          this.spinner.stop();
        }
      });
  }

  getassetcategory(id1: any) {
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id1,
    };
    this.spinner.start('comp');
    this.api
      .callApi(this.constant.GETASSETCATEGORYBYCOMPID, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.assetcategory1 = res.data;
        }
        this.spinner.stop('comp');
      });
  }

  setcompid(id: any) {
    this.getassetcategory(id);
  }

  onSelectFile(event: any) {
    let filename = event.target.files[0].name;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.toLowerCase() != 'pdf') {
      this.notifications.create(
        'Error',
        'Selected file format is not supported!!',
        NotificationType.Bare,
        { theClass: 'outline primary', timeOut: 3000, showProgressBar: false },
      );
    } else {
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
    }
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    if(!this.addcomp.value.quantity || this.addcomp.value.quantity<1){
      this.notifications.create('Validation Error', "Quantity should be greater than 0!", NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }

    this.spinner.start();
    let formData = new FormData();

    formData.append('assetDocument', this.file);

    formData.append('assetSerialNo', this.addcomp.value.assetSerialNo);
    formData.append('assetName', this.addcomp.value.assetName);
    formData.append('assetCategoryID', this.addcomp.value.assetCategoryID);
    formData.append('description', this.addcomp.value.description);
    formData.append('quantity', this.addcomp.value.quantity);
    formData.append('purchaseDate', this.addcomp.value.purchaseDate);
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);

    if (this.childcompany == 'false') {
      formData.append('companyMasterID', this.addcomp.value.company);
    } else {
      formData.append('companyMasterID', localStorage.getItem('company_id'));
    }


    this.api.callApi(this.constant.CREATEASSETMASTER, formData, 'POST', true, true, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.notifications.create('Done', res.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: true,
          });
          setTimeout(() => {
            this.router.navigate([this.adminRoot + '/masters/assetMaster']);

            this.spinner.stop();
          }, 3000);
        } else {
          this.notifications.create('Error', res.message, NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        }
      },
      (err) => {
        this.notifications.create('Error', err, NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 3000,
          showProgressBar: false,
        });
        this.spinner.stop();
      },
    );
  }

  closeModal(): void {
    this.lgModal1.hide();
    this.addcomp1.reset();
  }

  onSubmit1() {
    if (!this.addcomp1.valid) {
      return;
    }
    let body;

    if (this.childcompany == 'false') {
      body = {
        assetCategory: this.addcomp1.value.assetcategory,
        companyMasterID: this.addcomp1.value.company,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        assetCategory: this.addcomp1.value.assetcategory,
        companyMasterID: localStorage.getItem('company_id'),
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    }


    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEASSETCATEGORYDATA, body, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.closeModal2.nativeElement.click();
            this.addcomp1.resetForm();
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.getassetcategory(body.companyMasterID);
              this.spinner.stop();
            }, 3000);
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
    this.addcomp1.reset();
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
