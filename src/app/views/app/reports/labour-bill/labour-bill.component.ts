import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-labour-bill',
    templateUrl: './labour-bill.component.html',
    styleUrls: ['./labour-bill.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LabourBillComponent implements OnInit {

  @ViewChild('datefilter') datefilter: NgForm;
  rows = [];
  scrollBarHorizontal = window.innerWidth < 1201;

  filterData = {
    month: '',
    companyId: '',
    contractorId: [],
  };

  childcompany: any;
  company_id: any;
  cid: any;
  company: any;


  permissionview: any = [];
  allContractor: any;
  selectedContractor: any[] = [];
  usertype: number;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private router: Router,
    private notifications: AppNotificationService,
    private http: HttpClient,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.company_id = localStorage.getItem('company_id');
    this.cid = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
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
            this.company = res.data;
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
            this.company = res.data;

            this.spinner.stop();
          }
        });
    }
  }

  checkpermission() {
    this.spinner.start('permission');
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
              permissionval.formName == 'LabourChargesBill' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  selectcompany(id) {
    this.allContractor = [];
    this.selectedContractor = [];

    if (id) {
      this.spinner.start('contractor');
      this.api
        .callApi(this.constant.GETALLDATA + `?companyMasterID=${id}`, {}, 'GET', true, false, true)
        .subscribe((res: any) => {
          this.allContractor = res.data;
          this.selectAllForDropdownItems(this.allContractor);
          this.spinner.stop('contractor');
        });
    }
  }

  getData() {
    this.spinner.start('getdata');
    this.api
      .callApi(this.constant.LABOURCHARGESBILL, this.filterData, 'POST', true, false, true)
      .subscribe(
        (res: any) => {
          if (res.status == 200) {
            let base64String = res.data;
            this.downloadPdf(base64String, 'Labour Charges Bill');
          }
          this.spinner.stop('getdata');
        },
        (err) => {
          this.spinner.stop('getdata');
        },
      );
  }

  convertBase64ToBlob(base64String: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/pdf' });
  }

  downloadPdf(base64String: string, fileName: string) {
    const blob = this.convertBase64ToBlob(base64String);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  onSubmit() {
    if (!this.datefilter.valid) {
      return;
    }

    this.filterData.companyId = this.datefilter.value.cid;
    this.filterData.contractorId = this.selectedContractor;
    this.filterData.month = this.datefilter.value.YearMM.replace('-', '');
    this.getData();
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = (items) => {
      items.forEach((element) => {
        element['selectedAllGroup'] = 'All';
      });
    };
    allSelect(items);
  }

  clear() {
    this.datefilter.resetForm();
    this.ngOnInit();
  }

}
