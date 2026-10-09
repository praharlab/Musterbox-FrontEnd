import { Component, ViewChild, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import { ConstantService } from 'src/app/services/constant.service';
import { NgForm } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-form-er01',
    templateUrl: './form-er01.component.html',
    styleUrls: ['./form-er01.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FormER01Component implements OnInit {
  @ViewChild('datefilter') datefilter: NgForm;
  @ViewChild('content') content: ElementRef;

  permissionview: any = [];
  finaldata: boolean = false;
  company_id: any;
  scrollBarHorizontal: boolean;
  company1: any;
  companyData: any;
  branch: any;
  fromMonth: any;
  toMonth: any;
  rows: any = [];
  result: any;
  result1: any;
  company: any;
  Branch: any;
  startYear: number;
  branch1: any;
  Year: any = [];
  body = {
    companyMasterID: '',
    year: '',
    quarter: '',
  };
  selectedCompany: any;
  display = false;

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

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.checkpermission();
    this.getcompany();
    this.year();
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

  year() {
    let startYear = new Date();
    let nextYear = startYear.getFullYear() + 2;
    let startyear1 = startYear.getFullYear() + 1;
    for (var i = 0; i < 30; i++) {
      startyear1 = startyear1 - 1;
      nextYear = nextYear - 1;
      this.Year.push(startyear1 + '-' + nextYear);
    }
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
              permissionval.formName == 'Form-ER-01' && permissionval.operationName.includes('View')
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

    this.body.companyMasterID = this.datefilter.value.company;
    this.body.year = this.datefilter.value.fromdate;
    this.body.quarter = this.datefilter.value.quarter;

    this.spinner.start();
    this.api
      .callApi(this.constant.FORMER01, this.body, 'POST', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.rows = res.data;
          this.display = true;
          this.spinner.stop();
        }
      });
  }

  selectcompany(id) {
    this.clear();
    this.selectedCompany = id;

    this.spinner.start();
    this.api
      .callApi(this.constant.VIEWCOMPANYDATA + id, {}, 'GET', true, false, true)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.companyData = res.data;
          this.spinner.stop();
        }
      });
  }

  selectQuarter(id) {
    this.display = false;
  }

  selectFromdate(id) {
    this.display = false;
  }

  clear() {
    this.datefilter.resetForm();
    this.rows = [];
    this.body = {
      companyMasterID: '',
      year: '',
      quarter: '',
    };
    this.companyData = [];
    this.display = false;
  }

  convetToPDF() {
    this.spinner.start();
    let DATA: any = document.getElementById('content');
    html2canvas(DATA, { scale: 5 }).then((canvas) => {
      var imgWidth = 297;
      // var imgWidth = 290;
      var pageHeight = 420;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a3');
      //

      let position = 20;

      PDF.addImage(FILEURI, 'PNG', 15, position, imgWidth, imgHeight + 15, 'someAlias', 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        // let position = 20;
        PDF.addPage();
        // PDF.text("  ", 10, 30);
        var margin = 15;
        PDF.addImage(
          FILEURI,
          'PNG',
          margin,
          position,
          imgWidth,
          imgHeight + 15,
          'someAlias',
          'FAST',
        );
        heightLeft -= pageHeight;
      }
      PDF.save('Form-ER01.pdf');

      this.spinner.stop();
    });
  }
}
