import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-add-assign-asset',
    templateUrl: './add-assign-asset.component.html',
    styleUrls: ['./add-assign-asset.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AddAssignAssetComponent implements OnInit {
  @ViewChild('addcomp') addcomp: NgForm;
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
  product: any;
  allbranch: any;
  tempcomp: any;
  ownerList: any;
  asset: any;
  assetN: any;
  images: any = [];
  bb = {
    companyMasterID: localStorage.getItem('company_id'),
    assetCategoryID: 0,
  };
  adminRoot = environment.adminRoot;
  selectedName: any;
  selectedUser: any;
  selectedCategory: any;
  selectedCompany:any = +localStorage.getItem('company_id');
  currDate:any = new Date().toISOString().slice(0,10);
  minDate: any;
  returnDate1: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private notifications: AppNotificationService,
    private api: ApiService,
    private constant: ConstantService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.usertype = localStorage.getItem('usertype');
    this.getIPAddress();
    this.getproduct();
    this.alldata(this.selectedCompany);
  }

  getproduct() {
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
    this.selectedName = '';
    this.selectedUser = '';
    this.selectedCategory = '';

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

    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA2 + ids, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.allbranch = res.data;
        }
        this.spinner.stop('branch');
      });

      this.spinner.start('asset')
      this.api
        .callApi(this.constant.GETASSETCATEGORYDATA1 + ids, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.asset = res.data;
          }
          this.spinner.stop('asset');
        });
  }
  changeReturnDate(date:any){
    this.minDate = date;
    this.returnDate1 = ''
  }
  assetNameselect(id: any) {
    this.assetN = [];
    this.selectedName = '';

    if(!id) return;

    this.bb.assetCategoryID = id;
    this.bb.companyMasterID = this.tempcomp;

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
    if(!this.addcomp.value.quantity || this.addcomp.value.quantity<1){
      this.notifications.create('Validation Error', "Quantity should be greater than 0!", NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 3000,
        showProgressBar: false,
      });
      return;
    }
    const formData = new FormData();
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
    formData.append('createBy', localStorage.getItem('id'));
    formData.append('createByIp', this.ipAddress);


    this.spinner.start();
    this.api
      .callApi(this.constant.CREATEEMPLOYEEASSIGN, formData, 'POST', true, true, true)
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
