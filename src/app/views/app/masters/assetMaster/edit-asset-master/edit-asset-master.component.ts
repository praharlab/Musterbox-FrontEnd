import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormValueStorageService } from 'src/app/services/form-value-storage.service';

@Component({
    selector: 'app-edit-asset-master',
    templateUrl: './edit-asset-master.component.html',
    styleUrls: ['./edit-asset-master.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAssetMasterComponent implements OnInit {
  @ViewChild('lgModal1') lgModal1: any;
  @ViewChild('addcomp') addcomp: NgForm;
  @ViewChild('closeModal1') closeModal1: ElementRef;

  @ViewChild('addcomp1') addcomp1: NgForm;
  apiURL = environment.apiUrl;
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
  assetMaster: any;
  assetcategory: any = [];
  comp: any;
  usertype: any;
  company_id: any;
  adminRoot = environment.adminRoot;

  previous_user: boolean = true;
  previous_cat: boolean = true;

  childcompany: string;
  assetcategory1: any;
  formValue: any;
  quantityValue: number = 1;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,
  ) {}

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.company_id = localStorage.getItem('company_id');
    this.childcompany = localStorage.getItem('childcompany');

    this.getIPAddress();
    this.editdata();
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
  getcompid(id: any) {
    this.previous_cat = false;
    this.previous_user = false;

    this.getuser(id);
  }

  getassetcategory(id1: any) {
    let bb = {
      page: '',
      limit: '',
      companyMasterID: id1,
    };
    this.spinner.start();
    this.api
      .callApi(this.constant.ASSETCATEGORYBYCOMPANYDATA, bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.assetcategory1 = res.data;
          this.spinner.stop();
        }
      });
  }

  getuser(id: any) {
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
          this.spinner.stop();
        }
      });
  }
  editdata() {
    let assetcat = this.formValue.ListAssetMasterComponent.id;
    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWASSETMASTERDATA + assetcat, {}, 'GET', false, true, true)
      .subscribe(
        (res: any) => {
          this.assetMaster = res.data;
          this.assetMaster.purchaseDate = this.assetMaster.purchaseDate.slice(0, 10);
          this.assetMaster.assetCategoryID = +this.assetMaster.assetCategoryID;
          this.getcompid(this.assetMaster.companyMasterID);
          this.getassetcategory(this.assetMaster.companyMasterID);
          this.spinner.stop();
        },
        (err) => {
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
            theClass: 'outline primary',
            timeOut: 3000,
            showProgressBar: false,
          });
          this.spinner.stop();
        },
      );
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
    const formData = new FormData();
    if (this.file) {
      formData.append('assetDocument', this.file);
    }

    formData.append('assetMasterID', this.formValue.ListAssetMasterComponent.id);
    formData.append('assetCategoryID', this.addcomp.value.assetCategoryID);
    formData.append('assetSerialNo', this.addcomp.value.assetSerialNo);
    formData.append('quantity', this.addcomp.value.quantity);
    formData.append('description', this.addcomp.value.description);
    formData.append('assetName', this.addcomp.value.assetName);
    formData.append('assetDocument', this.file);
    // formData.append('assetDocument', this.addcomp.value.assetDocument)
    formData.append('purchaseDate', this.addcomp.value.purchaseDate.slice(0, 10));
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);

    if (this.childcompany == 'false') {
      formData.append('companyMasterID', this.addcomp.value.company);
    } else {
      formData.append('companyMasterID', localStorage.getItem('company_id'));
    }

    this.api
      .callApi(this.constant.UPDATEASSETMASTERDATA, formData, 'POST', true, true, true)
      .subscribe(
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

  view(att: any) {
    const fileURL = `${this.apiURL}uploads/user/assets/${att}`;

    // Open the file in a new browser tab/window
    window.open(fileURL, '_blank');
  }
  onSubmit1() {
    if (!this.addcomp1.valid) {
      return;
    }
    let body;

    if (this.childcompany == 'false') {
      body = {
        assetCategoryID: this.addcomp1.value.assetcategory,
        companyMasterID: this.addcomp1.value.company,
        createBy: localStorage.getItem('id'),
        createByIp: this.ipAddress,
      };
    } else {
      body = {
        assetCategoryID: this.addcomp1.value.assetcategory,
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
            this.closeModal1.nativeElement.click();
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
          this.notifications.create('Error', err.error.message, NotificationType.Bare, {
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
