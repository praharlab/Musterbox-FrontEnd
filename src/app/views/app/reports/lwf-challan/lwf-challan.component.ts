import { Component, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AppNotificationService, NotificationType } from 'src/app/services/app-notification.service';
@Component({
    selector: 'app-lwf-challan',
    templateUrl: './lwf-challan.component.html',
    styleUrls: ['./lwf-challan.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LwfChallanComponent implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
 
  scrollBarHorizontal = window.innerWidth < 1201;
  permissionview: any = [];
  company_id: any;
  finaldata: boolean = false;
  allbranch: any[] = [];
  selectedBranch: any;
  lwfChallanData: string;
  comp: any;
  companyid: any;

  constructor(
    private spinner: NgxUiLoaderService,
    private api: ApiService,
    private constant: ConstantService,
    private notifications: AppNotificationService,
  ) {
    window.onresize = () => {
      this.scrollBarHorizontal = window.innerWidth < 1201;
    };
  }

  ngOnInit() {
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
  }

  public SavePDF(): void {
    var data = document.getElementById('content');
    html2canvas(data, { scale: 2 }).then((canvas) => {
      // Few necessary setting options
      var height = 225;
      var width = 360;

      const contentDataURL = canvas.toDataURL('image/jpeg', 1.0);
      let pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'A3',
      });
      pdf.addImage(contentDataURL, 'PNG', 30, 30, width, height, '', 'SLOW');
      pdf.save('LWFChallan' + this.datefilter.value.fromdate + '.pdf'); // Generated PDF
    });
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
              permissionval.formName == 'LWFChallan' &&
              permissionval.operationName.includes('View')
            );
          });
          this.spinner.stop('permission');
        }
      });
  }

  getcompany() {
    const body = {
      companyMasterID: localStorage.getItem('company_id'),
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

  selectcompany(id: any) {
    this.selectedBranch = '';
    this.allbranch = [];

    if (!id) return;

    this.spinner.start('branch');
    this.api
      .callApi(this.constant.BRANCHBYCOMPANYDATA1 + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        this.allbranch = res;
        this.spinner.stop('branch');
      });
  }

  onSubmit() {
    if (!this.datefilter.valid) return;

    this.companyid = this.datefilter.value.company;

    this.spinner.start('get');

    let query =`?companyMasterID=${this.companyid}`;

    if(this.selectedBranch) query += `&branchMasterID=${this.selectedBranch}`;
    if(this.datefilter.value.fromdate) query += `&month=${this.datefilter.value.fromdate.replace('-', '')}`;

    this.api.callApi(this.constant.LWFCHALLAN + query, {}, 'GET', true, false, true).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.lwfChallanData = 'data:application/pdf;base64,' + res.data;
          this.spinner.stop('get');
        } else {
          this.handleError(res.message);
          this.spinner.stop('get');
        }
      },
      (err) => {
        this.handleError(err.error.message);
        this.spinner.stop('get');
      },
    );

    this.finaldata = true;
  }

  private handleError(message: any) {
    this.notifications.create('Error', message, NotificationType.Error, {
      theClass: 'outline primary',
      timeOut: 3000,
      showProgressBar: false,
    });
  }

  clear() {
    window.location.reload();
  }

  downloadPdf(base64String, fileName) {
    const source = base64String;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}.pdf`;
    link.click();
  }
  onClickDownloadPdf() {
    let base64String = this.lwfChallanData;
    this.downloadPdf(base64String, 'LWF-Challan');
  }
}
