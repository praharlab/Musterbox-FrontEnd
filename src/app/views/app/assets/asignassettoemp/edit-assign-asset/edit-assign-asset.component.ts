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
    selector: 'app-edit-assign-asset',
    templateUrl: './edit-assign-asset.component.html',
    styleUrls: ['./edit-assign-asset.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EditAssignAssetComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
  adminRoot = environment.adminRoot;

  country: any = [];
  state: any = [];
  city: any = [];
  finalcityid: any;
  file: any;
  format: any;
  url: any;
  ipAddress: any;
  company_id: any;
  usertype: any;
  product: any = [];
  allbranch: any;
  tempcomp: any;
  ownerList: any;
  asset: any;
  assetN: any;
  images: any = [];
  editbyid: any;
  apiURL = environment.apiUrl;
  bb = {
    companyMasterID: localStorage.getItem('company_id'),
    assetCategoryID: 0,
  };
  selectedName: string;
  selectedUser: string;
  selectedCategory: string;
  formValue: any;
  currDate: any = new Date().toISOString().slice(0, 10);
  minDate: any;


  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    public activatedRoute: ActivatedRoute,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
    private formValueStorageService: FormValueStorageService,

  ) { }

  ngOnInit(): void {
    this.formValue = this.formValueStorageService.getData();

    this.company_id = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.getIPAddress();
    this.edit();
  }
  changeReturnDate(date: any) {
    this.minDate = date;
    this.editbyid.returnDate = ''
  }
  edit() {
    let id = this.formValue.AsignassettoempComponent.id;

    this.api
      .callApi(this.constant.GETASSIGNASSETBYID + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.editbyid = res.data;
          this.editbyid.employee.companyMasterId = Number(this.editbyid.employee.companyMasterId);

          if (this.editbyid.assetImages) {
            for (var i = 0; i < this.editbyid.assetImages.length; i++) {
              this.editbyid.assetImages[i] =
                this.apiURL + 'uploads/user/assets/' + this.editbyid.assetImages[i];
            }
          }
          let temp1 = this.editbyid.assetMasterID;
          let temp2 = this.editbyid.employee.userMasterID;
          let temp3 = this.editbyid.assetCategoryID;
          this.alldata(this.editbyid.employee.companyMasterId);
          this.editbyid.assetMasterID = temp1;
          this.editbyid.employee.userMasterID = temp2;
          this.editbyid.assetCategoryID = temp3;
          this.assetNameselect(this.editbyid.assetCategoryID);
          this.editbyid.assetMasterID = temp1;
          this.changeReturnDate(this.editbyid.assignDate)
          this.getproduct();
          this.spinner.stop();
        }
      });
  }

  getproduct() {
    this.product = [];
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
            this.product = res.data;
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
            this.product = res.data;

            this.spinner.stop();
          }
        });
    }
  }
  alldata(ids: any) {
    this.ownerList = [];
    this.allbranch = [];
    this.assetN = [];
    this.asset = [];
    this.editbyid.assetMasterID = '';
    this.editbyid.employee.userMasterID = '';
    this.editbyid.assetCategoryID = '';
    if (!ids) return;

    this.tempcomp = ids;
    const filterData = {
      page: '',
      limit: '',
      companyMasterID: ids,
    };
    this.spinner.start('user');
    this.api
      .callApi(this.constant.GETALLUSERS, filterData, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.ownerList = res.data;
        }
        this.spinner.stop('user');
      });
    this.allbranch = [];


    this.spinner.start('assetCat');
    this.asset = [];
    this.api
      .callApi(this.constant.GETASSETCATEGORYDATA1 + ids, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.asset = res.data;

        }
        this.spinner.stop('assetCat');
      });
  }

  assetNameselect(id: any) {

    this.assetN = [];
    this.editbyid.assetMasterID = '';
    if (!id) return;

    this.bb.assetCategoryID = id;
    this.bb.companyMasterID = this.tempcomp;
    this.assetN = [];

    this.spinner.start('asset')

    this.api
      .callApi(this.constant.GETBYASSETCATEGORYID, this.bb, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.assetN = res.data;

        }
        this.spinner.stop('asset');

      });
  }
  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        // reader.readAsDataURL(event.target.files[i]);
        this.images.push(event.target.files[i]);
        // reader.onload = (event:any) => {
        //   var reader = new FileReader();

        // }
        // reader.onload = (event) => {

        //       this.url = (<FileReader>event.target).result;
        //     }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  onSubmit() {
    if (!this.addcomp.valid) {
      return;
    }
    if (!this.addcomp.value.quantity || this.addcomp.value.quantity < 1) {
      this.notifications.create('Validation Error', "Quantity should be greater than 0!", NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }
    const formData = new FormData();
    formData.append('assignAssetToEmployeeID', this.editbyid.assignAssetToEmployeeID);
    formData.append('userMasterID', this.addcomp.value.userMasterID);
    formData.append('assetCategoryID', this.addcomp.value.assetCategoryID);
    formData.append('assetMasterID', this.addcomp.value.assetName);
    formData.append('description', this.addcomp.value.description);
    formData.append('assignDate', this.addcomp.value.assignDate);
    formData.append('returnDate', this.addcomp.value.returnDate);
    formData.append('quantity', this.addcomp.value.quantity);
    for (var i = 0; i < this.images.length; i++) {
      formData.append('assetImages', this.images[i]);
    }
    formData.append('updateBy', localStorage.getItem('id'));
    formData.append('updateByIp', this.ipAddress);

    this.spinner.start();
    this.api
      .callApi(this.constant.UPDATEEMPLOYEEASSIGN, formData, 'POST', true, true, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            this.notifications.create('Done', res.message, NotificationType.Bare, {
              theClass: 'outline primary',
              timeOut: 3000,
              showProgressBar: true,
            });
            setTimeout(() => {
              this.spinner.stop();
              this.router.navigate([this.adminRoot + '/assets/assetassigntoemp']).then(() => {
                window.location.reload();
                this.spinner.stop();
              });
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
  }

  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
