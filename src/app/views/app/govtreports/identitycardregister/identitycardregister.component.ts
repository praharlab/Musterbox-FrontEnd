import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-identitycardregister',
    templateUrl: './identitycardregister.component.html',
    styleUrls: ['./identitycardregister.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class IdentitycardregisterComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  rows = [];
  apiURL = environment.apiUrl;
  ColumnMode = ColumnMode;
  temp = [];
  itemsPerPage = 10;
  itemOptionsPerPage = ItemOptionsPerPageArray;
  SelectionType = SelectionType;
  selectAllState = '';
  scrollBarHorizontal = window.innerWidth < 1201;
  finaldata: boolean = false;
  filterData = {
    page: 1,
    limit: 10,
    id: localStorage.getItem('company_id'),
  };

  body = {
    companyMasterId: '',
    branchMasterID: '',
  };
  page = {
    totalCount: 0,
    offset: 0,
  };
  events: any;
  filter: any;
  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];
  limit = 10;

  company_id: any;

  company1: any;

  image: any;
  image1: any;

  branch: any;
  companyData: any;
  id: any;
  branch1: any;
  excelevents: any;
  dob: void;
  imgshow1: boolean;
  imgshow: boolean;
  display = false;
  branchAddress_display = true;
  companyAddress_display = false;
  companyUser: any;
  User: any = [];
  orderByValue: any

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.orderByValue = 'displayName'
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
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

  checkpermission() {
    this.spinner.start();
    let body = {
      userMasterID: localStorage.getItem('id'),
    };
    this.api
      .callApi(this.constant.GETPERMISSION, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          let permission = res.data;
          this.permissionview = permission.filter((permissionval) => {
            return (
              permissionval.formName == 'IdCardRegistery' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.rows = [];
    this.display = false;
    let body = {
      companyMasterID: this.datefilter.value.company,
      branchMasterID: this.datefilter.value.branch,
      orderBy: this.orderByValue
    };
    if (this.datefilter.value.branch == '') {
      this.branchAddress_display = false;
      this.companyAddress_display = true;
    }
    this.spinner.start();
    this.api
      .callApi(this.constant.GETEMPLOYEEDATA, body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.filter = 'filter';
          this.rows = res.data;
          if (this.rows.length == 0) {
            this.display = true;
          }
          this.spinner.stop();
        }
      });
  }


  selectcompany(id) {
    this.display = false;
    this.branchAddress_display = true;
    this.companyAddress_display = false;
    this.companyData = [];
    this.User = [];

    this.spinner.start();
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.branch = res;
        this.spinner.stop();
      });

    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
          this.rows = [];
          this.spinner.stop();
        }
      });

  }

  selectBranch(id) {
    this.display = false;
    this.User = [];
    this.api
      .callApi(this.constant.VIEWBRANCH + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.branch1 = res.data;
          this.rows = [];
        }
      });

  }




  editimage(image) {
    this.image = image;
  }

  clear() {
    this.display = false;
    this.datefilter.resetForm();
    this.rows = [];
    this.branch1 = [];
    this.branch = [];
    this.companyData = [];
  }

  formatDate(value) {
    let date = new Date(value);
    const day = date.toLocaleString('default', { day: '2-digit' });
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.toLocaleString('default', { year: 'numeric' });

    return day + '-' + month + '-' + year;
  }
}
