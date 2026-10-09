import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { saveAs } from 'file-saver';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ItemOptionsPerPageArray } from 'src/app/constants/CommonFilterFields';

@Component({
    selector: 'app-my-extra-days',
    templateUrl: './my-extra-days.component.html',
    styleUrls: ['./my-extra-days.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyExtraDaysComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('datefilter2') datefilter2: NgForm;
  @ViewChild('addcoff') addcoff: NgForm;
  @ViewChild('lgModal2') lgModal2: ModalDirective;

  permissioncreate: any = [];
  permissionedit: any = [];
  permissionview: any = [];
  permissiondelete: any = [];

  ipAddress: any;
  referencedata: any;
  page = {
    totalCount: 0,
    offset: 0,
  };
  itemOptionsPerPage = ItemOptionsPerPageArray;
  allbranch: any[];
  cancelReqBody = {
    cancelRemarks: '',
    extraDaysID: null,
  };
  rows = [];
  finalbranch: string;
  selected: any[];
  daysOptions: any = [0.5, 1, 1.5, 2];
  selectedDays: number = 0.5;
  ownerList: any[];
  selected3: any = [];
  allcomp: any;
  usertype: any;
  company_id: any;

  limit = 10;
  body1 = {
    userMasterID: [+localStorage.getItem('id')],
    fromDate: '',
    searchQuery: '',
    toDate: '',
    page: 1,
    limit: 10,
    companyMasterID: null,
    exportData: false,
  };

  scrollBarHorizontal = window.innerWidth < 1201;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private http: HttpClient,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit(): void {
    this.body1 = {
      userMasterID: [+localStorage.getItem('id')],
      fromDate: '',
      searchQuery: '',
      toDate: '',
      page: 1,
      limit: 10,
      companyMasterID: +localStorage.getItem('company_id'),
      exportData: false,
    };
    this.page = {
      totalCount: 0,
      offset: 0,
    };

    this.usertype = localStorage.getItem('usertype');
    this.company_id = localStorage.getItem('company_id');
    this.getIPAddress();
    this.checkpermission();
    this.getExtraDays();

  }


  onLimitChange(ev: any) {
    this.body1.limit = ev;
    this.getExtraDays();
  }



  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }




  getIPAddress() {
    this.http.get('https://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
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
              permissionval.formName == 'MyExtraDays' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop();
        }
      });
  }

  onSubmit() {
    if (!this.datefilter.valid && !this.body1.exportData) {
      return;
    }
    this.body1.page = 1;
    this.body1.fromDate = this.datefilter.value.fromDate;
    this.body1.toDate = this.datefilter.value.toDate;
    this.getExtraDays();
  }

  getExtraDays() {
    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.GETALLEXTRADAYS, this.body1, 'POST', true, false, true,  this.body1.exportData)
      .subscribe((res: any) => {
        if (res.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.body1.exportData = false;
          var blob = new Blob([res], { type: 'text/xlsx' });
          saveAs(blob, `Extra Days.xlsx`);
        }else{
          if (res.status == 200) {
            this.rows = res.data;
            this.page.totalCount = res.totalCount;
          }
        }
        this.spinner.stop('getdata');
      });
  }

  showdata(row) {
    let extraDaysID = row.extraDaysID;
    this.api
      .callApi(
        this.constant.GETEXTRADAYSAUTHORIZATIONBYID + extraDaysID,
        {},
        'GET',
        true,
        false,
        true,
      )
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.referencedata = res.data;
          this.spinner.stop();
        }
      });
  }

  onPageChange(data) {
    this.body1.page = data.page;
    this.body1.limit = data.itemsPerPage;
    this.getExtraDays();
  }




  downloadExcel() {
    this.body1.exportData = true;
    this.onSubmit()
  }

  clear(){
    this.datefilter.resetForm();
    setTimeout(() => {
      this.ngOnInit();
    }, 200)
  }

  cancelPopup(val){
    this.cancelReqBody.extraDaysID = val.extraDaysID;
  }
}
